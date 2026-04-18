"use client";

import React from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { Button } from '@/components/ui/button';
import { Gauge, Zap, AlertTriangle, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const AE86Dashboard = () => {
  const { speed, isActive, startTracking, stopTracking } = useSpeedTracker(105);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-6 font-mono">
      {/* Retro Dashboard Container */}
      <div className="relative w-full max-w-md aspect-[4/3] bg-zinc-900 border-4 border-zinc-800 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-8">
        
        {/* Header Info */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-orange-500/50 uppercase tracking-widest">Vehicle Status</span>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-zinc-700"
              )} />
              <span className={cn(
                "text-xs font-bold",
                isActive ? "text-green-500" : "text-zinc-600"
              )}>
                {isActive ? "SYSTEM ACTIVE" : "STANDBY"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-orange-500/50 uppercase tracking-widest">Model</span>
            <div className="text-xs font-bold text-zinc-400">SPRINTER TRUENO AE86</div>
          </div>
        </div>

        {/* Main Speed Display */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-orange-500/30 uppercase tracking-[0.5em]">
            Velocity
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-8xl font-black tracking-tighter transition-all duration-200",
              speed >= 105 ? "text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" : "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            )}>
              {speed.toString().padStart(3, '0')}
            </span>
            <span className="text-xl font-bold text-zinc-500">km/h</span>
          </div>

          {/* Speed Warning Indicator */}
          {speed >= 105 && (
            <div className="mt-4 flex items-center gap-2 text-orange-500 animate-bounce">
              <AlertTriangle size={16} />
              <span className="text-xs font-bold tracking-widest">SPEED LIMIT EXCEEDED</span>
            </div>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800/50">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase mb-1">Limit</span>
            <span className="text-sm font-bold text-orange-500/80">105</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase mb-1">Mode</span>
            <span className="text-sm font-bold text-green-500/80">TOUGE</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase mb-1">GPS</span>
            <Navigation size={12} className={cn(isActive ? "text-green-500" : "text-zinc-700")} />
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
      </div>

      {/* Controls */}
      <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
        {!isActive ? (
          <Button 
            onClick={startTracking}
            className="h-16 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 transition-all active:scale-95"
          >
            <Zap className="mr-2" /> START TAKUMI MODE
          </Button>
        ) : (
          <Button 
            onClick={stopTracking}
            variant="destructive"
            className="h-16 font-bold rounded-2xl shadow-lg shadow-red-900/20 transition-all active:scale-95"
          >
            DEACTIVATE
          </Button>
        )}
        
        <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
          Keep this app running in the background while using Waze.<br/>
          Chime will trigger automatically at 105 km/h.
        </p>
      </div>
    </div>
  );
};

export default AE86Dashboard;