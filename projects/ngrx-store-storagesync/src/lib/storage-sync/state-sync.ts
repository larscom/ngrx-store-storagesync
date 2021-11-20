import { cloneDeep, isPlainObject } from 'lodash-es';
import { IStorageSyncOptions } from './models/storage-sync-options';

/**
 * @internal Blacklisting
 * @returns the filtered featureState
 */
export const excludeKeysFromState = (featureState: any, excludeKeys?: string[]): any => {
  if (!excludeKeys) {
    return featureState;
  }

  const keyPairs = excludeKeys.map((key) => ({
    leftKey: key.split('.')[0],
    rightKey: key.split('.')[1]
  }));

  for (const key in featureState) {
    if (featureState.hasOwnProperty(key)) {
      const keyPair = keyPairs.find((pair) => pair.leftKey === key);

      const leftKey = keyPair?.leftKey;
      const rightKey = keyPair?.rightKey;

      switch (typeof featureState[key]) {
        case 'object': {
          if (leftKey && !featureState[key]) {
            delete featureState[key];
          } else if (leftKey && rightKey) {
            excludeKeysFromState(featureState[key], [...excludeKeys, rightKey]);
          } else if (leftKey) {
            delete featureState[key];
          } else {
            excludeKeysFromState(featureState[key], excludeKeys);
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
  }

  return featureState;
};

/**
 * @internal Remove empty objects from featureState
 * @returns the cleaned featureState
 */
export const cleanState = (featureState: any): any => {
  for (const key in featureState) {
    if (!isPlainObject(featureState[key])) {
      continue;
    }

    cleanState(featureState[key]);

    if (!Object.keys(featureState[key]).length) {
      delete featureState[key];
    }
  }

  return featureState;
};

/**
 * @internal Sync state with storage
 * @param state the next state
 * @param options the configurable options
 * @returns the next state
 */
export const stateSync = <T>(
  state: T,
  { features, storage, storageKeySerializer, storageError, version }: IStorageSyncOptions<T>
): T => {
  updateVersionInStorage({ storage, storageKeySerializer, version });

  features

    .filter(({ stateKey }) => Object(state)[stateKey] !== undefined)
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(Object(state)[stateKey], state) : true))
    .forEach(({ stateKey, excludeKeys, storageKeySerializerForFeature, serialize, storageForFeature }) => {
      const featureState = cloneDeep(Object(state)[stateKey]);
      const cleanedState = cleanState(excludeKeysFromState(featureState, excludeKeys));

      if (isPlainObject(cleanedState) && !Object.keys(cleanedState).length) {
        return;
      }

      const key = storageKeySerializerForFeature
        ? storageKeySerializerForFeature(stateKey)
        : storageKeySerializer!(stateKey);

      const value = serialize ? serialize(cleanedState) : JSON.stringify(cleanedState);

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

const updateVersionInStorage = <T>({
  storage,
  storageError,
  storageKeySerializer,
  version
}: Partial<IStorageSyncOptions<T>>): void => {
  if (!version) return;

  try {
    const key = storageKeySerializer!('version');
    storage!.setItem(key, String(version));
  } catch (e) {
    if (storageError) {
      storageError(e);
    } else {
      throw e;
    }
  }
};
