import { NgModule } from '@angular/core';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IRootState } from './interfaces/root-state';
import * as fromApp from './app.reducer';

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  return storageSync<IRootState>({
    features: [{ stateKey: 'app', storageForFeature: window.sessionStorage }, { stateKey: 'todo' }],
    storageError: console.error,
    storage: window.localStorage
  })(reducer);
}

@NgModule({
  imports: [
    NgRxStoreModule.forRoot({ app: fromApp.reducer }, { metaReducers: [storageSyncReducer] }),
    StoreDevtoolsModule.instrument({ maxAge: 30 })
  ],
  exports: [NgRxStoreModule]
})
export class StoreModule {}
