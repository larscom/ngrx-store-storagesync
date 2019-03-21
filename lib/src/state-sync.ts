import { cloneDeep } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';

export const filterState = <T>(featureState: Partial<T>, keys?: string[]): Partial<T> => {
  if (!keys) {
    return featureState;
  }

  keys
    .filter(key => key.includes('.'))
    .forEach(key => {
      const splitted = key.split('.');
      const rootKey = splitted[0];
      const nestedKey = splitted[1];
      filterState(featureState[rootKey], [nestedKey]);
    });

  let index = 0;
  for (const prop in featureState) {
    if (featureState.hasOwnProperty(prop)) {
      switch (typeof featureState[prop]) {
        case 'string':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete featureState[prop];
          }
          break;
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete featureState[prop];
          } else {
            filterState(featureState[prop], keys);
          }
          break;
        default: {
          if (keys.includes(prop)) {
            delete featureState[prop];
          }
        }
      }
    }
  }
  return featureState;
};

export const cleanState = <T>(featureState: Partial<T>): Partial<T> => {
  for (const key in featureState) {
    if (!featureState[key] || typeof featureState[key] !== 'object') {
      continue;
    }

    cleanState(featureState[key]);

    if (!Object.keys(featureState[key]).length) {
      delete featureState[key];
    }
  }
  return featureState;
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

        const needsSync = Object.keys(filteredState).length || syncEmptyObjects;

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
