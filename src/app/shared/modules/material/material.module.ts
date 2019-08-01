import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';

const exports = [
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatInputModule
];

@NgModule({ exports })
export class MaterialModule {}
