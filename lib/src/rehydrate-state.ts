import { IStorageSyncOptions } from './models/storage-sync-options';

export const rehydrateState = ({
  storage,
  storageKeySerializer,
  features,
  storageError
}: IStorageSyncOptions): any => {
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
              [stateKey]: deserialize
                ? deserialize(state)
                : JSON.parse(state, (_: string, value: string) => {
                    // parse ISO date strings
                    return /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(String(value))
                      ? new Date(value)
                      : value;
                  })
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
