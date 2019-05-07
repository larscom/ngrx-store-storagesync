import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { IRootState } from '../../../../store/interfaces/root-state';
import { ITodo } from '../../interfaces/todo';
import * as todoActions from '../../store/todo.actions';
import * as todoSelectors from '../../store/todo.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent {
  constructor(
    private readonly _store$: Store<IRootState>,
    private readonly _breakpoint: BreakpointObserver
  ) {}

  todos$ = this._store$.pipe(select(todoSelectors.getTodos));
  count$ = this._store$.pipe(select(todoSelectors.getCount));

  isMobile$ = this._breakpoint.observe(Breakpoints.Handset).pipe(map(({ matches }) => matches));

  completedTodos$ = this._store$.pipe(select(todoSelectors.getCompletedTodos));
  completedCount$ = this._store$.pipe(select(todoSelectors.getCompletedCount));

  todo = String();

  onTodoClicked({ id }: ITodo): void {
    setTimeout(() => this._store$.dispatch(new todoActions.CompleteTodo({ id })), 425);
  }

  addTodo(): void {
    if (this.todo.length) {
      this._store$.dispatch(new todoActions.AddTodo({ todo: { value: this.todo } }));
    }
    this.todo = String();
  }

  @HostListener('document:keydown.enter')
  onEnterPressed(): void {
    this.addTodo();
  }
}
