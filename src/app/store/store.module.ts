import { InjectionToken, NgModule } from '@angular/core';
import { ActionReducerMap, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromSettings from '../modules/settings/store/settings.reducer';
import * as fromApp from './app.reducer';
import { IRootState } from './models/root-state';
import { storageSyncReducer } from './storage-sync.reducer';

export const ROOT_REDUCER = new InjectionToken<ActionReducerMap<IRootState>>('ROOT_REDUCER');

const strictStore = true;

@NgModule({
  imports: [
    NgRxStoreModule.forRoot(ROOT_REDUCER, {
      metaReducers: [storageSyncReducer],
      runtimeChecks: {
        strictStateSerializability: strictStore,
        strictActionSerializability: strictStore,
        strictStateImmutability: strictStore,
        strictActionImmutability: strictStore,
        strictActionWithinNgZone: strictStore,
        strictActionTypeUniqueness: strictStore
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 30 })
  ],
  exports: [NgRxStoreModule],
  providers: [{ provide: ROOT_REDUCER, useValue: { app: fromApp.reducer, settings: fromSettings.reducer } }]
})
export class StoreModule {}
