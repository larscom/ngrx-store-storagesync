import { IStorageSyncOptions } from './storage-sync-options'
import { clone } from 'ramda'
import { isObjectLike, isPlainObject, isPlainObjectAndEmpty } from './util'

/**
 * @internal Remove empty objects
 */
const removeEmptyObjects = (object: any): any => {
  for (const key in object) {
    if (!isPlainObject(object[key])) {
      continue
    }

    if (!isPlainObjectAndEmpty(object[key])) {
      removeEmptyObjects(object[key])
    }

    if (isPlainObjectAndEmpty(object[key])) {
      delete object[key]
    }
  }

  return object
}

/**
 * @internal Exclude properties from featureState
 */
const excludePropsFromState = <T>(featureState: T[keyof T], excludeKeys?: string[]): T[keyof T] => {
  if (!excludeKeys || !excludeKeys.length) {
    return featureState
  }

  const keyPairs = excludeKeys.map((key) => ({
    leftKey: key.split('.')[0],
    rightKey: key.split('.')[1]
  }))

  for (const key in featureState) {
    const keyPair = keyPairs.find((pair) => pair.leftKey === key)
    const leftKey = keyPair?.leftKey
    const rightKey = keyPair?.rightKey

    if (isObjectLike(featureState[key])) {
      if (leftKey && rightKey) {
        excludePropsFromState(featureState[key], [...excludeKeys, rightKey])
      } else if (leftKey) {
        delete featureState[key]
      } else {
        excludePropsFromState(featureState[key], excludeKeys)
      }
    } else if (leftKey) {
      delete featureState[key]
    }
  }

  return removeEmptyObjects(featureState)
}

/**
 * @internal Sync state with storage
 */
export const syncWithStorage = <T>(
  state: T,
  { features, storage, storageKeySerializer, storageError }: IStorageSyncOptions<T>
): void => {
  features
    .filter(({ stateKey }) => state[stateKey as keyof T] !== undefined)
    .filter(({ stateKey, shouldSync }) => (shouldSync ? shouldSync(state[stateKey as keyof T], state) : true))
    .forEach(({ stateKey, excludeKeys, storageKeySerializerForFeature, serialize, storageForFeature }) => {
      const featureStateClone = clone(state[stateKey as keyof T])
      const featureState = excludePropsFromState(featureStateClone, excludeKeys)

      if (isPlainObjectAndEmpty(featureState)) {
        return
      }

      const key = storageKeySerializerForFeature
        ? storageKeySerializerForFeature(stateKey)
        : storageKeySerializer!(stateKey)

      const value = serialize ? serialize(featureState) : JSON.stringify(featureState)

      try {
        if (storageForFeature) {
          storageForFeature.setItem(key, value)
        } else {
          storage.setItem(key, value)
        }
      } catch (e) {
        if (storageError) {
          storageError(e)
        } else {
          throw e
        }
      }
    })
}
