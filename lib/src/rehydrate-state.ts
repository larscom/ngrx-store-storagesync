import { IStorageSyncOptions } from './models/storage-sync-options';

export const dateReviver = (key: string, value: any) => {
  const isDateString =
    typeof value === 'string' && /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(value);
  return isDateString ? new Date(value) : value;
};

export const rehydrateState = ({
  restoreDates,
  storage,
  storageKeySerializer,
  features,
  storageError
}: IStorageSyncOptions): any => {
  const reviver = restoreDates ? dateReviver : (k: string, v: any) => v;
  return features.reduce((acc, curr) => {
    const { storageKeySerializerForFeature, stateKey, deserialize, storageForFeature } = curr;

    const key = storageKeySerializerForFeature
      ? storageKeySerializerForFeature(stateKey)
      : storageKeySerializer(stateKey);

    try {
      const state = storageForFeature ? storageForFeature.getItem(key) : storage.getItem(key);
      return state
        ? {
            ...acc,
            ...{
              [stateKey]: deserialize ? deserialize(state) : JSON.parse(state, reviver)
            }
          }
        : acc;
    } catch (e) {
      if (storageError) {
        storageError(e);
      } else {
        throw e;
      }
    }
  }, {});
};
