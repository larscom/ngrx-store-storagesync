import { createAction, props } from '@ngrx/store';

export const setForm = createAction('@ngrx/form-sync/set', props<{ id: string; value: any }>());
export const patchForm = createAction('@ngrx/form-sync/patch', props<{ id: string; value: any }>());
export const resetForm = createAction('@ngrx/form-sync/reset', props<{ id: string }>());
export const deleteForm = createAction('@ngrx/form-sync/delete', props<{ id: string }>());
