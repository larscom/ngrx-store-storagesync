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
   * Should the state be restored from storage?
   * @default true
   */
  rehydrate?: boolean;
  /**
   * Should the Dates be converted back to a 'Date' object after rehydration?
   * @default true
   */
  restoreDates?: boolean;
  /**
   * Serializer for storage keys
   * @default (key: string) => string
   */
  storageKeySerializer?: (key: string) => string;
}
