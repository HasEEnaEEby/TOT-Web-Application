interface LoadingIndicatorProps {
    theme: 'ramen' | 'sushi' | 'tea';
  }
  
  export function LoadingIndicator({ theme }: LoadingIndicatorProps) {
    return (
      <div className="relative w-12 h-12">
        {theme === 'ramen' && (
          <>
            <div className="absolute inset-0 rounded-full bg-amber-100">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/80 animate-steam"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </>
        )}
        {/* Add more themed loading indicators here */}
      </div>
    );
  }