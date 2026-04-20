"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface WarningLightsProps {
  isChiming: boolean;
  hasError: boolean;
}

const WarningLights = ({ isChiming, hasError }: WarningLightsProps) => {
  const indicators = [
    { 
      id: 'speed', 
      label: 'SPEED',
      active: isChiming, 
      color: 'text-orange-500', 
      glow: 'drop-shadow([0_0_8px_rgba(249,115,22,0.8)])',
      isText: true
    },
    { 
      id: 'gps', 
      label: 'GPS',
      active: hasError, 
      color: 'text-red-600', 
      glow: 'drop-shadow([0_0_8px_rgba(220,38,38,0.8)])',
      isText: true
    },
    { 
      id: 'batt', 
      label: 'BATT',
      active: false, 
      color: 'text-red-600', 
      glow: '',
      isText: true
    },
    { 
      id: 'oil', 
      label: 'OIL',
      active: false, 
      color: 'text-red-600', 
      glow: '',
      isText: true
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-4 bg-zinc-950/80 border border-zinc-900 rounded-sm shadow-inner">
      {indicators.map((ind) => (
        <div
          key={ind.id}
          className={cn(
            "flex items-center justify-center transition-all duration-150",
            ind.active ? "opacity-100" : "opacity-[0.03]"
          )}
        >
          <span 
            className={cn(
              "text-[10px] font-black tracking-[0.15em] italic select-none",
              ind.active ? ind.color : "text-white",
              ind.active && ind.glow
            )}
            style={{ 
              fontFamily: 'monospace',
              textShadow: ind.active ? `0 0 10px currentColor` : 'none'
            }}
          >
            {ind.label}
          </span>
        </div>
      ))}
      
      {/* Custom Blocky Car Icon (like the reference) */}
      <div className={cn(
        "col-span-2 flex justify-center mt-2 transition-all duration-150",
        isChiming ? "opacity-100" : "opacity-[0.03]"
      )}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={cn(
          isChiming ? "text-orange-500" : "text-white",
          isChiming && "drop-shadow([0_0_8px_rgba(249,115,22,0.8)])"
        )}>
          {/* Blocky car silhouette with open door style */}
          <path d="M6 18h12v-2h-12v2zm12-4l-2-6h-8l-2 6h12zm-10-5h8l1 3h-10l1-3z" />
          <path d="M19 14v2h2v-2h-2z" className="animate-pulse" />
        </svg>
      </div>
    </div>
  );
};

export default WarningLights;