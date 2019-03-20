# @larscom/ngrx-store-storagesync

[![npm-release](https://img.shields.io/npm/v/@larscom/ngrx-store-storagesync.svg?label=npm%20release)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
[![git-release](https://img.shields.io/github/tag/larscom/ngrx-store-storagesync.svg?label=git%20release)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
[![travis build](https://img.shields.io/travis/com/larscom/ngrx-store-storagesync/master.svg?label=build%20%28master%29)](https://travis-ci.com/larscom/ngrx-store-storagesync/builds)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-storagesync.svg)](https://github.com/larscom/ngrx-store-storagesync/blob/master/LICENSE)

Simple syncing (with ignoring specific keys) between the ngrx store and localstorage/sessionstorage.
You can also sync different 'feature' states to different storage locations.
For example:

- feature1 to sessionStorage
- feature2 to localStorage

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
import * as fromFeature1 from './feature/reducer';

export const reducers: ActionReducerMap<IState> = {
  router: routerReducer,
  app: fromApp.reducer,
  feature1: fromFeature1.reducer
};

export function storageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return storageSync({
    features: [
      // saves only router state to sessionStorage
      { stateKey: 'router', storageForFeature: window.sessionStorage },

      // will ignore all keys with success / loading inside the 'app' feature state
      { stateKey: 'app', ignoreKeys: ['success', 'loading'] },

      // will ignore object 'auth' with key 'success' inside the 'feature1' state
      // ignoring keys with 'object.key' can only be used in pairs (so, object.key.object doesn't work)
      { stateKey: 'feature1', ignoreKeys: ['auth.success', 'loading'] }
    ],
    // defaults to localStorage
    storage: window.localStorage
  })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [storageSyncReducer];

@NgModule({
  imports: [BrowserModule, StoreModule.forRoot(reducers, { metaReducers })]
})
export class AppModule {}
```

## Deserializing

By default the state gets deserialized and parsed by `JSON.parse` with an ISO date reviver.
This means that your ISO date objects gets stored as `string`, and restored as `Date`

If you do not want this behaviour, you can implement your own `deserialize` function.

## Configuration

```ts
export interface IStorageSyncOptions {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureOptions[];
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Sync empty objects to storage
   * @default syncEmptyObjects false
   */
  syncEmptyObjects?: boolean;
  /**
   * Function that gets executed on a storage error
   * @param error the error that occurred
   */
  storageError?: (error: any) => void;
  /**
   * Pull initial state from storage on startup
   * @default rehydrate true
   */
  rehydrate?: boolean;
  /**
   * Serializer for storage keys
   * @param key the storage item key
   * @default storageKeySerializer (key: string) => key
   */
  storageKeySerializer?: (key: string) => string;
  /**
   * Custom state merge function after rehydration (by default it does a deep merge)
   * @param state the next state
   * @param rehydratedState the state returned from a storage location
   */
  rehydrateStateMerger?: (state: any, rehydratedState: any) => any;
}
```

```ts
export interface IFeatureOptions {
  /**
   * The name of the feature state
   */
  stateKey: string;
  /**
   * Filter out properties that exist on the feature state.
   */
  ignoreKeys?: string[];
  /**
   * Provide the storage type to sync the feature state to,
   * it can be any storage which implements the 'Storage' interface.
   *
   * It will override the global storage property for this feature
   */
  storageForFeature?: Storage;
  /**
   * Sync to storage will only occur when this function returns true
   * @param featureState the next feature state
   * @param state the next state
   * @default shouldSync (featureState: any) => true
   */
  shouldSync?: (featureState: any, state: any) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the global storageKeySerializer for this feature
   * @param key the storage item key
   * @default storageKeySerializerForFeature (key: string) => key
   */
  storageKeySerializerForFeature?: (key: string) => string;
  /**
   * Serializer for the feature state (before saving to a storage location)
   * @param featureState the next feature state
   * @default serialize (featureState: any) => JSON.stringify(featureState)
   */
  serialize?: (featureState: any) => string;
  /**
   * Deserializer for the feature state (after getting the state from a storage location)
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   * @param featureState the feature state retrieved from a storage location
   * @default deserialize (featureState: string) => JSON.Parse(featureState)
   */
  deserialize?: (featureState: string) => any;
}
```
