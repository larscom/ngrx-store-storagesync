import { InjectionToken } from '@angular/core';
import { IFormSyncConfig } from '../models/form-sync-config';

export const FORM_SYNC_CONFIG = new InjectionToken<IFormSyncConfig>('FORM_SYNC_CONFIG', {
  factory: () => Object()
});
