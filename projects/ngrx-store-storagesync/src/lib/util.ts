export const getTag = (value: any): string =>
  value == null
    ? value === undefined
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(value);

export const isObjectLike = (value: any): boolean => typeof value === 'object' && value !== null;

export const isPlainObject = (value: any): boolean => {
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
};

export const isPlainObjectAndEmpty = (value: any): boolean => isPlainObject(value) && Object.keys(value).length === 0;
