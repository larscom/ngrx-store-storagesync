import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { SettingsListComponent } from './containers/settings-list/settings-list.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [SettingsListComponent],
  imports: [CommonModule, SettingsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule]
})
export class SettingsModule {}
