import { MockStorage } from '../test/mock-storage';
import { IStorageSyncOptions } from './models/storage-sync-options';
import { rehydrateState } from './rehydrate-state';

describe('RehydrateState', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('should call storageError function on error', () => {
    jest.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('ERROR');
    });

    const config: IStorageSyncOptions<any> = {
      storage,
      storageError: jest.fn(),
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1' }]
    };

    const storageErrorSpy = jest.spyOn(config, 'storageError');

    rehydrateState(config);

    expect(storageErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should re-throw error if storageError function is not present', () => {
    jest.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('ERROR');
    });

    const config: IStorageSyncOptions<any> = {
      storage,
      storageKeySerializer: (key: string) => key,
      features: [{ stateKey: 'feature1' }]
    };

    try {
      rehydrateState(config);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should return undefined from rehydration because no features present', () => {
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
      storageKeySerializer: (key: string) => key
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
        { stateKey: 'feature5' }
      ],
      storageKeySerializer: (key: string) => key
    };

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toEqual({
      feature1,
      feature2,
      feature3,
      feature5
    });
  });

  it('should rehydrate with custom deserialize function', () => {
    const feature1 = { prop1: false, prop2: 100 };

    storage.setItem('feature1', JSON.stringify(feature1));

    expect(storage.length).toEqual(1);

    const config: IStorageSyncOptions<any> = {
      storage,
      features: [
        {
          stateKey: 'feature1',
          deserialize: (featureState: string) => {
            return {
              ...JSON.parse(featureState),
              extra: 1
            };
          }
        }
      ],
      storageKeySerializer: (key: string) => key
    };

    const rehydratedState = rehydrateState(config);

    expect(rehydratedState).toEqual({
      feature1: {
        ...feature1,
        extra: 1
      }
    });
  });
});
