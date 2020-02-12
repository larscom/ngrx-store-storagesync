import { IFeatureOptions } from './feature-options';

export interface IStorageSyncOptions<T> {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: Array<IFeatureOptions<T>>;
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Give the state a version number. Version number will be checked on rehydration.
   *
   * Skips rehydration if version from storage < version
   */
  version?: number;
  /**
   * Function that gets executed on a storage error
   * @param error the error that occurred
   */
  storageError?: (error: any) => void;
  /**
   * Restore last known state from storage on startup
   */
  rehydrate?: boolean;
  /**
   * Serializer for storage keys
   * @param key the storage item key
   */
  storageKeySerializer?: (key: string) => string;
  /**
   * Custom state merge function after rehydration (by default it does a deep merge)
   * @param state the next state
   * @param rehydratedState the state resolved from a storage location
   */
  rehydrateStateMerger?: (state: T, rehydratedState: T) => T;
}
