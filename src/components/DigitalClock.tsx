"use client";

import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setShowColon(prev => !prev);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className="bg-zinc-950/50 p-2 border border-zinc-900 rounded-sm min-w-[80px] flex flex-col justify-between">
      <div className="text-[7px] text-zinc-700 font-black uppercase tracking-[0.2em] mb-1">Local Time</div>
      <div className="text-2xl font-black text-[#00ffcc]/70 tabular-nums italic leading-none drop-shadow-[0_0_8px_rgba(0,255,204,0.4)] flex items-center">
        <span>{hours}</span>
        <span className={showColon ? "opacity-100" : "opacity-0"}>:</span>
        <span>{minutes}</span>
      </div>
      <div className="text-[6px] text-zinc-800 font-bold mt-1 tracking-tighter">
        QUARTZ PRECISION
      </div>
    </div>
  );
};

export default DigitalClock;