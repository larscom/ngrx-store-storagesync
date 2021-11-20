import { storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer } from '@ngrx/store';
import { IRootState } from './models/root-state';

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  const metaReducer = storageSync<IRootState>({
    version: 1,
    features: [
      { stateKey: 'app', storageForFeature: window.sessionStorage },
      { stateKey: 'todo' },
      { stateKey: 'settings' }
    ],
    storageError: console.error,
    storage: window.localStorage
  });

  return metaReducer(reducer);
}
