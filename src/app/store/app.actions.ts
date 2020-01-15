import { createAction, props } from '@ngrx/store';

export const toggleDrawer = createAction('[App] Toggle Drawer', props<{ open: boolean }>());
