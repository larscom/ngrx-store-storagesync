import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormGroupDirective } from 'projects/ngrx-store-storagesync/src/lib/form-sync/directives/form-group.directive';
import { FORM_SYNC_STORE_KEY } from 'projects/ngrx-store-storagesync/src/lib/form-sync/form-sync.constants';
import { IFormSyncConfig } from 'projects/ngrx-store-storagesync/src/lib/form-sync/models/form-sync-config';
import * as formActions from 'projects/ngrx-store-storagesync/src/lib/form-sync/store/form.actions';
import { of } from 'rxjs';
import { MockStore } from '../mock-store';

describe('FormGroupDirective', () => {
  let store: MockStore<any>;
  let directive: FormGroupDirective;
  let dispatchSpy: jasmine.Spy;
  let field1: FormControl;
  let field2: FormControl;

  const defaultConfig: IFormSyncConfig = { syncOnSubmit: false, syncRawValue: false, syncValidOnly: false };

  beforeEach(() => {
    store = new MockStore(of({ [FORM_SYNC_STORE_KEY]: {} }));
    dispatchSpy = spyOn(store, 'dispatch');
  });

  afterEach(() => directive.ngOnDestroy());

  it('should create', () => {
    createDirective(defaultConfig);
    expect(directive).toBeTruthy();
  });

  it('should dispatch with default configuration', () => {
    createDirective(defaultConfig);

    const { formGroupId, formGroup } = directive;

    field1.setValue('test');

    const expected = formActions.patchForm({ id: formGroupId, value: formGroup.value });

    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should not dispatch with invalid form status', () => {
    createDirective({ syncValidOnly: true });

    field1.setValue('test');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch on value change', () => {
    createDirective({ syncOnSubmit: true });

    field1.setValue('test');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch on submit', () => {
    createDirective({ syncOnSubmit: true });

    const { formGroupId, formGroup } = directive;

    directive.onSubmit();

    const expected = formActions.patchForm({ id: formGroupId, value: formGroup.value });

    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should dispatch on submit and valid form only', () => {
    createDirective({ syncOnSubmit: true, syncValidOnly: true });

    const { formGroupId, formGroup } = directive;

    field1.setValue('test');
    field2.setValue('test');

    directive.onSubmit();

    const expected = formActions.patchForm({ id: formGroupId, value: formGroup.value });

    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should not dispatch on submit with invalid form', () => {
    createDirective({ syncOnSubmit: true, syncValidOnly: true });

    field1.setValue('test');

    directive.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch raw value on submit and valid form only', () => {
    createDirective({ syncRawValue: true, syncOnSubmit: true, syncValidOnly: true });

    const { formGroupId, formGroup } = directive;

    field1.setValue('test');
    field1.disable();

    field2.setValue('test');

    directive.onSubmit();

    const expected = formActions.patchForm({ id: formGroupId, value: formGroup.getRawValue() });

    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should sync disabled controls', () => {
    createDirective({ syncRawValue: true });

    const { formGroupId, formGroup } = directive;

    field1.setValue('test');
    field1.disable();

    field2.setValue('test');

    const expected = formActions.patchForm({ id: formGroupId, value: formGroup.getRawValue() });

    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  function createDirective(config: IFormSyncConfig): void {
    directive = new FormGroupDirective(config, store as Store<any>);
    field1 = new FormControl(null, Validators.required);
    field2 = new FormControl(null, Validators.required);
    directive.formGroup = new FormGroup({ field1, field2 });
    directive.formGroupId = '1';
    directive.ngOnInit();
  }
});
