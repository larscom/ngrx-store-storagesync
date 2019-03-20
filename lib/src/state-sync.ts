import { cloneDeep } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';

export const filterState = (state: any, keys?: string[]): any => {
  if (!keys || !keys.length) {
    return state;
  }
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
          keys
            .filter(key => key.includes('.'))
            .map(key => {
              const splitted = key.split('.');
              return { key: splitted[0], ignoreKeys: [splitted[1]] };
            })
            .filter(({ key }) => state[key] != null)
            .forEach(({ key, ignoreKeys }) => filterState(state[key], ignoreKeys));

          if (keys.includes(prop)) {
            delete state[prop];
          }
        }
      }
    }
  }
  return state;
};

export const stateSync = (
  state: any,
  { features, storage, storageKeySerializer, storageError }: IStorageSyncOptions
): void => {
  features
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey], state) : true))
    .forEach(
      ({ stateKey, ignoreKeys, storageKeySerializerForFeature, serialize, storageForFeature }) => {
        const featureState = cloneDeep(state[stateKey]);
        const filteredState = filterState(featureState, ignoreKeys);

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