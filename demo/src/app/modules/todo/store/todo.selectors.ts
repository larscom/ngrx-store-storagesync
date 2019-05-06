import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITodoState } from './todo.reducer';

export const getTodoState = createFeatureSelector<ITodoState>('todo');

export const getTodos = createSelector(
  getTodoState,
  ({ todos, completed }) => todos.filter(({ id }) => !completed.includes(id))
);

export const getCount = createSelector(
  getTodoState,
  ({ todos, completed }) => todos.filter(({ id }) => !completed.includes(id)).length
);

export const getCompletedTodos = createSelector(
  getTodoState,
  ({ todos, completed }) => todos.filter(({ id }) => completed.includes(id))
);

export const getCompletedCount = createSelector(
  getTodoState,
  ({ completed }) => completed.length
);
