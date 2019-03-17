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
}
