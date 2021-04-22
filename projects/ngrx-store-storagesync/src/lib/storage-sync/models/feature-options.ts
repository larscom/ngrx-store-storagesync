export interface IFeatureOptions<T> {
  /**
   * The name of the feature state to sync
   */
  stateKey: string;
  /**
   * Filter out (ignore) properties that exist on the feature state.
   */
  excludeKeys?: string[];
  /**
   * Provide the storage type to sync the feature state to,
   * it can be any storage which implements the 'Storage' interface.
   *
   * It will override the storage property in StorageSyncOptions
   * @see IStorageSyncOptions
   */
  storageForFeature?: Storage;
  /**
   * Sync to storage will only occur when this function returns true
   * @param featureState the next feature state
   * @param state the next state
   */
  shouldSync?: (featureState: unknown, state: T) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the storageKeySerializer in StorageSyncOptions
   * @see IStorageSyncOptions
   *
   * @param key the storage item key
   */
  storageKeySerializerForFeature?: (key: string) => string;
  /**
   * Serializer for the feature state (before saving to a storage location)
   * @param featureState the next feature state
   */
  serialize?: (featureState: unknown) => string;
  /**
   * Deserializer for the feature state (after getting the state from a storage location)
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   * @param featureState the feature state retrieved from a storage location
   */
  deserialize?: (featureState: string) => any;
}
