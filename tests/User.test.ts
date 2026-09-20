import { expect } from 'chai';
import { User } from '../src/models/User';

describe('User Model Tests', () => {
  it('повинен дозволяти позичати книги, якщо їх менше 3', () => {
    const user = new User('1', 'Іван', 'ivan@test.com');
    expect(user.canBorrow()).to.be.true;

    user.addBook('101');
    user.addBook('102');
    expect(user.canBorrow()).to.be.true;
  });

  it('повинен забороняти позичати більше 3 книг', () => {
    const user = new User('1', 'Іван', 'ivan@test.com', ['101', '102', '103']);
    expect(user.canBorrow()).to.be.false;

    user.addBook('104');
    expect(user.borrowedBookIds).to.have.lengthOf(3);
  });
});