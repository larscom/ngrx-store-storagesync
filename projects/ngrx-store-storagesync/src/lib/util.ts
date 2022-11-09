export const isObjectLike = (value: any): boolean => typeof value === 'object' && value !== null;

export const isPlainObject = (value: any) => value?.constructor === Object;

export const isPlainObjectAndEmpty = (value: any): boolean => isPlainObject(value) && Object.keys(value).length === 0;
