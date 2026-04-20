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
      id: 'batt', 
      label: 'BATT',
      active: false, 
      color: 'text-red-600', 
      glow: '',
    },
    { 
      id: 'oil', 
      label: 'OIL',
      active: false, 
      color: 'text-red-600', 
      glow: '',
    },
    { 
      id: 'door', 
      label: 'DOOR',
      active: false, 
      color: 'text-red-600', 
      glow: '',
    },
    { 
      id: 'beam', 
      label: 'BEAM',
      active: false, 
      color: 'text-blue-500', 
      glow: '',
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950/90 border-2 border-zinc-900 rounded-sm overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
      {indicators.map((ind, index) => (
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
      
      {/* Bottom Car Silhouette Section */}
      <div className="h-12 flex items-center justify-center border-t-2 border-zinc-900 bg-zinc-950">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={cn(
          "transition-all duration-300",
          isChiming ? "text-orange-500 drop-shadow(0 0 10px rgba(249,115,22,0.6))" : "text-zinc-900/40"
        )}>
          <path d="M6 18h12v-2h-12v2zm12-4l-2-6h-8l-2 6h12zm-10-5h8l1 3h-10l1-3z" />
          <path d="M19 14v2h2v-2h-2z" className={isChiming ? "animate-pulse" : ""} />
        </svg>
      </div>
    </div>
  );
};

export default WarningLights;