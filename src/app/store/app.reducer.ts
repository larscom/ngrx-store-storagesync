import * as fromApp from './app.actions';
import { AppActionTypes } from './app.actions';

export const initialState: IAppState = {
  drawerOpen: false
};

export interface IAppState {
  readonly drawerOpen: boolean;
}

export function reducer(state = initialState, action: fromApp.Action): IAppState {
  switch (action.type) {
    case AppActionTypes.TOGGLE_DRAWER: {
      return {
        ...state,
        drawerOpen: !state.drawerOpen
      };
    }
  }
  return state;
}
