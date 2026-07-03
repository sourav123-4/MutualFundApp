import {
  validateInvestmentAmount,
  validateLogin,
} from '../src/utils/validation';

describe('login validation', () => {
  it('requires a valid email and password', () => {
    expect(validateLogin('not-an-email', '')).toEqual({
      email: 'Enter a valid email address',
      password: 'Password is required',
    });
  });

  it('accepts any valid email with a non-empty password', () => {
    expect(validateLogin('person@example.com', 'any-password')).toEqual({});
  });
});

describe('investment validation', () => {
  it('enforces the minimum amount', () => {
    expect(validateInvestmentAmount('99')).toBe(
      'Minimum investment is Rs. 100',
    );
    expect(validateInvestmentAmount('100')).toBeUndefined();
  });
});
