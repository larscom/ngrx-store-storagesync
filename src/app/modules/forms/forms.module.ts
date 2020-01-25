import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormSyncModule } from '@larscom/ngrx-store-storagesync';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { FormSyncComponent } from './containers/form-sync/form-sync.component';
import { FormsRoutingModule } from './forms-routing.module';

@NgModule({
  declarations: [FormSyncComponent],
  imports: [CommonModule, FormsRoutingModule, MaterialModule, NgFormsModule, ReactiveFormsModule, FormSyncModule]
  // providers: [{ provide: FORMS_REDUCER, useValue: fromForms.reducer }]
})
export class FormsModule {}
