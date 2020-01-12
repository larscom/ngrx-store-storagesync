import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { IRootState } from '../../../../store/models/root-state';
import { ITodo } from '../../models/todo';
import * as todoActions from '../../store/todo.actions';
import * as todoSelectors from '../../store/todo.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent {
  readonly todos$ = this.store$.pipe(select(todoSelectors.getTodos));
  readonly count$ = this.store$.pipe(select(todoSelectors.getCount));
  readonly completedTodos$ = this.store$.pipe(select(todoSelectors.getCompletedTodos));
  readonly completedCount$ = this.store$.pipe(select(todoSelectors.getCompletedCount));
  readonly isMobile$ = this.breakpoint.observe(Breakpoints.Handset).pipe(map(({ matches }) => matches));

  constructor(private readonly store$: Store<IRootState>, private readonly breakpoint: BreakpointObserver) {}

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
