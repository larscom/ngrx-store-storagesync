import { Action } from '@ngrx/store';
import { merge } from 'lodash-es';
import { INIT_ACTION, INIT_ACTION_EFFECTS, UPDATE_ACTION } from './actions';
import { IStorageSyncOptions } from './models/storage-sync-options';
import { rehydrateState } from './rehydrate-state';
import { stateSync } from './state-sync';

/**
 * The StorageSync Meta Reducer for @ngrx/store.
 *
 * @param options The configuration for the meta reducer
 *
 * Check out github for more information.
 * @see https://github.com/larscom/ngrx-store-storagesync
 *
 * @returns the meta reducer function
 */
export const storageSync =
  <T>(options: IStorageSyncOptions<T>) =>
  (reducer: (state: T | undefined, action: Action) => T): ((state: T | undefined, action: Action) => T) => {
    const config: IStorageSyncOptions<T> = {
      rehydrate: true,
      storageKeySerializer: (key: string) => key,
      rehydrateStateMerger: (nextState, rehydratedState) => merge({}, nextState, rehydratedState),
      ...options
    };

    const { rehydrate, rehydrateStateMerger } = config;

    const shouldRehydrate = rehydrate! && isCompatibleVersion(config);
    const rehydratedState = shouldRehydrate ? rehydrateState(config) : undefined;

    return (state: T | undefined, action: Action): T => {
      const nextState = action.type === INIT_ACTION ? reducer(state, action) : (Object({ ...state }) as T);

      const shouldMerge = rehydratedState !== undefined && [INIT_ACTION, UPDATE_ACTION].includes(action.type);

      const mergedState = reducer(shouldMerge ? rehydrateStateMerger!(nextState, rehydratedState) : nextState, action);

      if ([INIT_ACTION, INIT_ACTION_EFFECTS].includes(action.type)) {
        return mergedState;
      } else {
        updateNewVersion(config);
        return stateSync(mergedState, config);
      }
    };
  };

/**
 * @internal Load version from storage to see if it matches the
 * version from the config
 *
 * @examples
 *  Storage.version = 1 and Config.version = 2 --> incompatible
 *  Storage.version = undefined and Config.version = 1 --> incompatible
 *
 *  Storage.version = 1 and Config.version = undefined --> compatible
 *  Storage.version = 1 and Config.version = 1 --> compatible
 */
const isCompatibleVersion = <T>({
  storage,
  storageError,
  storageKeySerializer,
  version
}: IStorageSyncOptions<T>): boolean => {
  if (!version) return true;

  try {
    const key = storageKeySerializer!('version');
    const versionFromStorage = Number(storage!.getItem(key));

    if (versionFromStorage === version) {
      return true;
    }
  } catch (e) {
    if (storageError) {
      storageError(e);
    } else {
      throw e;
    }
  }

  return false;
};

/**
 * @internal Update Storage with new config version
 * Remove item from Storage if version from config is undefined
 */
const updateNewVersion = <T>({
  storage,
  storageError,
  storageKeySerializer,
  version
}: Partial<IStorageSyncOptions<T>>): void => {
  try {
    const key = storageKeySerializer!('version');

    if (version) {
      storage!.setItem(key, String(version));
    } else {
      storage!.removeItem(key);
    }
  } catch (e) {
    if (storageError) {
      storageError(e);
    } else {
      throw e;
    }
  }
};
