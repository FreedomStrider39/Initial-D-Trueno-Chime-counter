"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Navigation, Volume2, VolumeX, Power, BatteryLow, Beaker } from 'lucide-react';
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
  const { speed: gpsSpeed, isActive, isChiming: gpsIsChiming, error, startTracking, stopTracking } = useSpeedTracker(100, 95);
  
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

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen transition-colors duration-1000 p-4 md:p-8 font-mono",
      isEcoMode ? "bg-black" : "bg-zinc-950"
    )}>
      {/* Retro Dashboard Container */}
      <div className={cn(
        "relative w-full max-w-lg aspect-square md:aspect-[4/3] border-4 rounded-2xl overflow-hidden flex flex-col p-6 md:p-10 transition-all duration-500",
        isEcoMode 
          ? "bg-zinc-950 border-zinc-900 shadow-none opacity-40" 
          : "bg-zinc-900 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      )}>
        
        {/* Header Info */}
        <div className="flex justify-between items-start mb-6 md:mb-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-orange-500/50 uppercase tracking-widest">Vehicle Status</span>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                (isActive || isSimulating) ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-zinc-700",
                !isEcoMode && (isActive || isSimulating) && "animate-pulse"
              )} />
              <span className={cn(
                "text-[10px] md:text-xs font-bold",
                (isActive || isSimulating) ? "text-green-500" : "text-zinc-600"
              )}>
                {isSimulating ? "SIMULATION" : isActive ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
          </div>
          
          <div className="flex gap-1 md:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                "h-8 w-8 md:h-10 md:w-10 transition-colors",
                isSimulating ? "text-blue-500 bg-blue-500/10" : "text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10"
              )}
            >
              <Beaker size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEcoMode(!isEcoMode)}
              className={cn(
                "h-8 w-8 md:h-10 md:w-10 transition-colors",
                isEcoMode ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-green-500 hover:bg-green-500/10"
              )}
            >
              <BatteryLow size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleMute}
              className="h-8 w-8 md:h-10 md:w-10 text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
          </div>
        </div>

        {/* Main Speed Display */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {error && !isActive && !isSimulating && (
            <div className="absolute top-0 text-[10px] text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
              GPS: {error}
            </div>
          )}
          
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-orange-500/30 uppercase tracking-[0.5em]">
            Velocity
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter transition-all duration-200",
              isChiming 
                ? "text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" 
                : "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]",
              isEcoMode && "drop-shadow-none"
            )}>
              {displaySpeed.toString().padStart(3, '0')}
            </span>
            <span className="text-lg md:text-xl font-bold text-zinc-500">km/h</span>
          </div>

          {/* Speed Warning Indicator */}
          {isChiming && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className={cn("flex items-center gap-2 text-orange-500", !isEcoMode && "animate-bounce")}>
                <AlertTriangle size={14} />
                <span className="text-[10px] md:text-xs font-bold tracking-widest">SPEED LIMIT EXCEEDED</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 md:mt-10 pt-6 border-t border-zinc-800/50">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase mb-1">Limit</span>
            <span className="text-xs md:text-sm font-bold text-orange-500/80">100</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase mb-1">Model</span>
            <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 truncate w-full text-center">{model.split(' ')[0]}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase mb-1">GPS</span>
            <Navigation size={12} className={cn((isActive || isSimulating) ? "text-green-500" : "text-zinc-700")} />
          </div>
        </div>

        {/* Scanline Effect */}
        {!isEcoMode && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
        )}
      </div>

      {/* Controls */}
      <div className={cn(
        "mt-8 md:mt-12 flex flex-col items-center gap-6 md:gap-8 w-full max-w-xs transition-opacity duration-500",
        isEcoMode ? "opacity-60" : "opacity-100"
      )}>
        
        {isSimulating ? (
          <div className="w-full space-y-4 bg-zinc-900/50 p-5 md:p-6 rounded-2xl border border-blue-500/20">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-blue-400 uppercase tracking-widest">Simulated Speed</label>
              <span className="text-lg md:text-xl font-bold text-blue-400">{simSpeed} km/h</span>
            </div>
            <Slider 
              value={[simSpeed]} 
              onValueChange={(val) => setSimSpeed(val[0])} 
              max={140} 
              step={1}
              className="py-4"
            />
            <p className="text-[8px] md:text-[9px] text-zinc-500 text-center uppercase">
              Test: Chime ON @ 100 | Chime OFF @ 95
            </p>
          </div>
        ) : (
          <>
            {/* Engine Start/Stop Button */}
            <div className="relative group">
              {!isEcoMode && (
                <div className={cn(
                  "absolute -inset-4 rounded-full blur-xl transition-all duration-500 opacity-50",
                  isActive ? "bg-red-500/40" : "bg-green-500/20 group-hover:bg-green-500/40"
                )} />
              )}
              
              <button
                onClick={isActive ? stopTracking : startTracking}
                className={cn(
                  "relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 active:scale-90 shadow-2xl",
                  isActive 
                    ? "bg-zinc-900 border-red-600 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.3)]" 
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-500",
                  isEcoMode && "shadow-none border-zinc-800"
                )}
              >
                <div className={cn(
                  "absolute inset-1 rounded-full border border-white/5 pointer-events-none",
                  isActive ? "bg-gradient-to-b from-red-500/10 to-transparent" : "bg-gradient-to-b from-white/5 to-transparent"
                )} />
                
                <Power size={20} className={cn("mb-1 transition-colors md:size-6", isActive && !isEcoMode && "animate-pulse")} />
                <span className="text-[9px] md:text-[10px] font-black tracking-tighter leading-none">ENGINE</span>
                <span className="text-xs md:text-sm font-black tracking-widest leading-none">START</span>
                <span className="text-[9px] md:text-[10px] font-black tracking-tighter leading-none">STOP</span>
              </button>
            </div>

            <div className="space-y-2 w-full">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest ml-1">Vehicle Profile</label>
              <Select onValueChange={setModel} defaultValue={model}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 h-10 md:h-12 rounded-xl focus:ring-orange-500/50">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                  <SelectItem value="PEUGEOT 208">PEUGEOT 208</SelectItem>
                  <SelectItem value="VOLKSWAGEN SHARAN">VW SHARAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        <p className="text-[9px] md:text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed opacity-50">
          {isEcoMode ? "Eco Mode: UI Throttled & Dimmed" : "Standard Mode: Full Visuals"}
        </p>
      </div>
    </div>
  );
};

export default AE86Dashboard;