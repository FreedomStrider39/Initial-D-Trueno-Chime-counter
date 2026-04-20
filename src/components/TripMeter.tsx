"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface TripMeterProps {
  distance: number;
}

const TripMeter = ({ distance }: TripMeterProps) => {
  // Format distance to 1 decimal place and pad with leading zeros (e.g., 0004.2)
  const formatted = distance.toFixed(1).padStart(6, '0');
  const digits = formatted.split(''); // ['0', '0', '0', '4', '.', '2']

  return (
    <div className="flex flex-col">
      <div className="text-[7px] text-zinc-700 font-black uppercase tracking-[0.2em] mb-1.5">Trip Odometer</div>
      <div className="flex items-center gap-[1px] bg-zinc-900 p-[2px] rounded-sm border border-zinc-800 shadow-inner">
        {digits.map((digit, i) => {
          if (digit === '.') return null;
          
          const isTenths = i === digits.length - 1;
          
          return (
            <div 
              key={i}
              className={cn(
                "relative w-5 h-7 flex items-center justify-center overflow-hidden rounded-[1px]",
                isTenths 
                  ? "bg-zinc-100 text-zinc-950" 
                  : "bg-zinc-950 text-zinc-200"
              )}
            >
              {/* Subtle vertical gradient to simulate drum curvature */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10" />
              
              <span className="text-lg font-black tabular-nums leading-none mt-[1px]">
                {digit}
              </span>
              
              {/* Mechanical seam */}
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-zinc-800/50" />
            </div>
          );
        })}
        <div className="ml-1 text-[8px] font-black text-zinc-600 italic self-end mb-1">KM</div>
      </div>
    </div>
  );
};

export default TripMeter;