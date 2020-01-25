import { createReducer, on } from '@ngrx/store';
import * as formsActions from './forms.actions';

export const initialState: IFormsState = {
  enableSync: true
};

export interface IFormsState {
  readonly enableSync: boolean;
}

export const reducer = createReducer(
  initialState,
  on(formsActions.setSync, (state, { enabled: enableSync }) => ({ ...state, enableSync }))
);
