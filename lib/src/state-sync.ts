import { cloneDeep } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';

export const filterState = <T>(state: Partial<T>, ignoreKeys?: string[]): Partial<T> => {
  if (!ignoreKeys) {
    return state;
  }

  ignoreKeys
    .filter(key => key.includes('.'))
    .forEach(key => {
      const splitted = key.split('.');
      const rootKey = splitted[0];
      const nestedKey = splitted[1];
      filterState(state[rootKey], [nestedKey]);
    });

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      switch (typeof state[key]) {
        case 'object':
          if (ignoreKeys.includes(key)) {
            delete state[key];
          } else {
            filterState(state[key], ignoreKeys);
          }
          break;
        default: {
          if (ignoreKeys.includes(key)) {
            delete state[key];
          }
        }
      }
    }
  }

  return state;
};

export const cleanState = <T>(state: Partial<T>): Partial<T> => {
  for (const key in state) {
    if (!state[key] || typeof state[key] !== 'object') {
      continue;
    }

    cleanState(state[key]);

    if (!Object.keys(state[key]).length) {
      delete state[key];
    }
  }
  return state;
};

export const stateSync = <T>(
  state: T,
  { features, storage, storageKeySerializer, storageError, syncEmptyObjects }: IStorageSyncOptions
): void => {
  features
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey], state) : true))
    .forEach(
      ({ stateKey, ignoreKeys, storageKeySerializerForFeature, serialize, storageForFeature }) => {
        const featureState = cloneDeep<Partial<T>>(state[stateKey]);

        const filteredState = syncEmptyObjects
          ? filterState(featureState, ignoreKeys)
          : cleanState(filterState(featureState, ignoreKeys));

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
