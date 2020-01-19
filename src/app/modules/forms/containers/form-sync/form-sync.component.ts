import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IRootState } from 'src/app/store/models/root-state';
import { Store } from '@ngrx/store';
import { resetForm } from '@larscom/ngrx-store-storagesync';

@Component({
  selector: 'app-form-sync',
  templateUrl: 'form-sync.component.html',
  styleUrls: ['form-sync.component.scss']
})
export class FormSyncComponent {
  constructor(private readonly formBuilder: FormBuilder, private readonly store: Store<IRootState>) {}

  readonly formGroup1 = this.formBuilder.group({
    firstName: [String(), Validators.compose([Validators.required])],
    lastName: [String(), Validators.compose([Validators.required])]
  });

  onSubmit(): void {
    window.location.reload();
    this.store.dispatch(resetForm({ id: 'formGroup1' }));
  }
}
