
export default function Confetti() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-full h-full">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#FF5733', '#C70039', '#FFD700'][Math.floor(Math.random() * 3)],
              width: '10px',
              height: '10px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}