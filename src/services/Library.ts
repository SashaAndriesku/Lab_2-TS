export class Library<T extends { id: string }> {
  private items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = initialItems;
  }

  add(item: T): void {
    this.items.push(item);
  }

  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}