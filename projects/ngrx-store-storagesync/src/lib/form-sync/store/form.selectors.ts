import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FORM_SYNC_STORE_KEY } from '../form-sync.constants';
import { IFormSyncState } from './form.reducer';

export const getFormSyncState = createFeatureSelector<IFormSyncState>(FORM_SYNC_STORE_KEY);
export const getFormSyncValue = createSelector(
  getFormSyncState,
  (state: IFormSyncState, { id }: { id: string }) => state[id]
);
