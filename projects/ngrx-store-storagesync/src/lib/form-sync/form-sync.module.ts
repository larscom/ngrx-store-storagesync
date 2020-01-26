import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { FormGroupDirective } from './directives/form-group.directive';
import { FORM_SYNC_STORE_KEY } from './form-sync.constants';
import { FORM_SYNC_REDUCER } from './providers/form-sync.providers';
import { formSyncReducer } from './store/form.reducer';

@NgModule({
  declarations: [FormGroupDirective],
  imports: [StoreModule.forFeature(FORM_SYNC_STORE_KEY, FORM_SYNC_REDUCER)],
  exports: [FormGroupDirective]
})
export class FormSyncModule {
  /**
   * Import 'FormSyncModule.forRoot()' only once.
   * Use 'FormSyncModule' for additional imports.
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
