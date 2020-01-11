import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';


export const initialState: IAppState = {
  drawerOpen: false
};

export interface IAppState {
  readonly drawerOpen: boolean;
}

export const reducer = createReducer(
  initialState,
  on(appActions.toggleDrawer, state => ({ ...state, drawerOpen: !state.drawerOpen }))
);
