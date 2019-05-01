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
   * Function that gets executed on a storage error
   * @param error the error that occurred
   */
  storageError?: (error: any) => void;
  /**
   * Pull initial state from storage on startup
   * @default rehydrate true
   */
  rehydrate?: boolean;
  /**
   * Serializer for storage keys
   * @param key the storage item key
   * @default storageKeySerializer (key: string) => key
   */
  storageKeySerializer?: (key: string) => string;
  /**
   * Custom state merge function after rehydration (by default it does a deep merge)
   * @param state the next state
   * @param rehydratedState the state resolved from a storage location
   * @default rehydrateStateMerger (state: T, rehydratedState: T) => deepMerge(state, rehydratedState)
   */
  rehydrateStateMerger?: (state: T, rehydratedState: T) => T;
  /**
   * Keep empty objects ({}) in state
   * @default keepEmptyObjects false
   */
  keepEmptyObjects?: boolean;
}
