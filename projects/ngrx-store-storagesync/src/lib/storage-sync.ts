import { Action } from '@ngrx/store'
import { mergeDeepRight } from 'ramda'
import { INIT_ACTION, INIT_ACTION_EFFECTS, UPDATE_ACTION } from './actions'
import { rehydrateState } from './rehydrate-state'
import { IStorageSyncOptions } from './storage-sync-options'
import { syncWithStorage } from './sync-with-storage'

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
      rehydrateStateMerger: (nextState, rehydratedState) => mergeDeepRight<any, any>(nextState, rehydratedState),
      ...options
    }

    const { rehydrate, rehydrateStateMerger } = config

    const shouldRehydrate = rehydrate! && isCompatibleVersion(config)
    const rehydratedState = shouldRehydrate ? rehydrateState(config) : undefined

    return (state: T | undefined, action: Action): T => {
      const nextState = action.type === INIT_ACTION ? reducer(state, action) : ({ ...state } as T)
      const shouldMerge = rehydratedState !== undefined && [INIT_ACTION, UPDATE_ACTION].includes(action.type)
      const mergedState = reducer(shouldMerge ? rehydrateStateMerger!(nextState, rehydratedState) : nextState, action)

      if (![INIT_ACTION, INIT_ACTION_EFFECTS].includes(action.type)) {
        updateNewVersion(config)
        syncWithStorage(mergedState, config)
      }

      return mergedState
    }
  }

/**
 * @internal Load version from storage to see if it matches the
 * version from the config
 *
 * @examples
 *  Storage.version = 1 and Config.version = 2 --> incompatible, skip hydration
 *
 *  Storage.version = undefined and Config.version = 1 --> incompatible, skip hydration
 *
 *  Storage.version = 1 and Config.version = undefined --> unknown, incompatible, skip hydration
 *
 *  Storage.version = 1 and Config.version = 1 --> compatible, hydrate
 */
const isCompatibleVersion = <T>({
  storage,
  storageError,
  storageKeySerializer,
  version,
  versionKey = 'ngrx-store-storagesync.version'
}: IStorageSyncOptions<T>): boolean => {
  const key = storageKeySerializer!(versionKey)
  try {
    const item = storage!.getItem(key)
    if (item == null && version == null) {
      return true
    }

    return Number(item) === version
  } catch (e) {
    if (storageError) {
      storageError(e)
    } else {
      throw e
    }
  }

  return false
}

/**
 * @internal Update Storage with new config version
 * Remove item from Storage if version from config is undefined
 */
const updateNewVersion = <T>({
  storage,
  storageError,
  storageKeySerializer,
  version,
  versionKey = 'ngrx-store-storagesync.version'
}: IStorageSyncOptions<T>): void => {
  const key = storageKeySerializer!(versionKey)
  try {
    if (version) {
      storage!.setItem(key, String(version))
    } else {
      storage!.removeItem(key)
    }
  } catch (e) {
    if (storageError) {
      storageError(e)
    } else {
      throw e
    }
  }
}
