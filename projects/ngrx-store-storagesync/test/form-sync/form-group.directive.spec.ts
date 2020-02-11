import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormGroupDirective } from 'projects/ngrx-store-storagesync/src/lib/form-sync/directives/form-group.directive';
import { FORM_SYNC_STORE_KEY } from 'projects/ngrx-store-storagesync/src/lib/form-sync/form-sync.constants';
import { IFormSyncConfig } from 'projects/ngrx-store-storagesync/src/lib/form-sync/models/form-sync-config';
import { of } from 'rxjs';
import { MockStore } from '../mock-store';

describe('FormGroupDirective', () => {
  const defaultFormGroup = new FormGroup({
    name: new FormControl()
  });
  const defaultConfig: IFormSyncConfig = { syncOnSubmit: false, syncRawValue: false, syncValidOnly: false };
  const defaultFormGroupId = '1';

  let store: MockStore<any>;
  let directive: FormGroupDirective;
  let dispatchSpy: jasmine.Spy;

  beforeEach(() => {
    store = new MockStore(of({ [FORM_SYNC_STORE_KEY]: {} }));
    directive = new FormGroupDirective(defaultConfig, store as Store<any>);
    dispatchSpy = spyOn(store, 'dispatch');

    directive.formGroup = defaultFormGroup;
    directive.formGroupId = defaultFormGroupId;
    directive.ngOnInit();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
