import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormSyncModule, FORM_SYNC_REDUCER } from '@larscom/ngrx-store-storagesync';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { FormSyncComponent } from './containers/form-sync/form-sync.component';
import { FormsRoutingModule } from './forms-routing.module';

@NgModule({
  declarations: [FormSyncComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MaterialModule,
    NgFormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('form', FORM_SYNC_REDUCER),
    FormSyncModule.forFeature()
  ]
})
export class FormsModule {}
