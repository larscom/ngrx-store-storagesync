import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionReducer, StoreModule } from '@ngrx/store';

import { MaterialModule } from '../../shared/modules/material/material.module';
import * as fromSettings from './store/settings.reducer';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsListComponent } from './containers/settings-list/settings-list.component';

export const SETTINGS_REDUCER = new InjectionToken<ActionReducer<fromSettings.ISettingsState>>('SETTINGS_REDUCER');

@NgModule({
  declarations: [SettingsListComponent],
  imports: [
    StoreModule.forFeature('settings', SETTINGS_REDUCER),
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: SETTINGS_REDUCER, useValue: fromSettings.reducer }]
})
export class SettingsModule {}
