import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatCheckboxModule
} from '@angular/material';

const exports = [
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatCheckboxModule
];

@NgModule({ exports })
export class MaterialModule {}
