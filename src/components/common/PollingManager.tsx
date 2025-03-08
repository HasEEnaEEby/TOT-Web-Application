// src/components/common/PollingManager.tsx
import { RefreshCw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface PollingManagerProps {
  isRealTime: boolean;
  onPoll: () => void;
  interval?: number; // in milliseconds
  children?: React.ReactNode;
  loading?: boolean;
  showRefreshButton?: boolean;
  showCountdown?: boolean;
}

/**
 * Polling Manager Component
 *
 * This component manages automatic polling when real-time updates aren't available.
 * It will automatically poll at the specified interval when isRealTime is false.
 */
const PollingManager: React.FC<PollingManagerProps> = ({
  isRealTime,
  onPoll,
  interval = 15000, // Default to 15 seconds
  children,
  loading = false,
  showRefreshButton = true,
  showCountdown = true,
}) => {
  const [timeUntilNextPoll, setTimeUntilNextPoll] = useState<number>(
    interval / 1000
  );
  const timerRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  // Setup polling when not in real-time mode
  useEffect(() => {
    // Clear any existing intervals
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // If in real-time mode, don't poll
    if (isRealTime) {
      setTimeUntilNextPoll(interval / 1000);
      return;
    }

    // Start the polling interval
    pollIntervalRef.current = window.setInterval(() => {
      console.log("🔄 Auto-polling triggered");
      onPoll();
      setTimeUntilNextPoll(interval / 1000);
    }, interval);

    // Start the countdown timer
    timerRef.current = window.setInterval(() => {
      setTimeUntilNextPoll((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Initial poll
    onPoll();

    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRealTime, interval, onPoll]);

  return (
    <>
      {!isRealTime && showRefreshButton && (
        <div className="flex items-center justify-end text-sm text-gray-500 mb-2">
          <button
            onClick={() => {
              onPoll();
              setTimeUntilNextPoll(interval / 1000);
            }}
            className="flex items-center mx-2 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-1 ${
                loading ? "animate-spin text-gray-400" : "text-gray-600"
              }`}
            />
            <span>Refresh now</span>
          </button>

          {showCountdown && (
            <span className="text-gray-400">
              Auto-refresh in {timeUntilNextPoll}s
            </span>
          )}
        </div>
      )}
      {children}
    </>
  );
};

export default PollingManager;
