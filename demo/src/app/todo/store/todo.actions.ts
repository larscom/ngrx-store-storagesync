import { Action } from '@ngrx/store';
import { ITodo } from '../interfaces/todo';

export enum TodoActionTypes {
  ADD_TODO = '[Todo] Add Todo',
  DELETE_TODO = '[Todo] Delete Todo'
}

export class AddTodo implements Action {
  readonly type = TodoActionTypes.ADD_TODO;
  constructor(public readonly payload: { todo: ITodo }) {}
}

export class DeleteTodo implements Action {
  readonly type = TodoActionTypes.DELETE_TODO;
  constructor(public readonly payload: { id: string }) {}
}

export type Action = AddTodo | DeleteTodo;
