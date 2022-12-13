# @larscom/ngrx-store-storagesync

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-store-storagesync.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-store-storagesync)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-storagesync.svg)](https://github.com/larscom/ngrx-store-storagesync/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/larscom/ngrx-store-storagesync/branch/master/graph/badge.svg?token=P8CK9EK73K)](https://codecov.io/gh/larscom/ngrx-store-storagesync)

[![CodeQL](https://github.com/larscom/ngrx-store-storagesync/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-storagesync/actions/workflows/codeql-analysis.yml)
[![firebase-hosting](https://github.com/larscom/ngrx-store-storagesync/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-storagesync/actions/workflows/firebase-hosting-merge.yml)


> **Highly configurable** state sync library between `localStorage/sessionStorage` and `@ngrx/store` (Angular)

### ✨ [Live Demo](https://ngrx-store-storagesync.firebaseapp.com)

## Features
- &#10003; Sync with `localStorage` and `sessionStorage`
- &#10003; **Storage** option per feature state, for example:
  - feature1 to `sessionStorage`
  - feature2 to `localStorage`
- &#10003; Exclude **deeply** nested properties  
- &#10003; [Sync Reactive Forms](#Sync-Reactive-Forms) (needs additional library)

## Dependencies

`@larscom/ngrx-store-storagesync` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular](https://github.com/angular/angular)

## Installation

```bash
npm i --save @larscom/ngrx-store-storagesync
```

Choose the version corresponding to your Angular version

| @angular/core | @larscom/ngrx-store-storagesync |
| ------------- | ------------------------------- |
| >= 12         | >= 13.0.0                       |
| < 12          | <= 6.3.0                        |

## Usage

Include `storageSyncReducer` in your meta-reducers array in `StoreModule.forRoot`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import * as fromFeature1 from './feature/reducer';

export const reducers: ActionReducerMap<IRootState> = {
  router: routerReducer,
  feature1: fromFeature1.reducer
};

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  // provide all feature states within the features array
  // features which are not provided, do not get synced
  const metaReducer = storageSync<IRootState>({
    features: [
      // save only router state to sessionStorage
      { stateKey: 'router', storageForFeature: window.sessionStorage },

      // exclude key 'success' inside 'auth' and all keys 'loading' inside 'feature1'
      { stateKey: 'feature1', excludeKeys: ['auth.success', 'loading'] }
    ],
    // defaults to localStorage
    storage: window.localStorage
  });

  return metaReducer(reducer);
}

// add storageSyncReducer to metaReducers
const metaReducers: MetaReducer<any>[] = [storageSyncReducer];

@NgModule({
  imports: [BrowserModule, StoreModule.forRoot(reducers, { metaReducers })]
})
export class AppModule {}
```

## Configuration

```ts
export interface IStorageSyncOptions<T> {
  /**
   * By default, states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureOptions<T>[];
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Give the state a version. Version will be checked before rehydration.
   *
   * @examples
   *  Version from Storage = 1 and Config.version = 2 --> Skip hydration
   *
   *  Version from Storage = undefined and Config.version = 1 --> Skip hydration
   *
   *  Version from Storage = 1 and Config.version = undefined --> Skip hydration
   *
   *  Version from Storage = 1 and Config.version = 1 --> Hydrate
   */
  version?: number;
  /**
   * Function that gets executed on a storage error
   * @param error the error that occurred
   */
  storageError?: (error: any) => void;
  /**
   * Restore last known state from storage on startup
   */
  rehydrate?: boolean;
  /**
   * Serializer for storage keys
   * @param key the storage item key
   */
  storageKeySerializer?: (key: string) => string;
  /**
   * Custom state merge function after rehydration (by default it does a deep merge)
   * @param state the next state
   * @param rehydratedState the state resolved from a storage location
   */
  rehydrateStateMerger?: (state: T, rehydratedState: T) => T;
}
```

```ts
export interface IFeatureOptions<T> {
  /**
   * The name of the feature state to sync
   */
  stateKey: string;
  /**
   * Filter out (ignore) properties that exist on the feature state.
   *
   * @example
   * // Filter/ignore key with name 'config' and name 'auth'
   * ['config', 'auth']
   *
   * // Filter/ignore only key 'loading' inside object 'auth'
   * ['auth.loading']
   */
  excludeKeys?: string[];
  /**
   * Provide the storage type to sync the feature state to,
   * it can be any storage which implements the 'Storage' interface.
   *
   * It will override the storage property in StorageSyncOptions
   * @see IStorageSyncOptions
   */
  storageForFeature?: Storage;
  /**
   * Sync to storage will only occur when this function returns true
   * @param featureState the next feature state
   * @param state the next state
   */
  shouldSync?: (featureState: T[keyof T], state: T) => boolean;
  /**
   * Serializer for storage keys (feature state),
   * it will override the storageKeySerializer in StorageSyncOptions
   * @see IStorageSyncOptions
   *
   * @param key the storage item key
   */
  storageKeySerializerForFeature?: (key: string) => string;
  /**
   * Serializer for the feature state (before saving to a storage location)
   * @param featureState the next feature state
   */
  serialize?: (featureState: T[keyof T]) => string;
  /**
   * Deserializer for the feature state (after getting the state from a storage location)
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   * @param featureState the feature state retrieved from a storage location
   */
  deserialize?: (featureState: string) => T[keyof T];
}
```

## Examples

### Sync to different storage locations

You can sync to different storage locations per feature state.

```ts
export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [
      { stateKey: 'feature1', storageForFeature: window.sessionStorage }, // to sessionStorage
      { stateKey: 'feature2' } // to localStorage because of 'default' which is set below.
    ],
    storage: window.localStorage // default
  })(reducer);
}
```

### Exclude specific properties on state

Prevent specific properties from being synced to storage.

```ts
const state: IRootState = {
  feature1: {
    message: 'hello', // excluded
    loading: false,
    auth: {
      loading: false, // excluded
      loggedIn: false,
      message: 'hello' // excluded
    }
  }
};

export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [{ stateKey: 'feature1', excludeKeys: ['auth.loading', 'message'] }],
    storage: window.localStorage
  })(reducer);
}
```

### Sync conditionally

Sync state to storage based on a condition.

```ts
const state: IRootState = {
  checkMe: true, // <---
  feature1: {
    rememberMe: false, // <---
    auth: {
      loading: false,
      message: 'hello'
    }
  }
};

