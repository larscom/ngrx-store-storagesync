import { createReducer, on } from '@ngrx/store';
import uuid from 'uuid';

import { ITodo } from '../models/todo';
import * as todoActions from './todo.actions';

export const initialState: ITodoState = {
  todos: [
    { id: '7eb7e000-6f2a-11e9-9de5-a5d4530ecefa', value: 'Buy milk' },
    { id: '8db46470-6f2a-11e9-85fe-4f67c1315e73', value: 'Work on blog' },
    { id: '9200db30-6f2a-11e9-8826-89e87191fac8', value: 'Buy present' }
  ],
  completed: []
};

export interface ITodoState {
  readonly todos: Array<ITodo>;
  readonly completed: string[];
}

export const reducer = createReducer(
  initialState,
  on(todoActions.addTodo, (state, { todo }) => ({ ...state, todos: [...state.todos, { id: uuid(), ...todo }] })),
  on(todoActions.completeTodo, (state, { id }) => ({ ...state, completed: [...state.completed, id] }))
);
