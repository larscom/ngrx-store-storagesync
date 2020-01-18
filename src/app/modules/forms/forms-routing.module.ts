import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormSyncComponent } from './containers/form-sync/form-sync.component';

const routes: Routes = [
  {
    path: '',
    component: FormSyncComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
