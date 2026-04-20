"use client";

import React from 'react';
import { AlertTriangle, WifiOff, Zap, Beaker } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WarningLightsProps {
  isChiming: boolean;
  hasError: boolean;
}

const WarningLights = ({ isChiming, hasError }: WarningLightsProps) => {
  const indicators = [
    { 
      id: 'speed', 
      icon: AlertTriangle, 
      active: isChiming, 
      color: 'text-orange-500', 
      bg: 'bg-orange-950/40',
      border: 'border-orange-600/50',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.6)]'
    },
    { 
      id: 'gps', 
      icon: WifiOff, 
      active: hasError, 
      color: 'text-red-500', 
      bg: 'bg-red-950/40',
      border: 'border-red-600/50',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]'
    },
    { 
      id: 'batt', 
      icon: Zap, 
      active: false, 
      color: 'text-red-500', 
      bg: 'bg-red-950/40',
      border: 'border-red-600/50',
      glow: ''
    },
    { 
      id: 'fluid', 
      icon: Beaker, 
      active: false, 
      color: 'text-orange-500', 
      bg: 'bg-orange-950/40',
      border: 'border-orange-600/50',
      glow: ''
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-1.5 w-[84px]">
      {indicators.map((ind) => (
        <div
          key={ind.id}
          className={cn(
            "w-10 h-10 border-2 rounded-sm flex items-center justify-center transition-all duration-200",
            ind.active 
              ? `${ind.bg} ${ind.border} ${ind.glow}` 
              : "bg-zinc-950 border-zinc-900"
          )}
        >
          <ind.icon 
            size={20} 
            strokeWidth={2.5}
            className={cn(
              "transition-all duration-200",
              ind.active ? ind.color : "text-zinc-900"
            )} 
          />
        </div>
      ))}
    </div>
  );
};

export default WarningLights;