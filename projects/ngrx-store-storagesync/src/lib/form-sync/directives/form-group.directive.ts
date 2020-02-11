import { Directive, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { IFormSyncConfig } from '../models/form-sync-config';
import { FORM_SYNC_CONFIG } from '../providers/form-sync.providers';
import { patchForm } from '../store/form.actions';
import { getFormSyncValue } from '../store/form.selectors';

@Directive({
  selector: '[formGroup]'
})
export class FormGroupDirective implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() formGroupId: string;
  @Input() formGroupSync = true;

  constructor(@Inject(FORM_SYNC_CONFIG) private readonly config: IFormSyncConfig, private readonly store: Store<any>) {}

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    if (!this.formGroupId) {
      return;
    }

    const { syncOnSubmit, syncValidOnly, syncRawValue } = this.config;
    this.subscriptions.add(
      this.formGroup.valueChanges
        .pipe(
          filter(() => this.formGroupSync),
          filter(() => !(syncValidOnly && !this.formGroup.valid)),
          filter(() => !syncOnSubmit)
        )
        .subscribe(() => this.dispatch(syncRawValue))
    );

    this.subscriptions.add(
      this.store
        .pipe(
          filter(() => this.formGroupSync),
          select(getFormSyncValue, { id: this.formGroupId }),
          filter(value => value != null)
        )
        .subscribe(value => this.formGroup.patchValue(value, { emitEvent: false }))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('submit')
  onSubmit(): void {
    if (!this.formGroupId || !this.formGroupSync) {
      return;
    }

    const { syncOnSubmit, syncValidOnly, syncRawValue } = this.config;

    if (!syncOnSubmit) {
      return;
    }

    if (syncValidOnly && !this.formGroup.valid) {
      return;
    }

    this.dispatch(syncRawValue);
  }

  private dispatch(syncRawValue: boolean): void {
    const value = syncRawValue ? this.formGroup.getRawValue() : this.formGroup.value;
    this.store.dispatch(patchForm({ id: this.formGroupId, value }));
  }
}
