import { IStorageSyncOptions } from '../lib/storage-sync/models/storage-sync-options';
import { rehydrateState } from '../lib/storage-sync/rehydrate-state';
import { MockStorage } from './mock/mock-storage';

describe('RehydrateState', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should return undefined from rehydration', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };
    const feature3 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    storage.setItem('feature1', JSON.stringify(feature1));
    storage.setItem('feature2', JSON.stringify(feature2));
    storage.setItem('feature3', JSON.stringify(feature3));

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [],
      storageKeySerializer: (key: string) => key,
    };

    expect(storage.length).toEqual(3);

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toBeUndefined();
  });

  it('should rehydrate selectively', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = 'myValue';
    const feature3 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    storage.setItem('feature1', JSON.stringify(feature1));
    storage.setItem('feature2', JSON.stringify(feature2));
    storage.setItem('feature3', JSON.stringify(feature3));

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [{ stateKey: 'feature1' }, { stateKey: 'feature2' }],
      storageKeySerializer: (key: string) => key,
    };

    expect(storage.length).toEqual(3);

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toEqual({ feature1, feature2 });
  });

  it('should rehydrate the application state with custom serializer function for feature', () => {
    const storageKeySerializerForFeature = (key: string) => {
      return `_${key}_`;
    };

    const feature1 = {
      date: new Date(),
      prop1: false,
      prop2: 100,
      prop3: { check: false, random: 1337 },
    };

    storage.setItem(storageKeySerializerForFeature('feature1'), JSON.stringify(feature1));

    expect(storage.length).toEqual(1);

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [{ stateKey: 'feature1', storageKeySerializerForFeature }],
      storageKeySerializer: (key: string) => key,
    };

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toEqual({ feature1 });
  });

  it('should rehydrate the application state from primitive types', () => {
    const feature1 = 'myValue';
    const feature2 = 3;
    const feature3 = true;
    const feature4 = undefined;
    const feature5 = null;

    storage.setItem('feature1', JSON.stringify(feature1));
    storage.setItem('feature2', JSON.stringify(feature2));
    storage.setItem('feature3', JSON.stringify(feature3));
    storage.setItem('feature4', JSON.stringify(feature4));
    storage.setItem('feature5', JSON.stringify(feature5));

    expect(storage.length).toEqual(5);

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [
        { stateKey: 'feature1' },
        { stateKey: 'feature2' },
        { stateKey: 'feature3' },
        { stateKey: 'feature4' },
        { stateKey: 'feature5' },
      ],
      storageKeySerializer: (key: string) => key,
    };

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toEqual({
      feature1,
      feature2,
      feature3,
      feature5,
    });
  });
});
