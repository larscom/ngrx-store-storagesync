import { IFeatureConfig } from './feature-config';

export interface IStorageSyncConfig {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureConfig[];
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Pull initial state from storage on startup
   * @default true
   */
  rehydrate?: boolean;
  /**
  * Restore serialized date objects. If you work directly with ISO date strings, set this to false
   * @default true
   */
  restoreDates?: boolean;
  /**
   * Serializer for storage keys
   * @default (key: string) => string
   */
  storageKeySerializer?: (key: string) => string;
}
