import { createAction, props } from '@ngrx/store';

import { ITodo } from '../models/todo';

export const addTodo = createAction('[Todo] Add Todo', props<{ todo: ITodo }>());
export const completeTodo = createAction('[Todo] Complete Todo', props<{ id: string }>());
