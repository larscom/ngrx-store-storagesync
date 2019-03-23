import { Action } from '@ngrx/store';
import { INIT_ACTION } from '../src/actions';
import { storageSync } from '../src/storage-sync';
import { MockStorage } from './mock-storage';

describe('StorageSync', () => {
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

    const reducer = (state = initialState, action: Action) => state;

    const metaReducer = storageSync({
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

    const metaReducer = storageSync({
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

    const metaReducer = storageSync({
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

    const metaReducer = storageSync({
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

    const metaReducer = storageSync({
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

    const metaReducer = storageSync({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage,
      rehydrateStateMerger: (state, rehydratedState) => {
        return { ...state, ...rehydratedState };
      }
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });

    const expected = {
      feature1: {
        prop1: true
      },
      feature2: {
        prop1: true
      }
    };

    expect(finalState).toEqual(expected);
  });
});
