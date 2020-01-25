import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FEATURE_STORE_KEY } from '../form-sync.constants';
import { IFormSyncState } from './form.reducer';

export const getFormSyncState = createFeatureSelector<IFormSyncState>(FEATURE_STORE_KEY);
export const getFormSyncValue = createSelector(
  getFormSyncState,
  (state: IFormSyncState, { id }: { id: string }) => state[id]
);
