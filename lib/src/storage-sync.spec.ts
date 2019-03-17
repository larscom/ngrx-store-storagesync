import { IStorageSyncConfig } from './models/storage-sync-config';
import {
  dateReviver,
  filterObject,
  rehydrateApplicationState,
  storageSync,
  syncStateUpdate
} from './storage-sync';

class MockStorage implements Storage {
  public get length(): number {
    return Object.keys(this).length;
  }

  public clear(): void {
    throw Error('Not Implemented');
  }

  public getItem(key: string): string | null {
    return this[key] ? this[key] : null;
  }

  public key(index: number): string | null {
    throw Error('Not Implemented');
  }

  public removeItem(key: string): void {
    this[key] = undefined;
  }

  public setItem(key: string, data: string): void {
    this[key] = data;
  }

  [key: string]: any;
  [index: number]: string;
}

const INIT_ACTION = '@ngrx/store/init';

describe('StorageSync', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  describe('RehydrateApplicationState', () => {
    it('should re hydrate the state to a default object', () => {
      const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
      const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };
      const feature3 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

      storage.setItem('feature1', JSON.stringify(feature1));
      storage.setItem('feature2', JSON.stringify(feature2));
      storage.setItem('feature3', JSON.stringify(feature3));

      const config: IStorageSyncConfig = {
        storage,
        features: [],
        storageKeySerializer: (key: string) => key
      };

      expect(storage.length).toEqual(3);

      const rehydratedState = rehydrateApplicationState(config);

      expect(rehydratedState).toEqual({});
    });

    it('should re hydrate the application state with custom serializer function for feature', () => {
      const storageKeySerializerForFeature = (key: string) => {
        return `_${key}_`;
      };

      const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };

      storage.setItem(storageKeySerializerForFeature('feature1'), JSON.stringify(feature1));

      expect(storage.length).toEqual(1);

      const config: IStorageSyncConfig = {
        storage,
        features: [{ stateKey: 'feature1', storageKeySerializerForFeature }],
        storageKeySerializer: (key: string) => key
      };

      const rehydratedState = rehydrateApplicationState(config);

      expect(rehydratedState).toEqual({ feature1 });
    });
  });

  describe('SyncStateUpdate', () => {
    it('should not sync if shouldSync condition on a feature state returns false', () => {
      const feature1 = { checkMe: true, prop1: false, prop2: 100, prop3: { check: false } };
      const feature2 = { checkMe: false, prop2: 200, prop3: { check: false } };

      const state = { feature1, feature2 };

      const config: IStorageSyncConfig = {
        storage,
        storageKeySerializer: (key: string) => key,
        features: [
          {
            stateKey: 'feature1',
            shouldSync: featureState => {
              return featureState.checkMe;
            }
          },
          {
            stateKey: 'feature2',
            shouldSync: featureState => {
              return featureState.checkMe;
            }
          }
        ]
      };

      expect(storage.length).toEqual(0);

      // sync to storage
      syncStateUpdate(state, config);

      expect(storage.length).toEqual(1);

      expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
      expect(storage.getItem('feature2')).toBeNull();
    });

    it('should sync the complete state to the provided storage', () => {
      const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
      const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

      const state = { feature1, feature2 };

      const config: IStorageSyncConfig = {
        storage,
        storageKeySerializer: (key: string) => key,
        features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }]
      };

      expect(storage.length).toEqual(0);

      // sync to storage
      syncStateUpdate(state, config);

      expect(storage.length).toEqual(2);

      expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
      expect(JSON.parse(storage.getItem('feature2'))).toEqual(feature2);
    });

    it('should sync a single feature of the state to the provided storage', () => {
      const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
      const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

      const state = { feature1, feature2 };

      const config: IStorageSyncConfig = {
        storage,
        storageKeySerializer: (key: string) => key,
        features: [{ stateKey: 'feature1' }]
      };

      expect(storage.length).toEqual(0);

      // sync to storage
      syncStateUpdate(state, config);

      expect(storage.length).toEqual(1);

      expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
      expect(storage.getItem('feature2')).toBeNull();
    });

    it('should sync only a part of a feature of the state to the provided storage', () => {
      const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
      const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

      const state = { feature1, feature2 };

      const config: IStorageSyncConfig = {
        storage,
        storageKeySerializer: (key: string) => key,
        features: [{ stateKey: 'feature1', ignoreKeys: ['prop1', 'check'] }]
      };

      expect(storage.length).toEqual(0);

      // sync to storage
      syncStateUpdate(state, config);

      expect(storage.length).toEqual(1);

      const expected = {
        ...feature1,
        prop1: undefined,
        prop3: {
          ...feature1.prop3,
          check: undefined
        }
      };

      expect(JSON.parse(storage.getItem('feature1'))).toEqual(expected);
      expect(storage.getItem('feature2')).toBeNull();
    });
  });

  it('should merge and keep all properties in the initialState and rehydrated state', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const initialState = { feature1, feature2 };

    storage.setItem('feature1', JSON.stringify({ prop1: true }));
    storage.setItem('feature2', JSON.stringify({ prop1: true, prop3: { check: true } }));

    const reducer = (state = initialState, action: any) => state;

    const metaReducer = storageSync({
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storage,
      rehydrate: true
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
      storage,
      rehydrate: true
    });

    const finalState = metaReducer(reducer)(initialState, { type: INIT_ACTION });
    expect(finalState).toEqual(initialState);
  });

  it('should remove properties from object', () => {
    const subject = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };

    expect(filterObject(subject, ['prop1', 'random'])).toEqual({
      ...subject,
      prop1: undefined,
      prop3: {
        ...subject.prop3,
        random: undefined
      }
    });
  });

  it('should revive dates', () => {
    expect(dateReviver('key', '2019-01-01T13:37:00.002Z')).toBeInstanceOf(Date);
  });
});
