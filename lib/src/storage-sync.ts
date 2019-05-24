import { Action } from '@ngrx/store';
import { merge } from 'lodash';

import { INIT_ACTION, INIT_ACTION_EFFECTS, UPDATE_ACTION } from './actions';
import { IStorageSyncOptions } from './interfaces/storage-sync-options';
import { rehydrateState } from './rehydrate-state';
import { stateSync } from './state-sync';

/**
 * @internal Check to see if not inside a browser (for SSR)
 * @returns returns true if not in a browser
 */
export const isNotBrowser = typeof window === 'undefined';

/**
 * The StorageSync Meta Reducer for @ngrx/store.
 *
 * @param options The configuration for the meta reducer
 *
 * Check out github for more information.
 * @see https://github.com/larscom/ngrx-store-storagesync
 *
 * @returns returns the meta reducer function
 */
export const storageSync = <T>(options: IStorageSyncOptions<T>) => (
  reducer: (state: T, action: Action) => T
): ((state: T, action: Action) => T) => {
  if (isNotBrowser) {
    return (state: T, action: Action): T => {
      return [INIT_ACTION, INIT_ACTION_EFFECTS].includes(action.type) ? reducer(state, action) : { ...state };
    };
  }

  const config: IStorageSyncOptions<T> = {
    rehydrate: true,
    storageKeySerializer: (key: string) => key,
    rehydrateStateMerger: (nextState, rehydratedState) => merge({}, nextState, rehydratedState),
    ...options
  };

  const { rehydrate, rehydrateStateMerger } = config;
  const revivedState = rehydrate ? rehydrateState<T>(config) : null;

  return (state: T, action: Action): T => {
    const nextState = action.type === INIT_ACTION ? reducer(state, action) : { ...state };
    const shouldMerge = revivedState && [INIT_ACTION, UPDATE_ACTION].includes(action.type);
    const mergedState = reducer(shouldMerge ? rehydrateStateMerger(nextState, revivedState) : nextState, action);

    return [INIT_ACTION, INIT_ACTION_EFFECTS].includes(action.type) ? mergedState : stateSync(mergedState, config);
  };
};
