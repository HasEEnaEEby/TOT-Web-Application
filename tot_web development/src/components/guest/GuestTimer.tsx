import { useEffect, useState } from 'react';
import { Progress } from "../ui/progress";

export function GuestTimer() {
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const totalTime = 3 * 60 * 60;
    setProgress((timeLeft / totalTime) * 100);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-between mb-2 text-sm">
        <span>Session Time Remaining</span>
        <span className="font-medium">{formatTime(timeLeft)}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}