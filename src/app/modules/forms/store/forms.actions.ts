import { createAction, props } from '@ngrx/store';

export const setSync = createAction('[Forms] Set Sync', props<{ enabled: boolean }>());
