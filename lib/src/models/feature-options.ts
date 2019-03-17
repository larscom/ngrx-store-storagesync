export interface IFeatureOptions {
  /**
   * The name of the feature state
   */
  stateKey: string;
  /**
   * Filter out properties that exist on the feature state.
   */
  ignoreKeys?: string[];
  /**
   * Sync to storage will only occur when this function returns true
   * @param featureState the next feature state
   * @param state the next state
   * @default (featureState: any) => true
   */
  shouldSync?: (featureState: any, state: any) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the global storageKeySerializer for this feature
   * @param key the storage item key
   * @default (key: string) => key
   */
  storageKeySerializerForFeature?: (key: string) => string;
  /**
   * Serializer for the feature state (before saving to a storage location)
   * @param featureState the next feature state
   * @default (featureState: any) => JSON.stringify(featureState)
   */
  serialize?: (featureState: any) => string;
  /**
   * Deserializer for the feature state (after getting the state from a storage location)
   * @param featureState the feature state retrieved from a storage location
   * @default (featureState: string) => JSON.Parse(featureState)
   */
  deserialize?: (featureState: string) => any;
}
