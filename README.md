# @larscom/ngrx-store-storagesync

[![npm](https://img.shields.io/github/tag-date/larscom/ngrx-store-storagesync.svg?label=latest%20release)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
[![travis build](https://img.shields.io/travis/com/larscom/ngrx-store-storagesync/master.svg?label=build%20%28master%29)](https://travis-ci.com/larscom/ngrx-store-storagesync/builds)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-storagesync.svg)](https://github.com/larscom/ngrx-store-storagesync/blob/master/LICENSE)

Simple syncing (with ignoring specific keys) between the ngrx store and localstorage/sessionstorage.

## Dependencies

`@larscom/ngrx-store-storagesync` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular 2+](https://github.com/angular/angular).

## Usage

```bash
npm i --save @larscom/ngrx-store-storagesync
```

**How to use**

1. Wrap storageSync in an exported function.
2. Include it in your meta-reducers array in `StoreModule.forRoot`.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import * as fromApp from './app/reducer';

export const reducers: ActionReducerMap<IState> = {
  router: routerReducer,
  app: fromApp.reducer
};

export function storageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return storageSync({
    features: [{ stateKey: 'router' }, { stateKey: 'app', ignoreKeys: ['success', 'loading'] }],
    storage: window.sessionStorage
  })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [storageSyncReducer];

@NgModule({
  imports: [BrowserModule, StoreModule.forRoot(reducers, { metaReducers })]
})
export class MyAppModule {}
```
