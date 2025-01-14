// src/services/validationService.ts
import { useCallback, useState } from 'react';
import { FormState, ValidationOptions, ValidationResult, ValidationSchema } from '../types/validation';

class ValidationService {
  /**
   * Validates form data against a schema
   */
  public validate<T extends Record<string, any>>(
    data: T,
    schema: ValidationSchema<T>,
    options: ValidationOptions = {}
  ): ValidationResult {
    const { stopOnFirst = false } = options;
    const fieldErrors: Record<string, string> = {};
    let isValid = true;

    for (const [field, fieldSchema] of Object.entries(schema)) {
      if (!fieldSchema) continue;

      const value = data[field];
      const { validators, required, message } = fieldSchema;

      // Handle dynamic required fields
      const isRequired = typeof required === 'function' ? required(data) : required;

      if (isRequired && (value === undefined || value === null || value === '')) {
        fieldErrors[field] = message || 'This field is required';
        isValid = false;
        if (stopOnFirst) break;
        continue;
      }

      // Skip validation for empty optional fields
      if (!isRequired && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Run all validators for the field
      for (const validator of validators) {
        const result = validator(value);
        if (!result.isValid) {
          fieldErrors[field] = result.error || 'Invalid value';
          isValid = false;
          if (stopOnFirst) break;
          break;
        }
      }

      if (!isValid && stopOnFirst) break;
    }

    return {
      isValid,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
      error: !isValid ? 'Form validation failed' : undefined
    };
  }

  /**
   * Validates a single field
   */
  public validateField<T extends Record<string, any>>(
    field: keyof T,
    value: T[keyof T],
    schema: ValidationSchema<T>
  ): string | undefined {
    const fieldSchema = schema[field];
    if (!fieldSchema) return undefined;

    const { validators, required, message } = fieldSchema;

    if (required && (value === undefined || value === null || value === '')) {
      return message || 'This field is required';
    }

    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result.error;
      }
    }

    return undefined;
  }
}

// Export a singleton instance
export const validationService = new ValidationService();

// Hook for form validation
export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  schema: ValidationSchema<T>
) {
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    errors: {} as Record<keyof T, string | undefined>,
    touched: {} as Record<keyof T, boolean>,
    isValid: true,
    isSubmitting: false
  });

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]) => 
      validationService.validateField(field, value, schema),
    [schema]
  );

  const handleChange = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      const error = validateField(field, value);
      
      setFormState(prev => ({
        ...prev,
        data: { ...prev.data, [field]: value },
        errors: { ...prev.errors, [field]: error } as Record<keyof T, string | undefined>,
        touched: { ...prev.touched, [field]: true },
        isValid: !error && Object.values({ ...prev.errors, [field]: error }).every(err => !err)
      }));
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    const result = validationService.validate(formState.data, schema);
    
    setFormState(prev => ({
      ...prev,
      errors: (result.fieldErrors || {}) as Record<keyof T, string | undefined>,
      isValid: result.isValid,
      touched: Object.keys(prev.data).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as Record<keyof T, boolean>)
    }));

    return result.isValid;
  }, [formState.data, schema]);

  return {
    formState,
    handleChange,
    validateForm,
    validateField,
    setFormState
  };
}