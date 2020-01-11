import { IStorageSyncOptions } from '../src/lib/interfaces/storage-sync-options';
import { excludeKeysFromState, stateSync } from '../src/lib/state-sync';
import { MockStorage } from './mock-storage';

describe('StateSync', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should exclude keys from state', () => {
    const state = {
      prop1: false,
      prop2: 100,
      prop3: { check: false, random: 1337 },
      prop4: { check: false, random: 1337, array: [1, 2, 3] }
    };

    const expected = {
      prop2: 100,
      prop3: { check: false },
      prop4: { check: false }
    };

    expect(excludeKeysFromState(state, ['prop1', 'random', 'prop4.array'])).toEqual(expected);
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
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
    stateSync(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem('feature1'))).toEqual({
      random: 1337,
      check: false,
      prop3: {
        check: false,
        random: 1337,
        prop5: { value: 100, prop6: { value: 200 } }
      },
      prop4: { check: false, random: 1337 }
    });

    expect(JSON.parse(storage.getItem('feature2'))).toEqual({
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

  it('should not sync empty objects the provided storage but keep empty arrays', () => {
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1'))).toBeNull();
    expect(JSON.parse(storage.getItem('feature2'))).toEqual({ prop1: false, prop2: { array: [] } });
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
    stateSync(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2'))).toEqual(feature2);
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);

    const expected = {
      array: ['check'],
      prop2: 100,
      prop3: { random: 1337 }
    };

    expect(JSON.parse(storage.getItem('feature1'))).toEqual(expected);
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
    stateSync(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem(storageKeySerializerForFeature('feature1')))).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2'))).toEqual(feature2);
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);
    expect(storageForFeature.length).toEqual(1);

    expect(JSON.parse(storageForFeature.getItem(storageKeySerializerForFeature('feature1')))).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2'))).toEqual(feature2);
  });
});
