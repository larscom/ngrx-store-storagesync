import { BehaviorSubject } from 'rxjs';
import { FormControlDirective } from '../directives/form-control.directive';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormSyncService {
  private readonly formControlDirectives = new BehaviorSubject<FormControlDirective[]>([]);

  formControlDirectives$ = this.formControlDirectives.asObservable();

  registerControl(control: FormControlDirective): void {
    this.formControlDirectives.next([...this.formControlDirectives.value, control]);
  }

  deregisterControl(control: FormControlDirective): void {
    this.formControlDirectives.next([...this.formControlDirectives.value.filter(ctrl => ctrl !== control)]);
  }
}
