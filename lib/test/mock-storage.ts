export class MockStorage implements Storage {
  public get length(): number {
    return Object.keys(this).length;
  }

  public clear(): void {
    throw Error('Not Implemented');
  }

  public getItem(key: string): string | null {
    return this[key] ? this[key] : null;
  }

  public key(index: number): string | null {
    throw Error('Not Implemented');
  }

  public removeItem(key: string): void {
    this[key] = undefined;
  }

  public setItem(key: string, data: string): void {
    this[key] = data;
  }

  [key: string]: any;
  [index: number]: string;
}
