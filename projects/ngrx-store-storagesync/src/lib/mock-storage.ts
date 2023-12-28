export class MockStorage implements Storage {
  data = Object()

  public get length(): number {
    return Object.keys(this.data).length
  }

  public clear(): void {
    for (const key of Object.keys(this.data)) {
      delete this.data[key]
    }
  }

  public getItem(key: string): string {
    return this.data[key] || null
  }

  public key(index: number): string {
    return Object.keys(this.data)[index]
  }

  public removeItem(key: string): void {
    delete this.data[key]
  }

  public setItem(key: string, data: string): void {
    this.data[key] = data
  }
}
