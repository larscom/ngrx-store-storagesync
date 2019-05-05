import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITodoState } from './todo.reducer';

export const getTodoState = createFeatureSelector<ITodoState>('todo');

export const getTodos = createSelector(
  getTodoState,
  ({ todos }) => todos
);
