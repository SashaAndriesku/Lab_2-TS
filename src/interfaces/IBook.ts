export interface IBook {
  id: string;
  title: string;
  author: string;
  year: number;
  isBorrowed: boolean;
  borrowedBy?: string;
}