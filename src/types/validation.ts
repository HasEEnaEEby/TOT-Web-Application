// src/types/validation.ts
export interface ValidationResult {
    isValid: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
  }
  
  export type ValidatorFn<T> = (value: T) => ValidationResult;
  
  export type ValidationSchema<T> = {
    [K in keyof T]?: {
      validators: ValidatorFn<T[K]>[];
      required?: boolean;
      message?: string;
    };
  };
  
  export interface ValidationOptions {
    stopOnFirst?: boolean; 
    validateAllFields?: boolean;
    customMessages?: Record<string, string>; 
  }
  
  export interface FormState<T> {
    data: T;
    errors: Record<keyof T, string | undefined>;
    touched: Record<keyof T, boolean>;
    isValid: boolean;
    isSubmitting: boolean;
  }