import { NgModule } from '@angular/core';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment';
import * as fromApp from './app.reducer';
import { IRootState } from './interfaces/root-state';

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  return storageSync<IRootState>({
    features: [{ stateKey: 'app', storageForFeature: window.sessionStorage }, { stateKey: 'todo' }],
    storageError: console.error,
    storage: window.localStorage
  })(reducer);
}

const metaReducers = environment.production
  ? [storageSyncReducer]
  : [storageSyncReducer, storeFreeze];

@NgModule({
  imports: [
    NgRxStoreModule.forRoot({ app: fromApp.reducer }, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 30 })
  ],
  exports: [NgRxStoreModule]
})
export class StoreModule {}
