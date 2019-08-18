import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionReducer, StoreModule } from '@ngrx/store';

import { MaterialModule } from '../../shared/modules/material/material.module';
import { TodoListComponent } from './containers/todo-list/todo-list.component';
import * as fromTodo from './store/todo.reducer';
import { TodoRoutingModule } from './todo-routing.module';

export const TODO_REDUCER = new InjectionToken<ActionReducer<fromTodo.ITodoState>>('TODO_REDUCER');

@NgModule({
  declarations: [TodoListComponent],
  imports: [
    StoreModule.forFeature('todo', TODO_REDUCER),
    CommonModule,
    TodoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: TODO_REDUCER, useValue: fromTodo.reducer }]
})
export class TodoModule {}
