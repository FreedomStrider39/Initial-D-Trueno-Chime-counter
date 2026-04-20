"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Navigation, Volume2, VolumeX, Power, BatteryLow, Beaker, Thermometer } from 'lucide-react';
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
      {/* Retro Digital Cluster Container - Larger and wider */}
      <div className={cn(
        "relative w-full max-w-4xl aspect-[2.5/1] border-[8px] rounded-sm overflow-hidden flex flex-col p-4 md:p-8 transition-all duration-500",
        isEcoMode 
          ? "bg-black border-zinc-900 shadow-none" 
          : "bg-zinc-950 border-zinc-900 shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,0,0,1)]"
      )}>
        
        {/* Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

        {/* Top Section: Tachometer Bar - Sweeping across */}
        <div className="relative w-full h-16 md:h-20 mb-6 border-b-2 border-zinc-800/30 flex items-end pb-3">
          <div className="absolute top-0 left-2 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">x1000 r/min</div>
          <div className="flex w-full h-6 md:h-8 gap-[3px] px-2">
            {Array.from({ length: 50 }).map((_, i) => {
              const isActiveBar = (i / 50) * 100 < rpmPercent;
              const isRedline = i > 40;
              return (
                <div 
                  key={i}
                  className={cn(
                    "flex-1 transition-all duration-150 rounded-t-[1px]",
                    isActiveBar 
                      ? (isRedline ? "bg-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.7)]" : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]")
                      : "bg-zinc-900/50"
                  )}
                />
              );
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-between px-4 text-[10px] text-zinc-700 font-black">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span className="text-orange-900">8</span>
          </div>
        </div>

        {/* Middle Section: Speed, Indicators, and Clock */}
        <div className="flex-1 flex items-center justify-between px-4 md:px-12">
          
          {/* Left Side: Status Indicators */}
          <div className="flex flex-col gap-6">
            <div className={cn(
              "w-14 h-10 border-2 flex items-center justify-center transition-all duration-300 rounded-sm",
              (isActive || isSimulating) ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-500" : "border-zinc-900 text-zinc-900"
            )}>
              <Navigation size={24} className={cn((isActive || isSimulating) && !isEcoMode && "animate-pulse")} />
            </div>
            <div className={cn(
              "w-14 h-10 border-2 flex items-center justify-center transition-all duration-300 rounded-sm",
              isMuted ? "border-orange-500/50 bg-orange-500/5 text-orange-500" : "border-zinc-900 text-zinc-900"
            )}>
              <VolumeX size={24} />
            </div>
          </div>

          {/* Center: Large Speed Display */}
          <div className="flex flex-col items-center relative">
            <div className="absolute -top-8 text-[12px] text-zinc-600 uppercase tracking-[0.6em] font-black">Speedometer</div>
            <div className="flex items-baseline">
              <span className={cn(
                "text-9xl md:text-[12rem] font-black tracking-tighter transition-all duration-100 tabular-nums leading-none",
                isChiming 
                  ? "text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]" 
                  : "text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]",
                isEcoMode && "drop-shadow-none"
              )}>
                {displaySpeed.toString().padStart(3, '0')}
              </span>
              <div className="flex flex-col ml-4">
                <span className="text-2xl md:text-4xl font-black text-zinc-600 italic tracking-tighter">km/h</span>
              </div>
            </div>
          </div>

          {/* Right Side: Clock & Temp */}
          <div className="flex flex-col items-end gap-6">
            {/* Authentic 7-Segment Style Clock */}
            <div className="bg-zinc-900/80 border-2 border-zinc-800 p-3 rounded-sm shadow-inner">
              <div className="text-[8px] text-zinc-600 uppercase font-black mb-1 tracking-widest">Digital Clock</div>
              <div className="text-2xl md:text-3xl font-black text-emerald-500/90 tabular-nums tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
            </div>

            {/* Temperature Gauge */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-28 border-2 border-zinc-800 p-1.5 flex flex-col justify-between relative rounded-sm bg-zinc-900/30">
                <div className="text-[8px] text-zinc-600 text-center uppercase font-black">Temp</div>
                <div className="flex-1 flex flex-col-reverse gap-[2px] mt-1.5">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const isActiveBar = (i / 12) * 100 < tempPercent;
                    const isHot = i > 9;
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "w-full h-full transition-colors duration-700 rounded-[1px]", 
                          isActiveBar 
                            ? (isHot ? "bg-orange-600 shadow-[0_0_5px_rgba(234,88,12,0.5)]" : "bg-emerald-600 shadow-[0_0_5px_rgba(16,185,129,0.5)]") 
                            : "bg-zinc-900"
                        )} 
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[7px] text-zinc-700 mt-1 font-black">
                  <span>C</span><span>H</span>
                </div>
              </div>
              <div className="flex flex-col items-center bg-zinc-900/50 p-2 border border-zinc-800 rounded-sm">
                <Thermometer size={14} className="text-zinc-600 mb-1" />
                <span className="text-xs font-black text-emerald-500/70">{temp !== null ? `${temp}°` : '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Warning Bar & Info */}
        <div className="mt-6 pt-3 border-t-2 border-zinc-800/30 flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "px-3 py-1 border text-[10px] font-black tracking-widest uppercase transition-all duration-300",
              isChiming ? "border-orange-500 bg-orange-500/20 text-orange-500 animate-pulse" : "border-zinc-900 text-zinc-800"
            )}>
              Speed Warning
            </div>
            <div className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase font-black">
              Mode: <span className="text-zinc-400">{isSimulating ? "Simulation" : isActive ? "GPS Active" : "Standby"}</span>
            </div>
          </div>
          
          <div className="text-xs text-zinc-500 font-black tracking-[0.4em] italic">
            {model} <span className="text-zinc-700 ml-2">TWIN CAM 16</span>
          </div>
          
          <div className="text-[10px] text-zinc-600 tracking-widest uppercase font-black">
            ODO: <span className="text-zinc-400 tabular-nums">08610.1 km</span>
          </div>
        </div>

        {/* Scanline Effect */}
        {!isEcoMode && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_4px,2px_100%]" />
        )}
      </div>

      {/* Controls Section */}
      <div className={cn(
        "mt-12 flex flex-col items-center gap-8 w-full max-w-md transition-opacity duration-500",
        isEcoMode ? "opacity-60" : "opacity-100"
      )}>
        
        {isSimulating ? (
          <div className="w-full space-y-4 bg-zinc-900/60 p-8 rounded-sm border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-black">Manual Override</label>
              <span className="text-2xl font-black text-emerald-400 tabular-nums">{simSpeed} <span className="text-xs text-zinc-600">km/h</span></span>
            </div>
            <Slider 
              value={[simSpeed]} 
              onValueChange={(val) => setSimSpeed(val[0])} 
              max={140} 
              step={1}
              className="py-6"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsSimulating(false)}
              className="w-full border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-black h-12"
            >
              Exit Simulation
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            {/* Ignition Button */}
            <div className="flex justify-center">
              <button
                onClick={isActive ? stopTracking : startTracking}
                className={cn(
                  "group relative w-28 h-28 rounded-full border-[6px] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 shadow-2xl",
                  isActive 
                    ? "bg-zinc-900 border-orange-600 text-orange-500 shadow-[0_0_30px_rgba(234,88,12,0.3)]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-emerald-500 hover:text-emerald-500"
                )}
              >
                <Power size={32} className={cn("mb-1", isActive && "animate-pulse")} />
                <span className="text-[10px] font-black tracking-tighter uppercase">Ignition</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black ml-1">Vehicle Profile</label>
                <Select onValueChange={setModel} defaultValue={model}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-400 h-12 rounded-sm text-[10px] uppercase tracking-widest focus:ring-emerald-500/50 font-black">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-400">
                    <SelectItem value="PEUGEOT 208">208 GT</SelectItem>
                    <SelectItem value="VOLKSWAGEN SHARAN">SHARAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 items-end">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsSimulating(true)}
                  className="flex-1 h-12 border-zinc-800 text-zinc-600 hover:text-emerald-500 hover:bg-emerald-500/5"
                >
                  <Beaker size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsEcoMode(!isEcoMode)}
                  className={cn("flex-1 h-12 border-zinc-800", isEcoMode ? "text-emerald-500" : "text-zinc-600")}
                >
                  <BatteryLow size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleToggleMute}
                  className="flex-1 h-12 border-zinc-800 text-zinc-600 hover:text-orange-500"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-2 opacity-30">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-black">
            Digital Instrument System v1.2
          </p>
          <div className="flex gap-6">
            <div className="w-3 h-3 bg-emerald-900 rounded-full" />
            <div className="w-3 h-3 bg-orange-900 rounded-full" />
            <div className="w-3 h-3 bg-zinc-900 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AE86Dashboard;