import { InjectionToken, NgModule } from '@angular/core';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer, ActionReducerMap, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import * as fromApp from './app.reducer';
import { IRootState } from './models/root-state';

export const ROOT_REDUCER = new InjectionToken<ActionReducerMap<IRootState>>('ROOT_REDUCER');

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  return storageSync<IRootState>({
    version: 1,
    features: [
      { stateKey: 'app', storageForFeature: window.sessionStorage },
      { stateKey: 'todo' },
      { stateKey: 'settings' }
    ],
    storageError: console.error,
    storage: window.localStorage
  })(reducer);
}

const metaReducers = environment.production ? [storageSyncReducer] : [storageSyncReducer, storeFreeze];

@NgModule({
  imports: [NgRxStoreModule.forRoot(ROOT_REDUCER, { metaReducers }), StoreDevtoolsModule.instrument({ maxAge: 30 })],
  exports: [NgRxStoreModule],
  providers: [{ provide: ROOT_REDUCER, useValue: { app: fromApp.reducer } }]
})
export class StoreModule {}
