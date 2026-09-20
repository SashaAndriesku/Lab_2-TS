import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Namespace Tests', () => {
  it('повинен правильно валідувати email', () => {
    expect(Validation.isValidEmail('user@domain.com')).to.be.true;
    expect(Validation.isValidEmail('invalid-email')).to.be.false;
  });

  it('повинен правильно валідувати рік видання', () => {
    expect(Validation.isValidYear('2020')).to.be.true;
    expect(Validation.isValidYear('999')).to.be.false;
    expect(Validation.isValidYear('abc')).to.be.false;
  });
});