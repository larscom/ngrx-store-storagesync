import { InjectionToken } from '@angular/core';
import { ActionReducer } from '@ngrx/store';
import { IFormSyncConfig } from '../models/form-sync-config';
import { IFormSyncState } from '../store/form.reducer';

export const FORM_SYNC_CONFIG = new InjectionToken<IFormSyncConfig>('FORM_SYNC_CONFIG', {
  factory: () => ({ syncOnSubmit: false, syncRawValue: false, syncValidOnly: false })
});

export const FORM_SYNC_REDUCER = new InjectionToken<ActionReducer<IFormSyncState>>('FORM_SYNC_REDUCER');
