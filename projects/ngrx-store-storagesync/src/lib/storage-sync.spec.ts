import { Action } from '@ngrx/store';
import { MockStorage } from '../test/mock-storage';
import { INIT_ACTION } from './actions';
import { IStorageSyncOptions } from './models/storage-sync-options';
import { storageSync } from './storage-sync';

describe('StorageSync', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should call storageError function on error when compatible version is checked from storage', () => {
    jest.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('ERROR');
    });

    const feature1 = { prop1: false };
    const initialState = { feature1 };

    const reducer = (state = initialState, action: Action) => state;

    const config: IStorageSyncOptions<any> = {
      version: 1,
      features: [{ stateKey: 'feature1' }],
      storage,
      storageError: jest.fn()
    };

    const metaReducer = storageSync<any>(config);

    const storageErrorSpy = jest.spyOn(config, 'storageError');

    metaReducer(reducer)(initialState, { type: INIT_ACTION });

    expect(storageErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should re-throw error when compatible version is checked from storage if storageError function is not present', () => {
    jest.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('ERROR');
    });

    const feature1 = { prop1: false };
    const initialState = { feature1 };

    const reducer = (state = initialState, action: Action) => state;

    const config: IStorageSyncOptions<any> = {
      version: 1,
      features: [{ stateKey: 'feature1' }],
      storage
    };

    const metaReducer = storageSync<any>(config);

    try {
      metaReducer(reducer)(initialState, { type: INIT_ACTION });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should call storageError function on error when trying to update version in storage', () => {
    jest.spyOn(storage, 'setItem').mockImplementation((key, value) => {
      if (key === 'version' && value === '1') {
        throw new Error('ERROR');
      }
    });

    const feature1 = { prop1: false };
    const initialState = { feature1 };

    const reducer = (state = initialState, action: Action) => state;

    const config: IStorageSyncOptions<any> = {
      version: 1,
      features: [{ stateKey: 'feature1' }],
      storage,
      storageError: jest.fn()
    };

    const metaReducer = storageSync<any>(config);

    const storageErrorSpy = jest.spyOn(config, 'storageError');

    metaReducer(reducer)(initialState, { type: 'ANY_ACTION' });

    expect(storageErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should re-throw error when trying to update version in storage if storageError function is not present', () => {
    jest.spyOn(storage, 'setItem').mockImplementation((key, value) => {
      if (key === 'version' && value === '1') {
        throw new Error('ERROR');
      }
    });

    const feature1 = { prop1: false };
    const initialState = { feature1 };

    const reducer = (state = initialState, action: Action) => state;

    const config: IStorageSyncOptions<any> = {
      version: 1,
      features: [{ stateKey: 'feature1' }],
      storage
    };

    const metaReducer = storageSync<any>(config);

    try {
      metaReducer(reducer)(initialState, { type: 'ANY_ACTION' });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should remove item from storage if version is present in storage but not in config', () => {
    const feature1 = { prop1: false };

    const initialState = { feature1 };

    storage.setItem('version', String(1));
    storage.setItem('feature1', JSON.stringify({ prop1: true }));

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const reducer = (state = initialState, action: Action) => state;

    expect(storage.getItem('version')).toEqual('1');

    metaReducer(reducer)(initialState, { type: 'ANY_ACTION' });

    expect(storage.getItem('version')).toBeNull();
  });

  it('should return the initial state if version from storage and version from config are present but not the same', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('version', String(1));
    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      version: 2,
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    expect(finalState).toEqual(initialState);
  });

  it('should return the initial state if version from storage is undefined and version from config is present', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      version: 1,
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    expect(finalState).toEqual(initialState);
  });

  it('should merge with hydrated state if version from storage is present and version from config is undefined', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('version', String(1));
    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = {
      feature1: { prop1: true, prop2: 100, prop3: { check: false } },
      feature2: { prop1: true, prop2: 200, prop3: { check: true } }
    };

    expect(finalState).toEqual(expected);
  });

  it('should merge with hydrated state if version from storage is the same as the version from config', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('version', String(1));
    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      version: 1,
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = {
      feature1: { prop1: true, prop2: 100, prop3: { check: false } },
      feature2: { prop1: true, prop2: 200, prop3: { check: true } }
    };

    expect(finalState).toEqual(expected);
  });

  it('should deep merge the initialState and rehydrated state', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = {
      feature1: { prop1: true, prop2: 100, prop3: { check: false } },
      feature2: { prop1: true, prop2: 200, prop3: { check: true } }
    };

    expect(finalState).toEqual(expected);
  });

  it('should deep merge the initialState and rehydrated state from different storage locations', () => {
    const storageForFeature = new MockStorage();

    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storageForFeature.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2', storageForFeature }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = {
      feature1: { prop1: true, prop2: 100, prop3: { check: false } },
      feature2: { prop1: true, prop2: 200, prop3: { check: true } }
    };

    expect(finalState).toEqual(expected);
  });

  it('should get the initial state when rehydrate is disabled', () => {
    const feature1 = { prop1: false, prop2: 100 };
    const feature2 = { prop1: false, prop2: 200 };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage,
      rehydrate: false
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual(initialState);
  });

  it('should get the initial state when no features are defined', () => {
    const feature1 = { prop1: false, prop2: 100 };
    const feature2 = { prop1: false, prop2: 200 };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual(initialState);
  });

  it('should get the feature states as number and string', () => {
    const feature1 = 0;
    const feature2 = null;

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify(1337));
    storage.setItem('feature2', JSON.stringify('myValue'));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [
        {
          stateKey: 'feature1'
        },
        {
          stateKey: 'feature2'
        }
      ],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = { feature1: 1337, feature2: 'myValue' };

    expect(finalState).toEqual(expected);
  });

  it('should merge the nextstate and rehydrated state by using a custom rehydrateStateMerger', () => {
    const feature1 = { prop1: false, prop2: 100 };
    const feature2 = { prop1: false, prop2: 200 };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage,
      rehydrateStateMerger: (state, rehydratedState) => {
        return { ...state, ...rehydratedState };
      }
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = { feature1: { prop1: true }, feature2: { prop1: true } };

    expect(finalState).toEqual(expected);
  });

  it('should merge the initialState and rehydrated state including initial values from the initial state', () => {
    const feature1 = { prop1: true, prop2: true };

    const initialState = { feature1 };

    storage.setItem('feature1', JSON.stringify({ prop2: false }));

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync<any>({
      features: [{ stateKey: 'feature1', excludeKeys: ['prop1'] }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = {
      feature1: { prop1: true, prop2: false }
    };

    expect(finalState).toEqual(expected);
  });
});
