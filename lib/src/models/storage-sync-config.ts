import { IFeatureConfig } from './feature-config';

export interface IStorageSyncConfig {
  features: IFeatureConfig[];
  storage: Storage;
  rehydrate?: boolean;
  restoreDates?: boolean;
  storageKeySerializer?: (key: string) => string;
}
