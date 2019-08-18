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
  constructor(private readonly store$: Store<IRootState>, private readonly breakpoint: BreakpointObserver) {}

  todos$ = this.store$.pipe(select(todoSelectors.getTodos));
  count$ = this.store$.pipe(select(todoSelectors.getCount));

  isMobile$ = this.breakpoint.observe(Breakpoints.Handset).pipe(map(({ matches }) => matches));

  completedTodos$ = this.store$.pipe(select(todoSelectors.getCompletedTodos));
  completedCount$ = this.store$.pipe(select(todoSelectors.getCompletedCount));

  todo = String();

  onTodoClicked({ id }: ITodo): void {
    setTimeout(() => this.store$.dispatch(todoActions.completeTodo({ id })), 250);
  }

  addTodo(): void {
    if (this.todo.length) {
      this.store$.dispatch(todoActions.addTodo({ todo: { value: this.todo } }));
    }
    this.todo = String();
  }

  @HostListener('document:keydown.enter')
  onEnterPressed(): void {
    this.addTodo();
  }
}
