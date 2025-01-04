import { Background } from '../../components/common/Background';
import {ThemeToggle } from '../../components/common/ThemeToggle';
import { cn } from '../../utils';
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <ThemeToggle/>
      <div className={cn(
        "relative min-h-screen flex flex-col items-center justify-center p-8",
        "bg-background/80 backdrop-blur-sm text-foreground"
      )}>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}