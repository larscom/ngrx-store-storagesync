import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-sync',
  templateUrl: 'form-sync.component.html',
  styleUrls: ['form-sync.component.scss']
})
export class FormSyncComponent {
  constructor(private readonly formBuilder: FormBuilder) {}

  readonly formGroup1 = this.formBuilder.group({
    firstName: [String(), Validators.compose([Validators.required])],
    lastName: [String(), Validators.compose([Validators.required])],
    middleName: [String(), Validators.compose([Validators.required])]
  });
}
