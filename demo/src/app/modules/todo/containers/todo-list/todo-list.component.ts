import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { IRootState } from '../../../../store/interfaces/root-state';
import * as todoSelectors from '../../store/todo.selectors';
import { ITodo } from '../../interfaces/todo';
import * as todoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent {
  constructor(private readonly _store$: Store<IRootState>) {}

  todos$ = this._store$.pipe(select(todoSelectors.getTodos));

  onTodoClicked({ id }: ITodo): void {
    this._store$.dispatch(new todoActions.DeleteTodo({ id }));
  }
}
