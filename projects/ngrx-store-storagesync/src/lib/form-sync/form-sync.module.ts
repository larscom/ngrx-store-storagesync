import { NgModule } from '@angular/core';
import { FormGroupDirective } from './directives/form-group.directive';
import { FormControlDirective } from './directives/form-control.directive';

@NgModule({
  declarations: [FormGroupDirective, FormControlDirective],
  exports: [FormGroupDirective, FormControlDirective]
})
export class FormSyncModule {}
