import { cloneDeep } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';

export const filterState = (state: any, keys?: string[]): any => {
  if (!keys) {
    return state;
  }

  keys
    .filter(key => key.includes('.'))
    .forEach(key => {
      const splitted = key.split('.');
      const rootKey = splitted[0];
      const nestedKey = splitted[1];
      filterState(state[rootKey], [nestedKey]);
    });

  let index = 0;
  for (const prop in state) {
    if (state.hasOwnProperty(prop)) {
      switch (typeof state[prop]) {
        case 'string':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete state[prop];
          }
          break;
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete state[prop];
          } else {
            filterState(state[prop], keys);
          }
          break;
        default: {
          if (keys.includes(prop)) {
            delete state[prop];
          }
        }
      }
    }
  }
  return state;
};

export const cleanEmptyObjects = (state: any): any => {
  for (const key in state) {
    if (!state[key] || typeof state[key] !== 'object') {
      continue;
    }

    cleanEmptyObjects(state[key]);

    if (!Object.keys(state[key]).length) {
      delete state[key];
    }
  }
  return state;
};

export const stateSync = (
  state: any,
  { features, storage, storageKeySerializer, storageError, syncEmptyObjects }: IStorageSyncOptions
): void => {
  features
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey], state) : true))
    .forEach(
      ({ stateKey, ignoreKeys, storageKeySerializerForFeature, serialize, storageForFeature }) => {
        const featureState = cloneDeep(state[stateKey]);

        const filteredState = syncEmptyObjects
          ? filterState(featureState, ignoreKeys)
          : cleanEmptyObjects(filterState(featureState, ignoreKeys));

        const needsSync = Object.keys(filteredState).length || syncEmptyObjects;

        if (!needsSync) {
          return;
        }

        const key = storageKeySerializerForFeature
          ? storageKeySerializerForFeature(stateKey)
          : storageKeySerializer(stateKey);

        const value = serialize ? serialize(filteredState) : JSON.stringify(filteredState);

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
