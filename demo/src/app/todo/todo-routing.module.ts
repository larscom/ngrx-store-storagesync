import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoListComponent } from './containers/todo-list/todo-list.component';

const routes: Routes = [
  {
    path: '',
    component: TodoListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}
