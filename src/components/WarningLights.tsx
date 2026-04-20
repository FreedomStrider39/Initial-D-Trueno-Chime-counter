"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface WarningLightsProps {
  isChiming: boolean;
  hasError: boolean;
  isActive: boolean;
  isMuted: boolean;
}

const WarningLights = ({ isChiming, hasError, isActive, isMuted }: WarningLightsProps) => {
  const indicators = [
    { 
      id: 'speed', 
      label: 'SPEED',
      active: isChiming, 
      color: 'text-orange-500', 
      glow: 'drop-shadow(0 0 8px rgba(249,115,22,0.8))',
    },
    { 
      id: 'gps', 
      label: 'GPS ERR',
      active: hasError, 
      color: 'text-red-600', 
      glow: 'drop-shadow(0 0 8px rgba(220,38,38,0.8))',
    },
    { 
      id: 'ign', 
      label: 'IGNITION',
      active: isActive, 
      color: 'text-green-500', 
      glow: 'drop-shadow(0 0 8px rgba(34,197,94,0.8))',
    },
    { 
      id: 'mute', 
      label: 'MUTE',
      active: isMuted, 
      color: 'text-amber-500', 
      glow: 'drop-shadow(0 0 8px rgba(245,158,11,0.8))',
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950/90 border-2 border-zinc-900 rounded-sm overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
      {indicators.map((ind) => (
        <div
          key={ind.id}
          className={cn(
            "flex-1 flex items-center justify-center border-b border-zinc-900/50 last:border-0 transition-all duration-200",
            ind.active ? "bg-zinc-900/20" : "bg-transparent"
          )}
        >
          <span 
            className={cn(
              "text-[9px] font-black tracking-[0.2em] italic select-none transition-all duration-300",
              ind.active ? ind.color : "text-zinc-900/40",
            )}
            style={{ 
              textShadow: ind.active ? `0 0 12px currentColor` : 'none',
              filter: ind.active ? ind.glow : 'none'
            }}
          >
            {ind.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WarningLights;