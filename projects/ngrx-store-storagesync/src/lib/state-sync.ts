import { IStorageSyncOptions } from './models/storage-sync-options';
import { isNotPlainObject, isPlainObjectAndEmpty, isPlainObjectAndNotEmpty } from './util';

/**
 * @internal Remove empty objects
 */
const removeEmptyObjects = (object: any): any => {
  for (const key in object) {
    if (isNotPlainObject(object[key])) {
      continue;
    }

    if (isPlainObjectAndNotEmpty(object[key])) {
      removeEmptyObjects(object[key]);
    }

    if (isPlainObjectAndEmpty(object[key])) {
      delete object[key];
    }
  }

  return object;
};

/**
 * @internal Exclude properties from featureState
 */
export const excludeKeysFromState = <T>(featureState: Partial<T>, excludeKeys?: string[]): Partial<T> => {
  if (!excludeKeys) {
    return featureState;
  }

  const keyPairs = excludeKeys.map((key) => ({
    leftKey: key.split('.')[0],
    rightKey: key.split('.')[1]
  }));

  for (const key in featureState) {
    const keyPair = keyPairs.find((pair) => pair.leftKey === key);
    const leftKey = keyPair?.leftKey;
    const rightKey = keyPair?.rightKey;

    switch (typeof featureState[key]) {
      case 'object': {
        if (leftKey && rightKey) {
          excludeKeysFromState(featureState[key] as Partial<T>, [...excludeKeys, rightKey]);
        } else if (leftKey) {
          delete featureState[key];
        } else {
          excludeKeysFromState(featureState[key] as Partial<T>, excludeKeys);
        }
        break;
      }
      default: {
        if (leftKey) {
          delete featureState[key];
        }
      }
    }
  }

  return removeEmptyObjects(featureState);
};

/**
 * @internal Sync state with storage
 */
export const stateSync = <T>(
  state: T,
  { features, storage, storageKeySerializer, storageError }: IStorageSyncOptions<T>
): T => {
  features
    .filter(({ stateKey }) => state[stateKey as keyof T] !== undefined)
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey as keyof T], state) : true))
    .forEach(({ stateKey, excludeKeys, storageKeySerializerForFeature, serialize, storageForFeature }) => {
      const featureStateClone = JSON.parse(JSON.stringify(state[stateKey as keyof T])) as Partial<T>;
      const featureState = excludeKeysFromState(featureStateClone, excludeKeys);

      if (isPlainObjectAndEmpty(featureState)) {
        return;
      }

      const key = storageKeySerializerForFeature
        ? storageKeySerializerForFeature(stateKey)
        : storageKeySerializer!(stateKey);

      const value = serialize ? serialize(featureState) : JSON.stringify(featureState);

      try {
        if (storageForFeature) {
          storageForFeature.setItem(key, value);
        } else {
          storage.setItem(key, value);
        }
      } catch (e) {
        if (storageError) {
          storageError(e);
        } else {
          throw e;
        }
      }
    });

  return state;
};
