import { Action } from '@ngrx/store';
import { merge as _merge } from 'lodash';

import { INIT_ACTION, UPDATE_ACTION } from './actions';
import { IStorageSyncOptions } from './models/storage-sync-options';
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
      const isInit = !state && action.type === INIT_ACTION;
      return isInit ? reducer(state, action) : { ...state };
    };
  }

  const config: IStorageSyncOptions<T> = {
    rehydrate: true,
    storageKeySerializer: (key: string) => key,
    rehydrateStateMerger: (nextState, rehydratedState) => _merge({}, nextState, rehydratedState),
    ...options
  };

  const { rehydrate, rehydrateStateMerger } = config;

  const restoredState = rehydrate ? rehydrateState<T>(config) : null;

  return (state: T, action: Action): T => {
    const nextState = !state && action.type === INIT_ACTION ? reducer(state, action) : { ...state };

    const merge = restoredState && [INIT_ACTION, UPDATE_ACTION].includes(action.type);
    const mergedState = reducer(merge ? rehydrateStateMerger(nextState, restoredState) : nextState, action);

    return action.type !== INIT_ACTION ? stateSync(mergedState, config) : mergedState;
  };
};
