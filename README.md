# @larscom/ngrx-store-storagesync

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-store-storagesync.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-store-storagesync)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-store-storagesync)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-storagesync.svg)](https://github.com/larscom/ngrx-store-storagesync/blob/master/LICENSE)
[![@larscom/ngrx-store-storagesync](https://github.com/larscom/ngrx-store-storagesync/workflows/@larscom/ngrx-store-storagesync/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-storagesync)

**Highly configurable** state syncing between the `@ngrx/store` and `localstorage` / `sessionstorage`

## Supports

- &#10003; Excluding **deeply** nested keys/objects
- &#10003; `Storage` location per feature state (e.g: feature1 to `sessionStorage`, feature2 to `localStorage`)
- &#10003; Server Side Rendering (SSR with `@nguniversal/express-engine`)
- &#10003; Reactive forms syncing with minimal configuration

## Demo (with SSR)

You can play arround at https://ngrx-store-storagesync.firebaseapp.com

## Dependencies

`@larscom/ngrx-store-storagesync` depends on [@ngrx/store 8+](https://github.com/ngrx/store) and [Angular 7+](https://github.com/angular/angular).

## Installation

```bash
npm i --save @larscom/ngrx-store-storagesync
```

## Usage

**1. Include `storageSyncReducer` in your meta-reducers array in `StoreModule.forRoot`**

**2. (optional) import `FormSyncModule.forRoot` once, to enable reactive forms sync**

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { FormSyncModule, FORM_SYNC_STORE_KEY, storageSync } from '@larscom/ngrx-store-storagesync';
import * as fromFeature1 from './feature/reducer';

export const reducers: ActionReducerMap<IState> = {
  router: routerReducer,
  feature1: fromFeature1.reducer,
};

export function storageSyncReducer(reducer: ActionReducer<IState>) {
  // provide all feature states within the features array
  // features which are not provided, do not get synced
  const metaReducer = storageSync<IState>({
    features: [
      // save only router state to sessionStorage
      { stateKey: 'router', storageForFeature: window.sessionStorage },

      // exclude key 'success' inside 'auth' and all keys 'loading' inside 'feature1'
      { stateKey: 'feature1', excludeKeys: ['auth.success', 'loading'] },

      // if the form sync module is imported and you want to save to sessionStorage
      { stateKey: FORM_SYNC_STORE_KEY, storageForFeature: window.sessionStorage },
    ],
    // defaults to localStorage
    storage: window.localStorage
  });

  return metaReducer(reducer);
}

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers: [storageSyncReducer] }),
    // optionally import 'FormSyncModule.forRoot()' once to enable reactive forms sync
    FormSyncModule.forRoot()
  ],
})
export class AppModule {}
```

## Configuration

```ts
export interface IStorageSyncOptions<T> {
  /**
   * By default, feature states are not synced, provide the feature states you want to sync.
   */
  features: IFeatureOptions<T>[];
  /**
   * Provide the storage type to sync the state to, it can be any storage which implements the 'Storage' interface.
   */
  storage: Storage;
  /**
   * Give the state a version number. Version number will be checked on rehydration.
   *
   * Skips rehydration if version from storage < version
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
  shouldSync?: (featureState: unknown, state: T) => boolean;
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
  serialize?: (featureState: unknown) => string;
  /**
   * Deserializer for the feature state (after getting the state from a storage location)
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   * @param featureState the feature state retrieved from a storage location
   */
  deserialize?: (featureState: string) => any;
}
```

## Using Reactive Forms Sync

Add `formGroupId` to the element where `formGroup` is present. Without `formGroupId`, the form doesn't get synced.

```html
<form [formGroup]="myFormGroup" [formGroupId]="'myFormGroupId'">
  <div>
    <input formControlName="firstName" />
    <input formControlName="lastName" />
  </div>
  <button type="submit">Submit</button>
</form>
```

## Configuration

You can override the default configuration on component level

```ts
import { Component } from '@angular/core';
import { IFormSyncConfig, FORM_SYNC_CONFIG } from '@larscom/ngrx-store-storagesync';

const formSyncConfig: IFormSyncConfig = {
  /* Only sync to the store when submitting the form. */
  syncOnSubmit: true,
};

