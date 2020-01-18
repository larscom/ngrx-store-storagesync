import { createAction, props } from '@ngrx/store';

export const setForm = createAction('@larscom/form-sync/set', props<{ id: string; value: any }>());
export const patchForm = createAction('@larscom/form-sync/patch', props<{ id: string; value: any }>());
export const resetForm = createAction('@larscom/form-sync/reset', props<{ id: string }>());
export const deleteForm = createAction('@larscom/form-sync/delete', props<{ id: string }>());
