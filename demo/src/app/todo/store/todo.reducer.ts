import { v1 as Guid } from 'uuid';
import { ITodo } from '../interfaces/todo';
import * as fromTodo from './todo.actions';
import { TodoActionTypes } from './todo.actions';

export const initialState: ITodoState = {
  todos: []
};

export interface ITodoState {
  readonly todos: Array<ITodo>;
}

export function reducer(state = initialState, action: fromTodo.Action): ITodoState {
  switch (action.type) {
    case TodoActionTypes.ADD_TODO: {
      const { todo } = action.payload;
      return {
        ...state,
        todos: [...state.todos, { id: Guid(), ...todo }]
      };
    }
    case TodoActionTypes.DELETE_TODO: {
      const { id } = action.payload;
      return { ...state, todos: [...state.todos.filter(todo => todo.id !== id)] };
    }
  }
  return state;
}