export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [
      {
        stateKey: 'feature1',
        shouldSync: (feature1, state) => {
          return feature1.rememberMe || state.checkMe;
        }
      }
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Serialize state

Override the default serializer for the feature state.

```ts
export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [
      {
        stateKey: 'feature1',
        serialize: (feature1) => JSON.stringify(feature1)
      }
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Deserialize state

Override the default deserializer for the feature state.

```ts
export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [
      {
        stateKey: 'feature1',
        deserialize: (feature1: string) => JSON.parse(feature1)
      }
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Serialize storage key

Override the default storage key serializer.

```ts
export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [{ stateKey: 'feature1' }],
    storageKeySerializer: (key: string) => `abc_${key}`,
    storage: window.localStorage
  })(reducer);
}
```

### Merge rehydrated state

Override the default rehydrated state merger.

```ts
export function storageSyncReducer(reducer: ActionReducer<IRootState>) {
  return storageSync<IRootState>({
    features: [{ stateKey: 'feature1' }],
    rehydrateStateMerger: (state: IRootState, rehydratedState: IRootState) => {
      return { ...state, ...rehydratedState };
    },
    storage: window.localStorage
  })(reducer);
}
```

## Sync Reactive Forms

To sync `reactive forms` to the store, you can use [@larscom/ngrx-store-formsync](https://github.com/larscom/ngrx-store-formsync)

It is really easy to setup and you can combine that library with this one.

Head over to [@larscom/ngrx-store-formsync](https://github.com/larscom/ngrx-store-formsync) on how to configure that library.
