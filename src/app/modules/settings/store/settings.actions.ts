import { createAction, props } from '@ngrx/store';

export const completeTodo = createAction('[Settings] Complete Todo', props<{ id: string }>());
