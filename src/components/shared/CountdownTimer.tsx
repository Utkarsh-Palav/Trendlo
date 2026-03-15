"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  minutes?: number;
  className?: string;
}

export function CountdownTimer({ minutes = 45, className }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(minutes * 60);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const hrs = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-[#111827] px-4 py-1.5 text-xs font-medium text-white ${className ?? ""}`}
    >
      <span>⏰ Offer ends in:</span>
      <span className="font-mono text-brand">
        {hrs}:{mins}:{secs}
      </span>
    </div>
  );
}

