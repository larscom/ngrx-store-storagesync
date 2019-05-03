import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule
} from '@angular/material';

const exports = [
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule
];

@NgModule({ exports })
export class MaterialModule {}
