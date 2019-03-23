export interface IFeatureOptions {
  /**
   * The name of the feature state
   */
  stateKey: string;
  /**
   * Filter out properties that exist on the feature state.
   * Can't be used together with includeKeys
   * @see includeKeys
   * @throws StorageSyncError if includeKeys is also present
   */
  excludeKeys?: string[];
  /**
   * Only sync these properties on the feature state
   * Can't be used together with excludeKeys
   * @see excludeKeys
   * @throws StorageSyncError if excludeKeys is also present
   */
  includeKeys?: string[];
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
   * @default shouldSync(featureState: Partial<T>) => true
   */
  shouldSync?: <T>(featureState: Partial<T>, state: T) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the global storageKeySerializer for this feature
   * @param key the storage item key
   * @default storageKeySerializerForFeature(key: string) => key
   */
  storageKeySerializerForFeature?: (key: string) => string;
  /**
   * Serializer for the feature state (before saving to a storage location)
   * @param featureState the next feature state
   * @default serialize(featureState: Partial<T>) => JSON.stringify(featureState)
   */
  serialize?: <T>(featureState: Partial<T>) => string;
  /**
   * Deserializer for the feature state (after getting the state from a storage location)
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   * @param featureState the feature state retrieved from a storage location
   * @default deserialize (featureState: string) => JSON.Parse(featureState)
   */
  deserialize?: <T>(featureState: string) => Partial<T>;
}
