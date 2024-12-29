import { forwardRef } from 'react';
import { Input } from '../common/InputField';
import { Label } from '../ui/label';
import { ValidationIcon } from './ValidationIcon';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showValidation?: boolean;
  isValid?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, showValidation, isValid, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id}>{label}</Label>
        <div className="relative">
        <Input
                    label={''} ref={ref}
                    {...props}
                    className={error ? 'border-red-500' : ''}/>
          <ValidationIcon show={showValidation} isValid={isValid} />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);