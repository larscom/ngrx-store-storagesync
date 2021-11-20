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
    const rehydratedState = rehydrate ? rehydrateState(config) : undefined;

    const metaReducer = (state: T | undefined, action: Action): T => {
      const nextState = action.type === INIT_ACTION ? reducer(state, action) : (Object({ ...state }) as T);
      const shouldMerge = rehydratedState !== undefined && [INIT_ACTION, UPDATE_ACTION].includes(action.type);

      const mergedState = reducer(
        shouldMerge ? rehydrateStateMerger!(nextState, rehydratedState as T) : nextState,
        action
      );

      return [INIT_ACTION, INIT_ACTION_EFFECTS].includes(action.type) ? mergedState : stateSync(mergedState, config);
    };

    return metaReducer;
  };
