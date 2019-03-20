import { cloneDeep } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';

export const filterObject = (obj: Object, keys?: string[]): Object => {
  if (!keys) {
    return obj;
  }
  let index = 0;
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          }
          break;
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          } else {
            filterObject(obj[prop], keys);
          }
          break;
        default: {
          if (keys.includes(prop)) {
            delete obj[prop];
          }
        }
      }
    }
  }
  return obj;
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
        const filteredState = filterObject(featureState, ignoreKeys);

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
