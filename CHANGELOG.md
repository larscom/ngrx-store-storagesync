# Changelog

All notable changes to @larscom/ngrx-store-storagesync will be documented in this file.

## [ 5.0.0 ]

### Breaking Changes

- removed **includeKeys** on interface `IFeatureOptions`. Only allowing **excludeKeys** for the moment
- removed **keepEmptyObjects** on interface `IStorageSyncOptions`, no longer needed

### Fixed

- it now properly rehydrates the state from storage and now merges with the initialState to keep initial properties. The rehydrated state will override the initialState properties.

## [ 4.0.1 ]

### Fixed

- bug with values that are `null` and not syncing properly

## [ 4.0.0 ]

### Breaking Changes

- removed **syncEmptyObjects** on interface `IStorageSyncOptions`.

### Fixed

- typings for function callbacks and overall typing

## [ 3.0.3 ]

### Added

- added JSdocs

## [ 3.0.2 ]

### Fixed

- Fixed a bug where a property of type object/array could be emptied while it shouldn't be emptied

## [ 3.0.1 ]

### Added

- added a check to see if application is running inside a browser (for SSR)

## [ 3.0.0 ]

### Breaking Changes

- **ignoreKeys** renamed to **exlcudeKeys** on interface `IFeatureOptions`

### Added

- added property 'includeKeys' to interface `IFeatureOptions`

## [ 1.0.0 - 2.0.7 ]

- pre-release phase
