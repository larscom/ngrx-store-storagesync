import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'todo',
    pathMatch: 'full',
    loadChildren: () => import('./modules/todo/todo.module').then(m => m.TodoModule)
  },
  {
    path: 'settings',
    pathMatch: 'full',
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
  },
  { path: '**', redirectTo: 'todo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
