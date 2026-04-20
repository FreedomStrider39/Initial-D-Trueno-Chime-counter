"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface WarningLightsProps {
  isChiming: boolean;
  hasError: boolean;
}

const WarningLights = ({ isChiming, hasError }: WarningLightsProps) => {
  const lights = [
    { 
      id: 'speed', 
      label: 'SPEED', 
      active: isChiming, 
      color: 'text-orange-500', 
      bg: 'bg-orange-950/40',
      border: 'border-orange-500/50',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]'
    },
    { 
      id: 'gps', 
      label: 'GPS ERR', 
      active: hasError, 
      color: 'text-red-500', 
      bg: 'bg-red-950/40',
      border: 'border-red-500/50',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]'
    },
    { 
      id: 'batt', 
      label: 'BATT', 
      active: false, 
      color: 'text-red-500', 
      bg: 'bg-red-950/40',
      border: 'border-red-500/50',
      glow: ''
    },
    { 
      id: 'fluid', 
      label: 'FLUID', 
      active: false, 
      color: 'text-orange-500', 
      bg: 'bg-orange-950/40',
      border: 'border-orange-500/50',
      glow: ''
    },
    { 
      id: 'brake', 
      label: 'BRAKE', 
      active: false, 
      color: 'text-red-500', 
      bg: 'bg-red-950/40',
      border: 'border-red-500/50',
      glow: ''
    },
  ];

  return (
    <div className="flex flex-col gap-1 w-20 h-full">
      {lights.map((light) => (
        <div
          key={light.id}
          className={cn(
            "flex-1 flex items-center justify-center border rounded-sm transition-all duration-300",
            light.active 
              ? `${light.bg} ${light.border} ${light.glow}` 
              : "bg-zinc-950 border-zinc-900"
          )}
        >
          <span className={cn(
            "text-[8px] font-black tracking-widest italic transition-all duration-300",
            light.active ? light.color : "text-zinc-900"
          )}>
            {light.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WarningLights;