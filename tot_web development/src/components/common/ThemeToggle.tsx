import { useState } from 'react';
import { Button } from '../common/button';
import { cn } from '../../utils';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true); 
    toggleTheme(); 
    setTimeout(() => setIsAnimating(false), 500); 
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'absolute top-4 right-4 z-50 rounded-full overflow-hidden',
        'transition-transform duration-500',
        isAnimating && 'scale-110'
      )}
      onClick={handleToggle}
    >
      <div className="relative w-6 h-6">
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            isDark ? 'opacity-100' : 'opacity-0' 
          )}
        >
          {/* Moon icon */}
          <div className="w-full h-full rounded-full bg-amber-400" />
        </div>
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            !isDark ? 'opacity-100' : 'opacity-0' 
          )}
        >
          {/* Sun icon */}
          <div className="w-full h-full rounded-full bg-rose-500" />
        </div>
      </div>
    </Button>
  );
}
