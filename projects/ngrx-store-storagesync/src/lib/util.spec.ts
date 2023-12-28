import { isObjectLike, isPlainObject, isPlainObjectAndEmpty } from './util'

describe('Util', () => {
  class Foo {}

  it('should detect plain objects', () => {
    expect(isPlainObject({})).toBeTruthy()
    expect(isPlainObject({ a: 1 })).toBeTruthy()

    expect(isPlainObject(new Foo())).toBeFalsy()
    expect(isPlainObject([1, 2, 3])).toBeFalsy()
    expect(isPlainObject(1)).toBeFalsy()
    expect(isPlainObject(true)).toBeFalsy()
    expect(isPlainObject('value')).toBeFalsy()
    expect(isPlainObject(null)).toBeFalsy()
    expect(isPlainObject(undefined)).toBeFalsy()
  })

  it('should detect object like', () => {
    expect(isObjectLike({})).toBeTruthy()
    expect(isObjectLike({ a: 1 })).toBeTruthy()
    expect(isObjectLike(new Foo())).toBeTruthy()
    expect(isObjectLike([1, 2, 3])).toBeTruthy()

    expect(isObjectLike(1)).toBeFalsy()
    expect(isObjectLike(true)).toBeFalsy()
    expect(isObjectLike('value')).toBeFalsy()
    expect(isObjectLike(null)).toBeFalsy()
    expect(isObjectLike(undefined)).toBeFalsy()
  })

  it('should detect plain object and empty', () => {
    expect(isPlainObjectAndEmpty({})).toBeTruthy()

    expect(isPlainObjectAndEmpty(new Foo())).toBeFalsy()
    expect(isPlainObjectAndEmpty({ a: 1 })).toBeFalsy()
    expect(isPlainObjectAndEmpty(null)).toBeFalsy()
    expect(isPlainObjectAndEmpty(undefined)).toBeFalsy()
    expect(isPlainObjectAndEmpty([])).toBeFalsy()
  })
})
