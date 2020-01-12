import { createReducer, on } from '@ngrx/store';
import { Theme } from '../models/theme';
import * as settingsActions from './settings.actions';

export const initialState: ISettingsState = {
  theme: Theme.DARK
};

export interface ISettingsState {
  readonly theme: Theme;
}

export const reducer = createReducer(
  initialState,
  on(settingsActions.setTheme, (state, { theme }) => ({ ...state, theme }))
);
