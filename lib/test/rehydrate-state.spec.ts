import { IStorageSyncOptions } from '../src/interfaces/storage-sync-options';
import { rehydrateState } from '../src/rehydrate-state';
import { MockStorage } from './mock-storage';

describe('RehydrateState', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should return null from rehydration', () => {
    const feature1 = { prop1: false, prop2: 100, prop3: { check: false, random: 1337 } };
    const feature2 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };
    const feature3 = { prop1: false, prop2: 200, prop3: { check: false, random: 1337 } };

    storage.setItem('feature1', JSON.stringify(feature1));
    storage.setItem('feature2', JSON.stringify(feature2));
    storage.setItem('feature3', JSON.stringify(feature3));

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [],
      storageKeySerializer: (key: string) => key
    };

    expect(storage.length).toEqual(3);

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toBeNull();
  });

  it('should re hydrate the application state with custom serializer function for feature', () => {
    const storageKeySerializerForFeature = (key: string) => {
      return `_${key}_`;
    };

    const feature1 = {
      date: new Date(),
      prop1: false,
      prop2: 100,
      prop3: { check: false, random: 1337 }
    };

    storage.setItem(storageKeySerializerForFeature('feature1'), JSON.stringify(feature1));

    expect(storage.length).toEqual(1);

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [{ stateKey: 'feature1', storageKeySerializerForFeature }],
      storageKeySerializer: (key: string) => key
    };

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toEqual({ feature1 });
  });
});
