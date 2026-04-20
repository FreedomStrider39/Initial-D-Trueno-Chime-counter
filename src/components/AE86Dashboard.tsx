"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Volume2, VolumeX, Power, Beaker, Zap, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chime } from '@/utils/audio';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AE86Dashboard = () => {
  const { speed: gpsSpeed, coords, isActive, isChiming: gpsIsChiming, error, tripDistance, startTracking, stopTracking } = useSpeedTracker(100, 95);
  const { temp } = useWeather(coords?.latitude, coords?.longitude);
  
  const [model, setModel] = useState("PEUGEOT 208");
  const [isMuted, setIsMuted] = useState(chime.getMuteStatus());
  const [isEcoMode, setIsEcoMode] = useState(false);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState(0);
  const [simIsChiming, setSimIsChiming] = useState(false);

  const handleToggleMute = () => {
    const newMuteStatus = chime.toggleMute();
    setIsMuted(newMuteStatus);
  };

  // Simulation Logic
  useEffect(() => {
    if (!isSimulating) {
      if (simIsChiming) {
        chime.stop();
        setSimIsChiming(false);
      }
      return;
    }

    if (simSpeed >= 100) {
      if (!simIsChiming) {
        chime.start();
        setSimIsChiming(true);
      }
    } else if (simSpeed < 95) {
      if (simIsChiming) {
        chime.stop();
        setSimIsChiming(false);
      }
    }
  }, [simSpeed, isSimulating, simIsChiming]);

  const displaySpeed = isSimulating ? simSpeed : gpsSpeed;
  const isChiming = isSimulating ? simIsChiming : gpsIsChiming;

  // Calculate Speed Arc Percent (0-140 km/h range)
  const speedPercent = Math.min((displaySpeed / 140) * 100, 100);

  // Helper to generate graduation ticks (Restored to previous "perfect" size)
  const renderTicks = () => {
    const ticks = [];
    const totalTicks = 28;
    const radius = 110;
    const innerRadius = 102;
    const centerX = 160;
    const centerY = 140;

    for (let i = 0; i <= totalTicks; i++) {
      const angle = Math.PI + (i / totalTicks) * Math.PI;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * innerRadius;
      const y2 = centerY + Math.sin(angle) * innerRadius;
      
      const isMajor = i % 4 === 0;

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isMajor ? "#555" : "#222"}
          strokeWidth={isMajor ? "2" : "1"}
        />
      );
    }
    return ticks;
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-screen w-full transition-colors duration-1000 p-2 font-mono overflow-hidden",
      isEcoMode ? "bg-black" : "bg-zinc-950"
    )}>
      {/* Compact Cluster Frame */}
      <div className={cn(
        "relative w-full max-w-md border-4 border-zinc-900 rounded-sm overflow-hidden flex flex-col p-3 transition-all duration-500 h-full max-h-[600px]",
        isEcoMode ? "bg-black" : "bg-[#050505] shadow-[inset_0_0_40px_rgba(0,0,0,1)]"
      )}>
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_3px] opacity-20" />
        
        {/* Main Display Area */}
        <div className="relative flex-1 flex flex-col justify-between">
          
          {/* Top: Speed Arc (Restored Size) */}
          <div className="relative w-full h-44 flex flex-col items-center justify-center mt-2">
            <svg width="320" height="160" viewBox="0 0 320 160" className="absolute top-0 overflow-visible">
              {renderTicks()}
              <path 
                d="M 50 140 A 110 110 0 0 1 270 140" 
                fill="none" 
                stroke="#111" 
                strokeWidth="12" 
                strokeLinecap="butt"
              />
              <path 
                d="M 50 140 A 110 110 0 0 1 270 140" 
                fill="none" 
                stroke={isChiming ? "#ea580c" : "#10b981"} 
                strokeWidth="12" 
                strokeLinecap="butt"
                strokeDasharray="345"
                strokeDashoffset={345 - (speedPercent * 3.45)}
                className="transition-all duration-200 ease-out"
                style={{ filter: isChiming ? 'drop-shadow(0 0 10px #ea580c)' : 'drop-shadow(0 0 10px #10b981)' }}
              />
            </svg>

            {/* Speed Readout - Centered */}
            <div className="flex flex-col items-center z-30 mt-4">
              <div className="flex items-baseline">
                <span className={cn(
                  "text-7xl font-black tracking-tighter transition-all duration-100 tabular-nums leading-none",
                  isChiming ? "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" : "text-[#10b981] drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                )}>
                  {displaySpeed}
                </span>
                <span className="text-[10px] font-black text-zinc-800 ml-1 italic uppercase">km/h</span>
              </div>
            </div>
          </div>

          {/* Middle: Info Row (Compact) */}
          <div className="flex justify-between items-end px-4 -mt-2">
            {/* Left: Temp & Trip (AE86 Style) */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span className="text-[7px] text-zinc-700 font-black uppercase tracking-widest">TEMP</span>
                <span className="text-xl font-black text-[#10b981]/80 tabular-nums italic leading-none">
                  {temp !== null ? `${temp}°C` : '--°C'}
                </span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[7px] text-zinc-700 font-black uppercase tracking-widest">TRIP</span>
                <span className="text-xl font-black text-zinc-400 tabular-nums italic leading-none">
                  {tripDistance.toFixed(1)}<span className="text-[8px] ml-0.5">km</span>
                </span>
              </div>
            </div>

            {/* Right: System Icons (Retro Style) */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[7px] text-zinc-700 font-black uppercase tracking-widest">SYSTEM</span>
              <div className="flex gap-3">
                <div className={cn("transition-colors", error ? "text-orange-600" : "text-zinc-900")}>
                  <WifiOff size={18} />
                </div>
                <div className={cn("transition-colors", isChiming ? "text-orange-600 animate-pulse" : "text-zinc-900")}>
                  <AlertTriangle size={18} />
                </div>
                <div className="text-zinc-900">
                  <Zap size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Controls */}
          <div className="mt-4 border-t border-zinc-900/50 pt-4 pb-2">
            {isSimulating ? (
              <div className="space-y-3 bg-zinc-900/20 p-3 rounded-sm">
                <div className="flex justify-between items-center">
                  <label className="text-[8px] text-zinc-600 uppercase tracking-widest font-black">SIM SPEED</label>
                  <span className="text-lg font-black text-[#10b981] tabular-nums">{simSpeed}</span>
                </div>
                <Slider 
                  value={[simSpeed]} 
                  onValueChange={(val) => setSimSpeed(val[0])} 
                  max={140} 
                  step={1}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsSimulating(false)}
                  className="w-full border-zinc-800 text-zinc-600 text-[8px] uppercase tracking-widest font-black h-8"
                >
                  EXIT SIM
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <button
                    onClick={isActive ? stopTracking : startTracking}
                    className={cn(
                      "group relative w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 bg-[#111] shadow-lg",
                      isActive 
                        ? "border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.3)]" 
                        : "border-zinc-800"
                    )}
                  >
                    <Power size={24} className={cn("mb-0.5 transition-colors", isActive ? "text-orange-500" : "text-zinc-700")} />
                    <span className={cn(
                      "text-[6px] font-black uppercase transition-colors",
                      isActive ? "text-orange-500" : "text-zinc-700"
                    )}>
                      IGNITION
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select onValueChange={setModel} defaultValue={model}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-900 text-zinc-600 h-10 rounded-sm text-[8px] uppercase tracking-widest font-black">
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-500">
                      <SelectItem value="PEUGEOT 208">208 GT</SelectItem>
                      <SelectItem value="VOLKSWAGEN SHARAN">SHARAN</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => setIsSimulating(true)}
                      className="flex-1 h-10 bg-zinc-900/50 text-zinc-700 border border-zinc-900 rounded-sm"
                    >
                      <Beaker size={16} />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={handleToggleMute}
                      className="flex-1 h-10 bg-zinc-900/50 text-zinc-700 border border-zinc-900 rounded-sm"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Branding */}
          <div className="flex justify-between items-center px-2 pb-1">
            <div className="text-[8px] text-zinc-800 font-black tracking-widest italic">
              {model} <span className="text-zinc-900 ml-1">GT-APEX</span>
            </div>
            <div className="text-[8px] text-zinc-900 font-black tracking-widest">
              TOYOTA MOTOR CORP.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AE86Dashboard;