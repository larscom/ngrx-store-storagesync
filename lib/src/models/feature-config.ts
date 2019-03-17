export interface IFeatureConfig {
  /**
   * The name of the state
   */
  stateKey: string;
  /**
   * Filter out properties that exist on the part
   * of the state.
   * @see stateKey
   */
  ignoreKeys?: string[];
  /**
   * Sync to storage will only occur when this function returns true
   * @default (featureState: any) => true
   */
  shouldSync?: (featureState: any) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the global storageKeySerializer for this feature
   * @default (key: string) => string
   */
  storageKeySerializerForFeature?: (key: string) => string;
}
