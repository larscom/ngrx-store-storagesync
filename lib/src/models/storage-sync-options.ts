import { IFeatureOptions } from './feature-options';

export interface IStorageSyncOptions {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureOptions[];
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
   * @default true
   */
  rehydrate?: boolean;
  /**
   * Serializer for storage keys
   * @param key the storage item key
   * @default (key: string) => key
   */
  storageKeySerializer?: (key: string) => string;
  /**
   * Custom state merge function after rehydration (by default it does a deep merge)
   * @param state the next state
   * @param rehydratedState the state returned from a storage location
   */
  rehydrateStateMerger?: (state: any, rehydratedState: any) => any;
}
