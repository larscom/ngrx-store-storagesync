import { FORM_SYNC_STORE_KEY, storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer } from '@ngrx/store';
import { IRootState } from './models/root-state';

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  const sync = storageSync<IRootState>({
    version: 1,
    features: [
      { stateKey: 'app', storageForFeature: window.sessionStorage },
      { stateKey: 'todo' },
      { stateKey: 'settings' },
      { stateKey: 'forms' },
      { stateKey: FORM_SYNC_STORE_KEY, storageForFeature: window.sessionStorage }
    ],
    storageError: console.error,
    storage: window.localStorage
  });

  return sync(reducer);
}
