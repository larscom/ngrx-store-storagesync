import { merge } from 'lodash';

import { INIT_ACTION, UPDATE_ACTION } from './actions';
import { IStorageSyncOptions } from './models/storage-sync-options';
import { rehydrateState } from './rehydrate-state';
import { stateSync } from './state-sync';

export const storageSync = (options: IStorageSyncOptions) => (reducer: any) => {
  const config: IStorageSyncOptions = {
    rehydrate: true,
    storageKeySerializer: (key: string) => key,
    rehydrateStateMerger: (nextState, rehydratedState) => merge({}, nextState, rehydratedState),
    ...options
  };

  const restoredState = config.rehydrate ? rehydrateState(config) : null;

  return (state: any, action: any) => {
    let nextState = null;

    if (action.type === INIT_ACTION && !state) {
      nextState = reducer(state, action);
    } else {
      nextState = { ...state };
    }

    if (restoredState && [INIT_ACTION, UPDATE_ACTION].includes(action.type)) {
      nextState = config.rehydrateStateMerger(nextState, restoredState);
    }

    nextState = reducer(nextState, action);

    if (action.type !== INIT_ACTION) {
      stateSync(nextState, config);
    }

    return nextState;
  };
};
