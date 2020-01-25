import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { FormControlDirective } from './directives/form-control.directive';
import { FormGroupDirective } from './directives/form-group.directive';
import { FEATURE_STORE_KEY } from './form-sync.constants';
import { FORM_SYNC_REDUCER } from './providers/form-sync.providers';
import { formSyncReducer } from './store/form.reducer';

@NgModule({
  declarations: [FormGroupDirective, FormControlDirective],
  imports: [StoreModule.forFeature(FEATURE_STORE_KEY, FORM_SYNC_REDUCER)],
  exports: [FormGroupDirective, FormControlDirective]
})
export class FormSyncModule {
  /**
   * Import FormSyncModule.forRoot() only once.
   * For feature modules use: FormSyncModule
   */
  static forRoot(): ModuleWithProviders<FormSyncModule> {
    return {
      ngModule: FormSyncModule,
      providers: [
        {
          provide: FORM_SYNC_REDUCER,
          useValue: formSyncReducer
        }
      ]
    };
  }
}
