"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Navigation, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chime } from '@/utils/audio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AE86Dashboard = () => {
  const { speed, isActive, isChiming, error, startTracking, stopTracking } = useSpeedTracker(105, 100);
  const [model, setModel] = useState("SPRINTER TRUENO AE86");
  const [isMuted, setIsMuted] = useState(chime.getMuteStatus());

  // Auto-start on mount
  useEffect(() => {
    startTracking();
  }, []);

  const handleToggleMute = () => {
    const newMuteStatus = chime.toggleMute();
    setIsMuted(newMuteStatus);
  };

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
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleMute}
            className="text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>

        {/* Main Speed Display */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {error && !isActive && (
            <div className="absolute top-0 text-[10px] text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
              GPS: {error}
            </div>
          )}
          
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-orange-500/30 uppercase tracking-[0.5em]">
            Velocity
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-8xl font-black tracking-tighter transition-all duration-200",
              isChiming ? "text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" : "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            )}>
              {speed.toString().padStart(3, '0')}
            </span>
            <span className="text-xl font-bold text-zinc-500">km/h</span>
          </div>

          {/* Speed Warning Indicator */}
          {isChiming && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-orange-500 animate-bounce">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold tracking-widest">SPEED LIMIT EXCEEDED</span>
              </div>
              <span className="text-[8px] text-orange-500/50 uppercase">Hysteresis Active: Off at 100km/h</span>
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
            <span className="text-[8px] text-zinc-600 uppercase mb-1">Model</span>
            <span className="text-[10px] font-bold text-zinc-400 truncate w-full text-center">{model.split(' ')[0]}</span>
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
      <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
        <div className="space-y-2">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest ml-1">Select Vehicle</label>
          <Select onValueChange={setModel} defaultValue={model}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 h-12 rounded-xl focus:ring-orange-500/50">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
              <SelectItem value="SPRINTER TRUENO AE86">AE86 TRUENO</SelectItem>
              <SelectItem value="PEUGEOT 208">PEUGEOT 208</SelectItem>
              <SelectItem value="VOLKSWAGEN SHARAN">VW SHARAN</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          Auto-start active. Chime triggers at 105km/h and stops at 100km/h.
        </p>
      </div>
    </div>
  );
};

export default AE86Dashboard;