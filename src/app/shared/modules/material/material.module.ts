import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

const exports = [
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSlideToggleModule
];

@NgModule({ exports })
export class MaterialModule {}
