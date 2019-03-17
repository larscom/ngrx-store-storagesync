import { cloneDeep, merge } from 'lodash';

import { IStorageSyncOptions } from './models/storage-sync-options';

export const dateReviver = (key: string, value: any) => {
  const isDateString =
    typeof value === 'string' && /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(value);
  return isDateString ? new Date(value) : value;
};

export const filterObject = (obj: Object, keys?: string[]): Object => {
  if (!keys) {
    return obj;
  }
  let index = 0;
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          }
          break;
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          } else {
            filterObject(obj[prop], keys);
          }
          break;
        default: {
          if (keys.includes(prop)) {
            delete obj[prop];
          }
        }
      }
    }
  }
  return obj;
};

export const rehydrateApplicationState = ({
  restoreDates,
  storage,
  storageKeySerializer,
  features
}: IStorageSyncOptions): any => {
  const reviver = restoreDates ? dateReviver : (k: string, v: any) => v;
  return features.reduce((acc, curr) => {
    const { storageKeySerializerForFeature, stateKey, deserialize } = curr;

    const key = storageKeySerializerForFeature
      ? storageKeySerializerForFeature(stateKey)
      : storageKeySerializer(stateKey);

    const state = storage.getItem(key);

    return state
      ? {
          ...acc,
          ...{
            [stateKey]: deserialize ? deserialize(state) : JSON.parse(state, reviver)
          }
        }
      : acc;
  }, {});
};

export const syncStateUpdate = (
  state: any,
  { features, storage, storageKeySerializer }: IStorageSyncOptions
): void => {
  features
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey]) : true))
    .forEach(({ stateKey, ignoreKeys, storageKeySerializerForFeature, serialize }) => {
      const featureState = cloneDeep(state[stateKey]);
      const filteredState = filterObject(featureState, ignoreKeys);

      const key = storageKeySerializerForFeature
        ? storageKeySerializerForFeature(stateKey)
        : storageKeySerializer(stateKey);

      storage.setItem(key, serialize ? serialize(filteredState) : JSON.stringify(filteredState));
    });
};

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

  const rehydratedState = config.rehydrate ? rehydrateApplicationState(config) : null;

  return (state: any, action: any) => {
    let nextState = null;

    if (action.type === INIT_ACTION && !state) {
      nextState = reducer(state, action);
    } else {
      nextState = { ...state };
    }

    if (rehydratedState && (action.type === INIT_ACTION || action.type === UPDATE_ACTION)) {
      nextState = config.rehydrateStateMerger(nextState, rehydratedState);
    }

    nextState = reducer(nextState, action);

    if (action.type !== INIT_ACTION) {
      syncStateUpdate(nextState, config);
    }

    return nextState;
  };
};
