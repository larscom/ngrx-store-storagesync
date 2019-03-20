import { storageSync } from '../src/storage-sync';
import { MockStorage } from './mock-storage';

describe('StorageSync', () => {
  const INIT_ACTION = '@ngrx/store/init';

  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should deep merge the initialState and rehydrated state', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: any) => state;

    const metaReducer = storageSync({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual({
      ...initialState,
      feature1: { ...feature1, prop1: true },
      feature2: { ...feature2, prop1: true, prop3: { check: true } }
    });
  });

  it('should deep merge the initialState and rehydrated state from different storage locations', () => {
    const storageForFeature = new MockStorage();

    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storageForFeature.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: any) => state;

    const metaReducer = storageSync({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2', storageForFeature }],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual({
      ...initialState,
      feature1: { ...feature1, prop1: true },
      feature2: { ...feature2, prop1: true, prop3: { check: true } }
    });
  });

  it('should give back the initial state when rehydrate is disabled and the storage is filled', () => {
    const feature1 = { prop1: false, prop2: 100 };
    const feature2 = { prop1: false, prop2: 200 };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true }));

    const reducer = (state = initialState, action: any) => state;

    const metaReducer = storageSync({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage,
      rehydrate: false
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual(initialState);
  });

  it('should give back the initial state when no features are given', () => {
    const feature1 = { prop1: false, prop2: 100 };
    const feature2 = { prop1: false, prop2: 200 };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true }));

    const reducer = (state = initialState, action: any) => state;

    const metaReducer = storageSync({
      features: [],
      storage
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual(initialState);
  });

  it('should merge the nextstate and rehydrated state by using a custom rehydrateStateMerger', () => {
    const feature1 = { prop1: false, prop2: 100 };
    const feature2 = { prop1: false, prop2: 200 };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true }));

    const reducer = (state = initialState, action: any) => state;

    const metaReducer = storageSync({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage,
      rehydrateStateMerger: (state, rehydratedState) => {
        return { ...state, ...rehydratedState };
      }
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual({
      feature1: {
        prop1: true
      },
      feature2: {
        prop1: true
      }
    });
  });
});
