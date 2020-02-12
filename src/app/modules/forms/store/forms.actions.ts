import { createAction, props } from '@ngrx/store';

export const setFormGroupSync = createAction('[Forms] Set FormGroup Sync', props<{ enabled: boolean }>());