@Component({
  selector: 'app-my-component',
  templateUrl: 'my-component.component.html',
  styleUrls: ['my-component.component.scss'],
  providers: [
    {
      provide: FORM_SYNC_CONFIG,
      useValue: formSyncConfig
    },
  ],
})
export class MyComponent {}
```

```ts
export interface IFormSyncConfig {
  /**
   * Only sync to the store when submitting the form.
   */
  syncOnSubmit?: boolean;
  /**
   * Only sync to the store when the form status is valid.
   */
  syncValidOnly?: boolean;
  /**
   * Sync the raw form value to the store (this will include disabled form controls)
   */
  syncRawValue?: boolean;
}
```

### FormGroup Directive API

| Attribute       | Type    | Default | Required | Description                                                  |
| --------------- | ------- | ------- | -------- | ------------------------------------------------------------ |
| `formGroupId`   | string  | null    | yes      | The unique ID for the form group.                            |
| `formGroupSync` | boolean | true    | no       | Whether the form group value should sync to the @ngrx/store. |

## Examples

### Sync to different storage locations

You can sync to different storage locations per feature state.

```ts
export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [
      { stateKey: 'feature1', storageForFeature: window.sessionStorage }, // to sessionStorage
      { stateKey: 'feature2' }, // to localStorage
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Exclude specific properties on state

Prevent specific properties from being synced to storage.

```ts
const state: IState = {
  feature1: {
    message: 'hello', // excluded
    loading: false,
    auth: {
      loading: false, // excluded
      loggedIn: false,
      message: 'hello', // excluded
    },
  },
};

export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [{ stateKey: 'feature1', excludeKeys: ['auth.loading', 'message'] }],
    storage: window.localStorage
  })(reducer);
}
```

### Sync conditionally

Sync state to storage based on a condition.

```ts
const state: IState = {
  checkMe: true, // <---
  feature1: {
    rememberMe: false, // <--- 
    auth: {
      loading: false,
      message: 'hello'
    },
  },
};

export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [
      {
        stateKey: 'feature1',
        shouldSync: (feature1: unknown, state: IState) => {
          return feature1.rememberMe || state.checkMe;
        },
      },
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Serialize state

Override the default serializer for the feature state.

```ts
export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [
      {
        stateKey: 'feature1',
        serialize: (feature1: unknown) => JSON.stringify(feature1),
      },
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Deserialize state

Override the default deserializer for the feature state.

```ts
export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [
      {
        stateKey: 'feature1',
        deserialize: (feature1: string) => JSON.parse(feature1),
      },
    ],
    storage: window.localStorage
  })(reducer);
}
```

### Serialize storage key

Override the default storage key serializer.

```ts
export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [{ stateKey: 'feature1' }],
    storageKeySerializer: (key: string) => `abc_${key}`,
    storage: window.localStorage
  })(reducer);
}
```

### Merge rehydrated state

Override the default rehydrated state merger.

```ts
export function storageSyncReducer(reducer: ActionReducer<IState>) {
  return storageSync<IState>({
    features: [{ stateKey: 'feature1' }],
    rehydrateStateMerger: (state: IState, rehydratedState: IState) => {
      return { ...state, ...rehydratedState };
    },
    storage: window.localStorage
  })(reducer);
}
```

### Get the form value anywhere in your app

```ts
import { Component } from '@angular/core';
import { getFormSyncValue } from '@larscom/ngrx-store-storagesync';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-my-component',
  template: `
    <div>
      <h1>My Form Value</h1>
      {{ myFormValue$ | async | json }}
    </div>
  `,
  styleUrls: ['my-component.component.scss'],
})
export class MyComponent {
  constructor(private store: Store<IState>) {}

  myFormValue$ = this.store.pipe(select(getFormSyncValue, { id: 'myFormGroupId' }));
}
```

### Update the form via the action dispatcher

```ts
import { Component } from '@angular/core';
import { setForm, patchForm, resetForm, deleteForm } from '@larscom/ngrx-store-storagesync';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-my-component',
  templateUrl: 'my-component.component.html'
  styleUrls: ['my-component.component.scss']
})
export class MyComponent {
  constructor(private store: Store<IState>) {}

  /* patch form value, lastName can be omitted */
  patchValue(): void {
    const value = {
      firstName: 'Jan'
      //lastName: 'Jansen'
    };
    this.store.dispatch(patchForm({ id: 'myFormGroupId', value }));
  }

  /* sets the initial form value */
  setValue(): void {
    const value = {
      firstName: 'Jan',
      lastName: 'Jansen'
    };
    this.store.dispatch(setForm({ id: 'myFormGroupId', value }));
  }

  /* reset form value (sets every property to null)  */
  resetValue(): void {
    this.store.dispatch(resetForm({ id: 'myFormGroupId' }));
  }

    /* remove form value from store  */
  deleteValue(): void {
    this.store.dispatch(deleteForm({ id: 'myFormGroupId' }));
  }
}
```

## Deserializing

By default the state gets deserialized and parsed by `JSON.parse` with an ISO date reviver.
This means that your ISO date objects gets stored as `string`, and restored as `Date`

If you do not want this behaviour, you can implement your own `deserialize` function.
