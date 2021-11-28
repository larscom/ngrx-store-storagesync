import { MockStorage } from '../test/mock-storage';
import { IStorageSyncOptions } from './models/storage-sync-options';
import { syncWithStorage } from './sync-with-storage';

describe('SyncWithStorage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should call storageError function on error', () => {
    jest.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('ERROR');
    });

    const config: IStorageSyncOptions<any> = {
      storage,
      storageError: jest.fn(),
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1' }]
    };

    const storageErrorSpy = jest.spyOn(config, 'storageError');

    const feature1 = 'myValue';
    const state = { feature1 };

    // sync to storage
    syncWithStorage(state, config);

    expect(storageErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should re-throw error if storageError function is not present', () => {
    jest.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('ERROR');
    });

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1' }]
    };

    const feature1 = 'myValue';
    const state = { feature1 };

    try {
      // sync to storage
      syncWithStorage(state, config);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should sync primitive/non-primitive types', () => {
    const feature1 = 'myValue';
    const feature2 = 3;
    const feature3 = false;
    const feature4 = true;
    const feature5 = ['test'];
    const feature6 = undefined;
    const feature7 = null;
    const feature8 = { test: false };

    const state = { feature1, feature2, feature3, feature4, feature5, feature6, feature7, feature8 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        {
          stateKey: 'feature1'
        },
        {
          stateKey: 'feature2'
        },
        {
          stateKey: 'feature3'
        },
        {
          stateKey: 'feature4'
        },
        {
          stateKey: 'feature5'
        },
        {
          stateKey: 'feature6'
        },
        {
          stateKey: 'feature7'
        },
        {
          stateKey: 'feature8'
        }
      ]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(7);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2')!)).toEqual(feature2);
    expect(JSON.parse(storage.getItem('feature3')!)).toEqual(feature3);
    expect(JSON.parse(storage.getItem('feature4')!)).toEqual(feature4);
    expect(JSON.parse(storage.getItem('feature5')!)).toEqual(feature5);
    expect(storage.getItem('feature6')).toBeNull();
    expect(JSON.parse(storage.getItem('feature7')!)).toEqual(feature7);
    expect(JSON.parse(storage.getItem('feature8')!)).toEqual(feature8);
  });

  it('should not sync if feature state is not present in state', () => {
    const feature1 = { checkMe: true, prop1: false, prop2: 100, prop3: { check: false } };

    const state = { feature1 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        {
          stateKey: 'feature1'
        },
        {
          stateKey: 'feature2'
        }
      ]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual(feature1);
    expect(storage.getItem('feature2')).toBeNull();
  });

  it('should not sync if shouldSync condition on a feature state returns false', () => {
    const feature1 = { checkMe: true, prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { checkMe: false, prop2: 200, prop3: { check: false } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        {
          stateKey: 'feature1',
          shouldSync: (featureState: any, nextState: any) => {
            return featureState.checkMe && nextState.feature1.checkMe;
          }
        },
        {
          stateKey: 'feature2',
          shouldSync: (featureState: any, nextState: any) => {
            return featureState.checkMe && nextState.feature2.checkMe;
          }
        }
      ]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual(feature1);
    expect(storage.getItem('feature2')).toBeNull();
  });

  it('should selectively sync parts of the feature states with nested keys', () => {
    const feature1 = {
      prop1: false,
      random: 1337,
      check: false,
      prop3: {
        check: false,
        random: 1337,
        prop5: { check: true, value: 100, prop6: { check: false, value: 200, prop1: true } }
      },
      prop4: { check: false, random: 1337 }
    };

    const feature2 = {
      prop1: false,
      random: 1337,
      check: false,
      prop3: {
        check: false,
        random: 1337,
        prop5: { check: true, value: 100, prop6: { check: false, value: 200, prop1: true } }
      },
      prop4: { check: false, random: 1337 }
    };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        { stateKey: 'feature1', excludeKeys: ['prop5.check', 'prop6.check', 'prop1'] },
        { stateKey: 'feature2', excludeKeys: ['prop5.check', 'prop6.check', 'prop1'] }
      ]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual({
      random: 1337,
      check: false,
      prop3: {
        check: false,
        random: 1337,
        prop5: { value: 100, prop6: { value: 200 } }
      },
      prop4: { check: false, random: 1337 }
    });

    expect(JSON.parse(storage.getItem('feature2')!)).toEqual({
      random: 1337,
      check: false,
      prop3: {
        check: false,
        random: 1337,
        prop5: { value: 100, prop6: { value: 200 } }
      },
      prop4: { check: false, random: 1337 }
    });
  });

  it('should not sync empty objects to the provided storage but keep empty arrays', () => {
    const feature1 = { prop1: false, array: ['1'], prop2: { check: false } };
    const feature2 = { prop1: false, prop2: { check: false, array: [] } };
    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        { stateKey: 'feature1', excludeKeys: ['prop1', 'check', 'array'] },
        { stateKey: 'feature2', excludeKeys: ['check'] }
      ]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1')!)).toBeNull();
    expect(JSON.parse(storage.getItem('feature2')!)).toEqual({ prop1: false, prop2: { array: [] } });
  });

  it('should sync the complete state to the provided storage', () => {
    const feature1 = { prop1: false, prop2: 100, array: [1, 2, 3], prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, array: [1, 2, 3], prop3: { check: false } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2')!)).toEqual(feature2);
  });

  it('should sync a single feature of the state to the provided storage', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1' }]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual(feature1);
    expect(storage.getItem('feature2')).toBeNull();
  });

  it('should sync only a part of a feature of the state to the provided storage', () => {
    const feature1 = {
      prop1: false,
      array: ['check'],
      prop2: 100,
      prop3: { check: false, random: 1337 }
    };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1', excludeKeys: ['prop1', 'check'] }]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);

    const expected = {
      array: ['check'],
      prop2: 100,
      prop3: { random: 1337 }
    };

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual(expected);
    expect(storage.getItem('feature2')).toBeNull();
  });

  it('should sync the complete state by using a custom storageKeySerializerForFeature', () => {
    const storageKeySerializerForFeature = (key: string) => {
      return `_${key}_`;
    };

    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1', storageKeySerializerForFeature }, { stateKey: 'feature2' }]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem(storageKeySerializerForFeature('feature1'))!)).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2')!)).toEqual(feature2);
  });

  it('should sync the complete state in 2 storage locations with a custom storageKeySerializerForFeature', () => {
    const storageForFeature = new MockStorage();

    const storageKeySerializerForFeature = (key: string) => {
      return `_${key}_`;
    };

    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1', storageKeySerializerForFeature, storageForFeature }, { stateKey: 'feature2' }]
    };

    expect(storage.length).toEqual(0);
    expect(storageForFeature.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);
    expect(storageForFeature.length).toEqual(1);

    expect(JSON.parse(storageForFeature.getItem(storageKeySerializerForFeature('feature1')))).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2')!)).toEqual(feature2);
  });

  it('should sync with storage with custom serialize function', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };

    const state = { feature1 };

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        {
          stateKey: 'feature1',
          serialize: () => {
            return JSON.stringify('customSerializer');
          }
        }
      ]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    syncWithStorage(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1')!)).toEqual('customSerializer');
  });
});
