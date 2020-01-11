import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { DrawerComponent } from './containers/drawer/drawer.component';
import { StorageDisplayComponent } from './containers/storage-display/storage-display.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { StoreModule } from './store/store.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DrawerComponent,
    NavigationMenuComponent,
    StorageDisplayComponent
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, MaterialModule, StoreModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
