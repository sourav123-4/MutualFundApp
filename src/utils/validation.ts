const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginErrors = {
  email?: string;
  password?: string;
};

export const validateLogin = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateInvestmentAmount = (amount: string) => {
  if (!amount.trim()) {
    return 'Enter an investment amount';
  }

  const value = Number(amount);
  if (!Number.isFinite(value) || value < 100) {
    return 'Minimum investment is Rs. 100';
  }

  return undefined;
};
