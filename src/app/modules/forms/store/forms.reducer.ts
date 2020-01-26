import { createReducer, on } from '@ngrx/store';
import * as formsActions from './forms.actions';

export const initialState: IFormsState = {
  syncEnabled: true
};

export interface IFormsState {
  readonly syncEnabled: boolean;
}

export const reducer = createReducer(
  initialState,
  on(formsActions.setFormGroupSync, (state, { enabled: syncEnabled }) => ({ ...state, syncEnabled }))
);
