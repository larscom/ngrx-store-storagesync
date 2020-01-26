import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { patchForm } from '@larscom/ngrx-store-storagesync';
import { select, Store } from '@ngrx/store';
import { IRootState } from 'src/app/store/models/root-state';
import { setFormGroupSync } from '../../store/forms.actions';
import * as formsSelectors from '../../store/forms.selectors';

@Component({
  selector: 'app-form-sync',
  templateUrl: 'form-sync.component.html',
  styleUrls: ['form-sync.component.scss']
})
export class FormSyncComponent {
  readonly formGroupId = 'formGroup';
  readonly formGroup = this.formBuilder.group({
    firstName: [String(), Validators.compose([Validators.required])],
    lastName: [String(), Validators.compose([Validators.required])]
  });

  readonly syncEnabled$ = this.store$.pipe(select(formsSelectors.getSyncEnabled));

  constructor(private readonly formBuilder: FormBuilder, private readonly store$: Store<IRootState>) {}

  onSubmit(): void {
    this.formGroup.reset();
  }

  onFormGroupSyncChange({ checked: enabled }: MatSlideToggleChange): void {
    this.store$.dispatch(setFormGroupSync({ enabled }));
    if (enabled) {
      this.store$.dispatch(patchForm({ id: this.formGroupId, value: this.formGroup.value }));
    }
  }
}
