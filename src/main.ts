import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { enableProdMode, isDevMode } from '@angular/core';
import { AppModule } from './app/app.module';

if (!isDevMode()) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
