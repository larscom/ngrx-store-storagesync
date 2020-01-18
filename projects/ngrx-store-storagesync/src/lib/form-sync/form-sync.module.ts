import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormControlDirective } from './directives/form-control.directive';
import { FormGroupDirective } from './directives/form-group.directive';
import { formSyncReducer } from './store/form.reducer';
import { FORM_SYNC_REDUCER } from './providers/form-sync.providers';

@NgModule({
  declarations: [FormGroupDirective, FormControlDirective],
  exports: [FormGroupDirective, FormControlDirective]
})
export class FormSyncModule {
  static forFeature(): ModuleWithProviders<FormSyncModule> {
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
