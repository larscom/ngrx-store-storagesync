import { v1 as Guid } from 'uuid';
import { ITodo } from '../interfaces/todo';
import * as fromTodo from './todo.actions';
import { TodoActionTypes } from './todo.actions';

export const initialState: ITodoState = {
  todos: [
    { id: '7eb7e000-6f2a-11e9-9de5-a5d4530ecefa', value: 'Buy milk' },
    { id: '8db46470-6f2a-11e9-85fe-4f67c1315e73', value: 'Work on blog' },
    { id: '9200db30-6f2a-11e9-8826-89e87191fac8', value: 'Buy present' },
  ]
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
