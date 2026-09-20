import { expect } from 'chai';
import { Library } from '../src/services/Library';

interface TestItem {
  id: string;
  title: string;
}

describe('Library Generic Class Tests', () => {
  let library: Library<TestItem>;

  beforeEach(() => {
    library = new Library<TestItem>();
  });

  it('повинен успішно додавати елементи', () => {
    library.add({ id: '1', title: 'Тестова книга' });
    expect(library.getAll()).to.have.lengthOf(1);
  });

  it('повинен знаходити елемент за ID', () => {
    library.add({ id: '10', title: 'Унікальна книга' });
    const item = library.findById('10');
    expect(item).to.not.be.undefined;
    expect(item?.title).to.equal('Унікальна книга');
  });

  it('повинен успішно видаляти елемент за ID', () => {
    library.add({ id: '5', title: 'Книга на видалення' });
    const isRemoved = library.remove('5');
    expect(isRemoved).to.be.true;
    expect(library.getAll()).to.have.lengthOf(0);
  });
});