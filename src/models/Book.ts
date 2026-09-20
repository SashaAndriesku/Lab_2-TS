import { IBook } from '../interfaces/IBook';

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed: boolean = false,
    public borrowedBy?: string
  ) {}

  borrow(userId: string): void {
    this.isBorrowed = true;
    this.borrowedBy = userId;
  }

  returnBook(): void {
    this.isBorrowed = false;
    this.borrowedBy = undefined;
  }
}