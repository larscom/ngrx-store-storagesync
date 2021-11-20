import { IStorageSyncOptions } from './models/storage-sync-options';

const dateMatcher = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

const skipRehydrate = <T>({
  storage,
  storageError,
  storageKeySerializer,
  version
}: Partial<IStorageSyncOptions<T>>): boolean => {
  if (!version) return false;

  try {
    const key = storageKeySerializer!('version');
    const versionFromStorage = Number(storage!.getItem(key));
    if (versionFromStorage < version) {
      return true;
    }
  } catch (e) {
    if (storageError) {
      storageError(e);
    } else {
      throw e;
    }
  }

  return false;
};

/**
 * @internal Restores the resolved state from a storage location
 * @param options the configurable options
 * @returns the restored state from the provided storage
 */
export const rehydrateState = <T>({
  storage,
  storageKeySerializer,
  features,
  storageError,
  version
}: IStorageSyncOptions<T>): T | undefined => {
  if (skipRehydrate<T>({ storage, storageKeySerializer, version })) {
    return undefined;
  }

  const state = features.reduce((acc, curr) => {
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
                : JSON.parse(featureState, (_: string, value: string) =>
                    dateMatcher.test(String(value)) ? new Date(value) : value
                  )
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
  }, Object());

  return Object.keys(state).length ? (state as T) : undefined;
};
