import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IRootState } from 'src/app/store/interfaces/root-state';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent {
  constructor(private readonly _store$: Store<IRootState>) {}
}
