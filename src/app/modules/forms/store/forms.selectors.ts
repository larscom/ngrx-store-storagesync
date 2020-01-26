import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IFormsState } from './forms.reducer';

export const getFormsState = createFeatureSelector<IFormsState>('forms');
export const getSyncEnabled = createSelector(getFormsState, ({ syncEnabled }) => syncEnabled);
