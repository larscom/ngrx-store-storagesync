import { createAction, props } from '@ngrx/store';

export const setFormGroupSync = createAction('[Forms] Set FormGroup Sync', props<{ enabled: boolean }>());
export const setFormControlSync = createAction(
  '[Forms] Set FormControl Sync',
  props<{ name: string; disabled: boolean }>()
);
