import { isPlainObject } from 'lodash';

export const isNotPlainObject = (value: any) => !isPlainObject(value);

export const isPlainObjectAndEmpty = (value: any): boolean => isPlainObject(value) && Object.keys(value).length === 0;
export const isPlainObjectAndNotEmpty = (value: any): boolean => !isPlainObjectAndEmpty(value);
