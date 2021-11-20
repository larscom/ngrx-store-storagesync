import { IFeatureOptions } from './feature-options';

export interface IStorageSyncOptions<T> {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureOptions<T>[];
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Give the state a version. Version will be checked before rehydration.
   *
   * @examples
   *  Storage.version = 1 and Config.version = 2 --> Skip hydration
   *  Storage.version = undefined and Config.version = 1 --> Skip hydration
   *
   *  Storage.version = 1 and Config.version = undefined --> Hydrate
   *  Storage.version = 1 and Config.version = 1 --> Hydrate
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
