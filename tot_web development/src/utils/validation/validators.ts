// src/utils/validation/validators.ts
import { ValidationResult, ValidatorFn } from '../../types/validation';

const createValidationResult = (isValid: boolean, error?: string): ValidationResult => ({
  isValid,
  error
});

// Core validators
export const required = (message = 'This field is required'): ValidatorFn<any> => 
  (value: any): ValidationResult => ({
    isValid: value !== undefined && value !== null && value !== '',
    error: value !== undefined && value !== null && value !== '' ? undefined : message
  });

export const minLength = (min: number, message?: string): ValidatorFn<string> =>
  (value: string): ValidationResult => ({
    isValid: value.length >= min,
    error: value.length >= min ? undefined : message ?? `Minimum length is ${min} characters`
  });

export const maxLength = (max: number, message?: string): ValidatorFn<string> =>
  (value: string): ValidationResult => ({
    isValid: value.length <= max,
    error: value.length <= max ? undefined : message ?? `Maximum length is ${max} characters`
  });

export const pattern = (regex: RegExp, message: string): ValidatorFn<string> =>
  (value: string): ValidationResult => ({
    isValid: regex.test(value),
    error: regex.test(value) ? undefined : message
  });

export const email = (message = 'Invalid email address'): ValidatorFn<string> =>
  pattern(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message
  );

export const password = (message?: string): ValidatorFn<string> =>
  (value: string): ValidationResult => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasMinLength = value.length >= 8;

    const isValid = hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;

    return {
      isValid,
      error: isValid ? undefined : message ?? 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers'
    };
  };

export const match = (matchField: string, message?: string): ValidatorFn<any> =>
  (value: any, formValues?: Record<string, any>): ValidationResult => ({
    isValid: formValues ? value === formValues[matchField] : true,
    error: formValues && value !== formValues[matchField] 
      ? message ?? `Must match ${matchField}`
      : undefined
  });

// Custom validators for specific types
export const phoneNumber = (message = 'Invalid phone number'): ValidatorFn<string> =>
  pattern(
    /^\+?[\d\s-]{10,}$/,
    message
  );

export const url = (message = 'Invalid URL'): ValidatorFn<string> =>
  pattern(
    /^https?:\/\/.+\..+/,
    message
  );

// Composition helper
export const compose = <T>(...validators: ValidatorFn<T>[]): ValidatorFn<T> =>
  (value: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };