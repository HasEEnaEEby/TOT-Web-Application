import { useEffect, useState } from "react";

const SakuraPetals = () => {
  const [petals, setPetals] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPetals((prev) => [...prev, Date.now()]);
      setTimeout(() => {
        setPetals((prev) => prev.slice(1));
      }, 5000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((id) => (
        <div
          key={id}
          className="absolute w-6 h-6 text-pink-400 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 3}s`,
            animationDelay: `${Math.random()}s`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};

export default SakuraPetals;
