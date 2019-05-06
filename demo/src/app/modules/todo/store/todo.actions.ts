import { Action } from '@ngrx/store';
import { ITodo } from '../interfaces/todo';

export enum TodoActionTypes {
  ADD_TODO = '[Todo] Add Todo',
  COMPLETE_TODO = '[Todo] Complete Todo'
}

export class AddTodo implements Action {
  readonly type = TodoActionTypes.ADD_TODO;
  constructor(public readonly payload: { todo: ITodo }) {}
}

export class CompleteTodo implements Action {
  readonly type = TodoActionTypes.COMPLETE_TODO;
  constructor(public readonly payload: { id: string }) {}
}

export type Action = AddTodo | CompleteTodo;
