import { InjectionToken, NgModule } from '@angular/core';
import { FormSyncModule } from '@larscom/ngrx-store-storagesync';
import { ActionReducerMap, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromSettings from '../modules/settings/store/settings.reducer';
import * as fromApp from './app.reducer';
import { metaReducers } from './build-specifics/meta-reducers';
import { IRootState } from './models/root-state';

export const ROOT_REDUCER = new InjectionToken<ActionReducerMap<IRootState>>('ROOT_REDUCER');

@NgModule({
  imports: [
    NgRxStoreModule.forRoot(ROOT_REDUCER, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 30 }),
    FormSyncModule.forRoot()
  ],
  exports: [NgRxStoreModule],
  providers: [{ provide: ROOT_REDUCER, useValue: { app: fromApp.reducer, settings: fromSettings.reducer } }]
})
export class StoreModule {}
