import { createReducer, on } from '@ngrx/store';
import * as formsActions from './forms.actions';

export const initialState: IFormsState = {
  syncEnabled: true,
  disableFormControl: Object()
};

export interface IFormsState {
  readonly syncEnabled: boolean;
  readonly disableFormControl: { [name: string]: boolean };
}

export const reducer = createReducer(
  initialState,
  on(formsActions.setFormGroupSync, (state, { enabled: syncEnabled }) => ({ ...state, syncEnabled })),
  on(formsActions.setFormControlSync, (state, { name, disabled }) => ({
    ...state,
    disableFormControl: { ...state.disableFormControl, [name]: disabled }
  }))
);
