import { Check, X } from 'lucide-react';
import { cn } from '../../utils';

interface ValidationIconProps {
  isValid?: boolean;
  show?: boolean;
  className?: string;
}

export function ValidationIcon({ isValid, show, className }: ValidationIconProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2",
        "transition-all duration-300",
        className
      )}
    >
      {isValid ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
}