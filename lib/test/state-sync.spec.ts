import { IStorageSyncOptions } from '../src/models/storage-sync-options';
import { filterObject, stateSync } from '../src/state-sync';
import { MockStorage } from './mock-storage';

describe('StateSync', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
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

  it('should not sync if shouldSync condition on a feature state returns false', () => {
    const feature1 = { checkMe: true, prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { checkMe: false, prop2: 200, prop3: { check: false } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions = {
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
    stateSync(state, config);

    expect(storage.length).toEqual(1);

    expect(JSON.parse(storage.getItem('feature1'))).toEqual(feature1);
    expect(storage.getItem('feature2')).toBeNull();
  });

  it('should sync the complete state to the provided storage', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions = {
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

    const config: IStorageSyncOptions = {
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
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1', ignoreKeys: ['prop1', 'check'] }]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    stateSync(state, config);

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

  it('should sync the complete state by using a custom storageKeySerializerForFeature', () => {
    const storageKeySerializerForFeature = (key: string) => {
      return `_${key}_`;
    };

    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    const state = { feature1, feature2 };

    const config: IStorageSyncOptions = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1', storageKeySerializerForFeature }, { stateKey: 'feature2' }]
    };

    expect(storage.length).toEqual(0);

    // sync to storage
    stateSync(state, config);

    expect(storage.length).toEqual(2);

    expect(JSON.parse(storage.getItem(storageKeySerializerForFeature('feature1')))).toEqual(
      feature1
    );
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

    const config: IStorageSyncOptions = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [
        { stateKey: 'feature1', storageKeySerializerForFeature, storageForFeature },
        { stateKey: 'feature2' }
      ]
    };

    expect(storage.length).toEqual(0);
    expect(storageForFeature.length).toEqual(0);

    // sync to storage
    stateSync(state, config);

    expect(storage.length).toEqual(1);
    expect(storageForFeature.length).toEqual(1);

    expect(
      JSON.parse(storageForFeature.getItem(storageKeySerializerForFeature('feature1')))
    ).toEqual(feature1);
    expect(JSON.parse(storage.getItem('feature2'))).toEqual(feature2);
  });
});
