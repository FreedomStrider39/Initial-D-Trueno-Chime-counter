"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface WarningLightsProps {
  isChiming: boolean;
  hasError: boolean;
  isMuted: boolean;
}

const WarningLights = ({ isChiming, hasError, isMuted }: WarningLightsProps) => {
  const indicators = [
    { 
      id: 'speed', 
      label: 'SPEED',
      active: isChiming, 
      color: 'bg-[#ff8000]', // Classic Amber/Orange
    },
    { 
      id: 'gps', 
      label: 'GPS ERR',
      active: hasError, 
      color: 'bg-[#ff8000]', 
    },
    { 
      id: 'mute', 
      label: 'MUTE',
      active: isMuted, 
      color: 'bg-[#ff8000]', 
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 border-2 border-zinc-900 rounded-sm overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)]">
      {indicators.map((ind) => (
        <div
          key={ind.id}
          className={cn(
            "flex-1 flex items-center justify-center border-b border-zinc-900/50 last:border-0 transition-all duration-150 relative",
            ind.active ? ind.color : "bg-transparent"
          )}
        >
          {/* Light bleed effect */}
          {ind.active && (
            <div className="absolute inset-0 opacity-40 blur-[2px] bg-inherit" />
          )}
          
          <span 
            className={cn(
              "text-[9px] font-black tracking-[0.2em] italic select-none transition-all duration-150 relative z-10",
              ind.active 
                ? "text-zinc-950 drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" 
                : "text-zinc-800/30"
            )}
          >
            {ind.label}
          </span>

          {/* Subtle plastic texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        </div>
      ))}
    </div>
  );
};

export default WarningLights;