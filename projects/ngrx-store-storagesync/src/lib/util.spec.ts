import { isObjectLike, isPlainObject, isPlainObjectAndEmpty } from './util';

describe('Util', () => {
  class Foo {}

  it('should detect plain objects', () => {
    expect(isPlainObject({})).toBeTrue();
    expect(isPlainObject({ a: 1 })).toBeTrue();
    expect(isPlainObject({ constructor: Foo })).toBeTrue();

    expect(isPlainObject(new Foo())).toBeFalse();
    expect(isPlainObject([1, 2, 3])).toBeFalse();
    expect(isPlainObject(1)).toBeFalse();
    expect(isPlainObject(true)).toBeFalse();
    expect(isPlainObject('value')).toBeFalse();
    expect(isPlainObject(null)).toBeFalse();
    expect(isPlainObject(undefined)).toBeFalse();
  });

  it('should detect object like', () => {
    expect(isObjectLike({})).toBeTrue();
    expect(isObjectLike({ a: 1 })).toBeTrue();
    expect(isObjectLike({ constructor: Foo })).toBeTrue();
    expect(isObjectLike(new Foo())).toBeTrue();
    expect(isObjectLike([1, 2, 3])).toBeTrue();

    expect(isObjectLike(1)).toBeFalse();
    expect(isObjectLike(true)).toBeFalse();
    expect(isObjectLike('value')).toBeFalse();
    expect(isObjectLike(null)).toBeFalse();
    expect(isObjectLike(undefined)).toBeFalse();
  });

  it('should detect plain object and empty', () => {
    expect(isPlainObjectAndEmpty({})).toBeTrue();

    expect(isPlainObjectAndEmpty(new Foo())).toBeFalse();
    expect(isPlainObjectAndEmpty({ a: 1 })).toBeFalse();
    expect(isPlainObjectAndEmpty(null)).toBeFalse();
    expect(isPlainObjectAndEmpty(undefined)).toBeFalse();
    expect(isPlainObjectAndEmpty([])).toBeFalse();
  });
});
