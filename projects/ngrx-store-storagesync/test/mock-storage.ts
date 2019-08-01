export class MockStorage implements Storage {
  public get length(): number {
    return Object.keys(this).length;
  }

  public clear(): void {
    for (const key of Object.keys(this)) {
      delete this[key];
    }
  }

  public getItem(key: string): string {
    return this[key] || null;
  }

  public key(index: number): string {
    return Object.keys(this)[index];
  }

  public removeItem(key: string): void {
    delete this[key];
  }

  public setItem(key: string, data: string): void {
    this[key] = data;
  }
}
