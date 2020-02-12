import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken } from '@angular/core';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormSyncModule } from '@larscom/ngrx-store-storagesync';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { FormSyncComponent } from './containers/form-sync/form-sync.component';
import { FormsRoutingModule } from './forms-routing.module';
import { ActionReducer, StoreModule } from '@ngrx/store';
import * as fromForms from './store/forms.reducer';

export const FORMS_REDUCER = new InjectionToken<ActionReducer<fromForms.IFormsState>>('FORMS_REDUCER');

@NgModule({
  declarations: [FormSyncComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MaterialModule,
    NgFormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('forms', FORMS_REDUCER),
    FormSyncModule
  ],
  providers: [{ provide: FORMS_REDUCER, useValue: fromForms.reducer }]
})
export class FormsModule {}
