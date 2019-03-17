export interface IFeatureConfig {
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
   * @default (featureState: any) => true
   */
  shouldSync?: (featureState: any) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the global storageKeySerializer for this feature
   * @param key the storage item key
   * @default (key: string) => key
   */
  storageKeySerializerForFeature?: (key: string) => string;
}
