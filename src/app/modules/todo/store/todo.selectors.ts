import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITodoState } from './todo.reducer';

export const getTodoState = createFeatureSelector<ITodoState>('todo');

export const getTodos = createSelector(getTodoState, ({ todos, completed }) =>
  todos.filter(({ id }) => !completed.includes(String(id)))
);
export const getCount = createSelector(getTodos, (todos) => todos.length);

export const getCompletedTodos = createSelector(getTodoState, ({ todos, completed }) =>
  todos.filter(({ id }) => completed.includes(String(id)))
);
export const getCompletedCount = createSelector(getCompletedTodos, (completed) => completed.length);
