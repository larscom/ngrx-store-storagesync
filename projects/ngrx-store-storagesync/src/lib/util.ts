import isPlainObject from 'lodash/isPlainObject';

export const isNotPlainObject = (value: any) => !isPlainObject(value);

export const isPlainObjectAndEmpty = (value: any): boolean => isPlainObject(value) && Object.keys(value).length === 0;
