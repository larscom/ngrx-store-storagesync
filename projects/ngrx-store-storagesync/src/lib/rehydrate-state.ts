import { IStorageSyncOptions } from './models/storage-sync-options';

/**
 * @internal Restores the resolved state from a storage location
 * @param options the configurable options
 * @returns returns the restored state from the provided storage
 */
export const rehydrateState = <T>({
  storage,
  storageKeySerializer,
  features,
  storageError,
  version: currentVersion
}: IStorageSyncOptions<T>): T => {
  if (currentVersion) {
    try {
      const key = storageKeySerializer('version');
      const version = +storage.getItem(key);
      if (version < currentVersion) {
        return null;
      }
    } catch (e) {
      if (storageError) {
        storageError(e);
      } else {
        throw e;
      }
    }
  }
  const state = features.reduce<T>(
    (acc, curr) => {
      const { storageKeySerializerForFeature, stateKey, deserialize, storageForFeature } = curr;

      const key = storageKeySerializerForFeature
        ? storageKeySerializerForFeature(stateKey)
        : storageKeySerializer(stateKey);

      try {
        const featureState = storageForFeature
          ? storageForFeature.getItem(key)
          : storage.getItem(key);
        return featureState
          ? {
              ...acc,
              ...{
                [stateKey]: deserialize
                  ? deserialize(featureState)
                  : JSON.parse(featureState, (_: string, value: string) => {
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
    },
    {} as T
  );
  return Object.keys(state).length ? state : null;
};
