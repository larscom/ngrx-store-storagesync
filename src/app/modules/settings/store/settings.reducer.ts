import { createReducer, on } from '@ngrx/store';
import { v1 as Guid } from 'uuid';

import * as settingsActions from './settings.actions';

export const initialState: ISettingsState = {
  completed: []
};

export interface ISettingsState {
  readonly completed: string[];
}

export const reducer = createReducer(
  initialState,
  // on(settingsActions.completeTodo, (state, { todo }) => ({ ...state, todos: [...state.todos, { id: Guid(), ...todo }] }))
);
