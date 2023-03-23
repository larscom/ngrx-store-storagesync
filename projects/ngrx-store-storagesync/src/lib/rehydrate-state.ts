import { IStorageSyncOptions } from './storage-sync-options';
import { isPlainObjectAndEmpty } from './util';

const dateMatcher = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

/**
 * @internal Restores the resolved state from a storage location
 */
export const rehydrateState = <T>({
  storage,
  storageKeySerializer,
  features,
  storageError
}: IStorageSyncOptions<T>): T | undefined => {
  const rehydratedState = features.reduce((acc, curr) => {
    const { storageKeySerializerForFeature, stateKey, deserialize, storageForFeature } = curr;

    const key = storageKeySerializerForFeature
      ? storageKeySerializerForFeature(stateKey)
      : storageKeySerializer!(stateKey);

    try {
      const featureState = storageForFeature ? storageForFeature.getItem(key) : storage.getItem(key);
      return featureState
        ? {
            ...acc,
            ...{
              [stateKey]: deserialize
                ? deserialize(featureState)
                : JSON.parse(featureState, (_: string, value: any) => {
                    return dateMatcher.test(String(value)) && !isNaN(Date.parse(value)) ? new Date(value) : value;
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
  }, Object()) as T;

  return !isPlainObjectAndEmpty(rehydratedState) ? rehydratedState : undefined;
};
