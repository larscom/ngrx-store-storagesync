import { Action } from '@ngrx/store';

export enum AppActionTypes {
  TOGGLE_DRAWER = '[App] Toggle Drawer'
}

export class ToggleDrawer implements Action {
  readonly type = AppActionTypes.TOGGLE_DRAWER;
}

export type Action = ToggleDrawer;
