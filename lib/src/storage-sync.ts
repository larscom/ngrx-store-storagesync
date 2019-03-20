import { merge } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';
import { rehydrateState } from './rehydrate-state';
import { stateSync } from './state-sync';

export const storageSync = (options: IStorageSyncOptions) => (reducer: any) => {
  const INIT_ACTION = '@ngrx/store/init';
  const UPDATE_ACTION = '@ngrx/store/update-reducers';

  const config: IStorageSyncOptions = {
    rehydrate: true,
    restoreDates: true,
    storageKeySerializer: (key: string) => key,
    rehydrateStateMerger: (nextState, rehydratedState) => merge({}, nextState, rehydratedState),
    ...options
  };

  const rehydratedApplicationState = config.rehydrate ? rehydrateState(config) : null;

  return (state: any, action: any) => {
    let nextState = null;

    if (action.type === INIT_ACTION && !state) {
      nextState = reducer(state, action);
    } else {
      nextState = { ...state };
    }

    if (rehydratedApplicationState && [INIT_ACTION, UPDATE_ACTION].includes(action.type)) {
      nextState = config.rehydrateStateMerger(nextState, rehydratedApplicationState);
    }

    nextState = reducer(nextState, action);

    if (action.type !== INIT_ACTION) {
      stateSync(nextState, config);
    }

    return nextState;
  };
};
