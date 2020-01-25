import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { deleteForm, resetForm } from '@larscom/ngrx-store-storagesync';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { IRootState } from 'src/app/store/models/root-state';
import { setSync } from '../../store/forms.actions';
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

  async onSubmit(): Promise<void> {
    const syncEnabled = await this.syncEnabled$.pipe(first()).toPromise();
    if (syncEnabled) {
      this.store$.dispatch(resetForm({ id: this.formGroupId }));
    } else {
      this.formGroup.reset();
    }
  }

  onSyncChange({ checked: enabled }: MatSlideToggleChange): void {
    this.store$.dispatch(setSync({ enabled }));
    this.store$.dispatch(deleteForm({ id: this.formGroupId }));
  }
}
