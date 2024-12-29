import { useTheme } from '../../hooks/use-theme';

export function Background() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Koi Fish */}
      <div className="absolute bottom-20 left-0 w-20 h-12 animate-koi opacity-20">
        <div className="w-full h-full bg-accent-foreground/50 rounded-full" />
      </div>

      {/* Cherry Blossoms / Lanterns */}
      {theme === 'light' ? (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-rose-200 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </>
      ) : (
        <>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 rounded-full bg-amber-400/20 animate-lantern"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 1}s`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}