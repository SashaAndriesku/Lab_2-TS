import { IUser } from '../interfaces/IUser';

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public borrowedBookIds: string[] = []
  ) {}

  canBorrow(): boolean {
    return this.borrowedBookIds.length < 3;
  }

  addBook(bookId: string): void {
    if (this.canBorrow()) {
      this.borrowedBookIds.push(bookId);
    }
  }

  removeBook(bookId: string): void {
    this.borrowedBookIds = this.borrowedBookIds.filter((id) => id !== bookId);
  }
}