# ngrx-store-storagesync

Simple syncing (with ignoring/blacklisting specific keys) between the ngrx store and localstorage/sessionstorage.

## Dependencies

`ngrx-store-storagesync` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular 2+](https://github.com/angular/angular).

## Usage

```bash
npm i --save ngrx-store-storagesync
```

**How to use**

1. Wrap storageSync in an exported function.
2. Include it in your meta-reducers array in `StoreModule.forRoot`.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { storageSync } from 'ngrx-store-storagesync';
import * as fromApp from './app/reducer';

export const reducers: ActionReducerMap<IState> = {
  router: routerReducer,
  app: fromApp.reducer
};

export function storageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return storageSync({
    features: [{ stateKey: 'router' }, { stateKey: 'app', blackListKeys: ['success', 'loading'] }],
    storage: window.sessionStorage
  })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [storageSyncReducer];

@NgModule({
  imports: [BrowserModule, StoreModule.forRoot(reducers, { metaReducers })]
})
export class MyAppModule {}
```
