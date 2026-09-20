export class Storage {
  static save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static load<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }
}