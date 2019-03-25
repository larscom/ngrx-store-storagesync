import { cloneDeep, isArray } from 'lodash';

import { StorageSyncError } from './errors';
import { IStorageSyncOptions } from './models/storage-sync-options';

/**
 * @internal Blacklisting
 * @returns returns the filtered state
 */
export const excludeKeysFromState = <T>(state: Partial<T>, excludeKeys?: string[]): Partial<T> => {
  if (!excludeKeys) {
    return state;
  }

  const keyPairs = excludeKeys.map(key => ({
    rootKey: key.split('.')[0],
    nestedKey: key.split('.')[1]
  }));

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const keyPair = keyPairs.find(pair => pair.rootKey === key);
      const rootKey = keyPair ? keyPair.rootKey : null;
      const nestedKey = keyPair ? keyPair.nestedKey : null;

      switch (typeof state[key]) {
        case 'object': {
          if (rootKey && nestedKey) {
            excludeKeysFromState<T>(state[key], [...excludeKeys, nestedKey]);
          } else if (rootKey) {
            delete state[key];
          } else {
            excludeKeysFromState<T>(state[key], excludeKeys);
          }
          break;
        }
        default: {
          if (rootKey) {
            delete state[key];
          }
        }
      }
    }
  }
  return state;
};

/**
 * @internal Whitelisting
 * @returns returns the filtered state
 */
export const includeKeysOnState = <T>(state: Partial<T>, includedKeys?: string[]): Partial<T> => {
  if (!includedKeys) {
    return state;
  }

  const keyPairs = includedKeys.map(key => ({
    rootKey: key.split('.')[0],
    nestedKey: key.split('.')[1]
  }));

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const keyPair = keyPairs.find(pair => pair.rootKey === key);
      const rootKey = keyPair ? keyPair.rootKey : null;
      const nestedKey = keyPair ? keyPair.nestedKey : null;

      switch (typeof state[key]) {
        case 'object': {
          if (!rootKey && !state[key]) {
            delete state[key];
          } else if (rootKey && isArray(state[key])) {
            continue;
          } else if (rootKey && nestedKey) {
            includeKeysOnState<T>(state[key], [...includedKeys, nestedKey]);
          } else {
            includeKeysOnState<T>(state[key], includedKeys);
          }
          break;
        }
        default: {
          if (!rootKey) {
            delete state[key];
          }
        }
      }
    }
  }

  return state;
};

/**
 * @internal Remove empty objects from state
 * @returns returns the cleaned state
 */
export const cleanState = <T>(state: Partial<T>): Partial<T> => {
  for (const key in state) {
    if (!state[key] || typeof state[key] !== 'object') {
      continue;
    }

    cleanState<T>(state[key]);

    if (!Object.keys(state[key]).length) {
      delete state[key];
    }
  }
  return state;
};

/**
 * @internal Sync state with storage
 * @param state the next state
 * @param options the configurable options
 */
export const stateSync = <T>(
  state: T,
  { features, storage, storageKeySerializer, storageError, syncEmptyObjects }: IStorageSyncOptions
): void => {
  features
    .filter(({ excludeKeys, includeKeys, stateKey }) => {
      if (excludeKeys && includeKeys) {
        throw new StorageSyncError(
          `You can't have both 'excludeKeys' and 'includeKeys' on '${stateKey}'`
        );
      }
      return true;
    })
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey], state) : true))
    .forEach(
      ({
        stateKey,
        excludeKeys,
        includeKeys,
        storageKeySerializerForFeature,
        serialize,
        storageForFeature
      }) => {
        const featureState = cloneDeep<Partial<T>>(state[stateKey]);

        const filteredState = syncEmptyObjects
          ? includeKeys
            ? includeKeysOnState(featureState, includeKeys)
            : excludeKeysFromState(featureState, excludeKeys)
          : includeKeys
          ? cleanState(includeKeysOnState(featureState, includeKeys))
          : cleanState(excludeKeysFromState(featureState, excludeKeys));

        const needsSync = Object.keys(filteredState).length > 0 || syncEmptyObjects;

        if (!needsSync) {
          return;
        }

        const key = storageKeySerializerForFeature
          ? storageKeySerializerForFeature(stateKey)
          : storageKeySerializer(stateKey);

        const value = serialize ? serialize<T>(filteredState) : JSON.stringify(filteredState);

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
      }
    );
};
