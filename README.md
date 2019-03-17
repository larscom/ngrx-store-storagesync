# @larscom/ngrx-store-storagesync
[![npm-release](https://img.shields.io/npm/v/@larscom/ngrx-store-storagesync.svg?label=npm%20release)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
[![git-release](https://img.shields.io/github/tag/larscom/ngrx-store-storagesync.svg?label=git%20release)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
[![travis build](https://img.shields.io/travis/com/larscom/ngrx-store-storagesync/master.svg?label=build%20%28master%29)](https://travis-ci.com/larscom/ngrx-store-storagesync/builds)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-storagesync.svg)](https://github.com/larscom/ngrx-store-storagesync/blob/master/LICENSE)

Simple syncing (with ignoring specific keys) between the ngrx store and localstorage/sessionstorage.

## Dependencies

`@larscom/ngrx-store-storagesync` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular 2+](https://github.com/angular/angular).

## Installation

```bash
npm i --save @larscom/ngrx-store-storagesync
```

## Usage
**1. Wrap storageSync in an exported function and include it in your meta-reducers array in `StoreModule.forRoot`**

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
export class AppModule {}
```

## Configuration

```ts
export interface IStorageSyncConfig {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureConfig[];
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Pull initial state from storage on startup
   * @default true
   */
  rehydrate?: boolean;
  /**
   * Restore serialized date objects. If you work directly with ISO date strings, set this to false
   * @default true
   */
  restoreDates?: boolean;
  /**
   * Serializer for storage keys
   * @param key the storage item key
   * @default (key: string) => key
   */
  storageKeySerializer?: (key: string) => string;
  /**
   * Custom state merge function after rehydration (by default it does a deep merge)
   * @param state the next state
   * @param rehydratedState the state returned from a storage location
   */
  rehydrateStateMerger?: (state: any, rehydratedState: any) => Object;
}
```
```ts
export interface IFeatureConfig {
  /**
   * The name of the feature state
   */
  stateKey: string;
  /**
   * Filter out properties that exist on the feature state.
   */
  ignoreKeys?: string[];
  /**
   * Sync to storage will only occur when this function returns true
   * @param featureState the next feature state
   * @default (featureState: any) => true
   */
  shouldSync?: (featureState: any) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the global storageKeySerializer for this feature
   * @param key the storage item key
   * @default (key: string) => key
   */
  storageKeySerializerForFeature?: (key: string) => string;
}
```
