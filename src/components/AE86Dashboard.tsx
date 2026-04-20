"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Navigation, Volume2, VolumeX, Power, BatteryLow, Beaker, Clock, Thermometer } from 'lucide-react';
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
  const { speed: gpsSpeed, coords, isActive, isChiming: gpsIsChiming, error, startTracking, stopTracking } = useSpeedTracker(100, 95);
  const { temp } = useWeather(coords?.latitude, coords?.longitude);
  
  const [model, setModel] = useState("PEUGEOT 208");
  const [isMuted, setIsMuted] = useState(chime.getMuteStatus());
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState(0);
  const [simIsChiming, setSimIsChiming] = useState(false);

  // Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Calculate Tachometer (RPM) simulation based on speed
  const rpmPercent = Math.min((displaySpeed / 140) * 100, 100);

  // Calculate Temp Gauge (0-40C range for visualization)
  const displayTemp = temp ?? 20; 
  const tempPercent = Math.min(Math.max((displayTemp / 40) * 100, 0), 100);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen transition-colors duration-1000 p-4 md:p-8 font-mono",
      isEcoMode ? "bg-black" : "bg-zinc-950"
    )}>
      {/* Retro Digital Cluster Container */}
      <div className={cn(
        "relative w-full max-w-2xl aspect-[2/1] border-[6px] rounded-sm overflow-hidden flex flex-col p-4 md:p-6 transition-all duration-500",
        isEcoMode 
          ? "bg-black border-zinc-900 shadow-none" 
          : "bg-zinc-950 border-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,1)]"
      )}>
        
        {/* Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Top Section: Tachometer Bar */}
        <div className="relative w-full h-12 md:h-16 mb-4 border-b border-zinc-800/50 flex items-end pb-2">
          <div className="absolute top-0 left-0 text-[8px] text-zinc-600 uppercase tracking-tighter">x1000 r/min</div>
          <div className="flex w-full h-4 md:h-6 gap-[2px]">
            {Array.from({ length: 40 }).map((_, i) => {
              const isActiveBar = (i / 40) * 100 < rpmPercent;
              const isRedline = i > 32;
              return (
                <div 
                  key={i}
                  className={cn(
                    "flex-1 transition-all duration-150",
                    isActiveBar 
                      ? (isRedline ? "bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]")
                      : "bg-zinc-900"
                  )}
                />
              );
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-between px-1 text-[8px] text-zinc-700 font-bold">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span className="text-orange-900">7</span><span className="text-orange-900">8</span>
          </div>
        </div>

        {/* Middle Section: Speed & Indicators */}
        <div className="flex-1 flex items-center justify-between px-4 md:px-10">
          
          {/* Left Side: Status Icons & Clock */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1">
              <Clock size={14} className="text-zinc-700" />
              <span className="text-[10px] md:text-xs font-bold text-emerald-500/80 tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
            </div>
            <div className={cn("transition-colors", (isActive || isSimulating) ? "text-emerald-500" : "text-zinc-800")}>
              <Navigation size={20} className={cn((isActive || isSimulating) && !isEcoMode && "animate-pulse")} />
            </div>
            <div className={cn("transition-colors", isMuted ? "text-orange-500" : "text-zinc-800")}>
              <VolumeX size={20} />
            </div>
          </div>

          {/* Center: Large Speed Display */}
          <div className="flex flex-col items-center relative">
            <div className="absolute -top-6 text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Speedometer</div>
            <div className="flex items-baseline">
              <span className={cn(
                "text-8xl md:text-9xl font-black tracking-tighter transition-all duration-100 tabular-nums",
                isChiming 
                  ? "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
                  : "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]",
                isEcoMode && "drop-shadow-none"
              )}>
                {displaySpeed.toString().padStart(3, '0')}
              </span>
              <div className="flex flex-col ml-2">
                <span className="text-xl md:text-2xl font-bold text-zinc-500 italic">km/h</span>
              </div>
            </div>
          </div>

          {/* Right Side: Warning & Temp Gauge */}
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              "w-12 h-8 border flex items-center justify-center transition-all duration-300",
              isChiming ? "border-orange-500 bg-orange-500/10 text-orange-500" : "border-zinc-800 text-zinc-900"
            )}>
              <AlertTriangle size={18} className={isChiming ? "animate-pulse" : ""} />
            </div>
            
            {/* Temperature Gauge */}
            <div className="w-16 h-24 border border-zinc-800 p-1 flex flex-col justify-between relative">
              <div className="text-[7px] text-zinc-600 text-center uppercase font-bold">Temp</div>
              <div className="flex-1 flex flex-col-reverse gap-[1px] mt-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isActiveBar = (i / 10) * 100 < tempPercent;
                  const isHot = i > 7;
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full h-full transition-colors duration-500", 
                        isActiveBar 
                          ? (isHot ? "bg-orange-600" : "bg-emerald-600") 
                          : "bg-zinc-900"
                      )} 
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[6px] text-zinc-700 mt-1 font-bold">
                <span>C</span><span>H</span>
              </div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <Thermometer size={10} className="text-zinc-700 mb-1" />
                <span className="text-[8px] font-bold text-zinc-500">{temp !== null ? `${temp}°` : '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Model & Odo */}
        <div className="mt-4 pt-2 border-t border-zinc-800/50 flex justify-between items-center px-2">
          <div className="text-[9px] text-zinc-500 tracking-widest uppercase font-bold">
            System: <span className="text-zinc-400">{isSimulating ? "SIM-MODE" : isActive ? "GPS-LINK" : "OFFLINE"}</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-bold tracking-widest">
            {model} <span className="text-zinc-600 ml-2">GT-S</span>
          </div>
          <div className="text-[9px] text-zinc-500 tracking-widest uppercase font-bold">
            ODO: <span className="text-zinc-400">08610.1</span>
          </div>
        </div>

        {/* Scanline Effect */}
        {!isEcoMode && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_3px,2px_100%]" />
        )}
      </div>

      {/* Controls Section */}
      <div className={cn(
        "mt-10 flex flex-col items-center gap-8 w-full max-sm transition-opacity duration-500",
        isEcoMode ? "opacity-60" : "opacity-100"
      )}>
        
        {isSimulating ? (
          <div className="w-full space-y-4 bg-zinc-900/40 p-6 rounded-sm border border-zinc-800">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Manual Override</label>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">{simSpeed} <span className="text-xs text-zinc-600">km/h</span></span>
            </div>
            <Slider 
              value={[simSpeed]} 
              onValueChange={(val) => setSimSpeed(val[0])} 
              max={140} 
              step={1}
              className="py-4"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsSimulating(false)}
              className="w-full border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] uppercase tracking-widest"
            >
              Exit Simulation
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {/* Ignition Button */}
            <div className="flex justify-center">
              <button
                onClick={isActive ? stopTracking : startTracking}
                className={cn(
                  "group relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 active:scale-95",
                  isActive 
                    ? "bg-zinc-900 border-orange-600 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.2)]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-emerald-500 hover:text-emerald-500"
                )}
              >
                <Power size={24} className={cn("mb-1", isActive && "animate-pulse")} />
                <span className="text-[8px] font-black tracking-tighter uppercase">Ignition</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold ml-1">Profile</label>
                <Select onValueChange={setModel} defaultValue={model}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-400 h-10 rounded-sm text-[10px] uppercase tracking-widest focus:ring-emerald-500/50">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-400">
                    <SelectItem value="PEUGEOT 208">208 GT</SelectItem>
                    <SelectItem value="VOLKSWAGEN SHARAN">SHARAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 items-end">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsSimulating(true)}
                  className="flex-1 h-10 border-zinc-800 text-zinc-600 hover:text-emerald-500 hover:bg-emerald-500/5"
                >
                  <Beaker size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsEcoMode(!isEcoMode)}
                  className={cn("flex-1 h-10 border-zinc-800", isEcoMode ? "text-emerald-500" : "text-zinc-600")}
                >
                  <BatteryLow size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleToggleMute}
                  className="flex-1 h-10 border-zinc-800 text-zinc-600 hover:text-orange-500"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-1 opacity-40">
          <p className="text-[8px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
            Digital Instrument System v1.0
          </p>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-emerald-900 rounded-full" />
            <div className="w-2 h-2 bg-orange-900 rounded-full" />
            <div className="w-2 h-2 bg-zinc-900 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AE86Dashboard;