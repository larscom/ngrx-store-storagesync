import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { MaterialModule } from '../../shared/modules/material/material.module';
import { TodoListComponent } from './containers/todo-list/todo-list.component';
import * as fromTodo from './store/todo.reducer';
import { TodoRoutingModule } from './todo-routing.module';

@NgModule({
  declarations: [TodoListComponent],
  imports: [
    StoreModule.forFeature('todo', fromTodo.reducer),
    CommonModule,
    TodoRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TodoModule {}
