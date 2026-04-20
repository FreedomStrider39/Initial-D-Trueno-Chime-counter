"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Volume2, VolumeX, Power, BatteryLow, Beaker, Zap, Droplets, Info } from 'lucide-react';
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
  const { speed: gpsSpeed, coords, isActive, isChiming: gpsIsChiming, startTracking, stopTracking } = useSpeedTracker(100, 95);
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

  // Calculate Tachometer (RPM) simulation based on speed
  const rpmPercent = Math.min((displaySpeed / 140) * 100, 100);
  
  // Calculate Speed Arc Percent (0-140 km/h range)
  const speedPercent = Math.min((displaySpeed / 140) * 100, 100);

  // Calculate Temp Gauge (0-40C range for visualization)
  const displayTemp = temp ?? 20; 
  const tempPercent = Math.min(Math.max((displayTemp / 40) * 100, 0), 100);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen transition-colors duration-1000 p-4 md:p-8 font-mono",
      isEcoMode ? "bg-black" : "bg-zinc-950"
    )}>
      {/* Authentic AE86 Digital Cluster Frame - Expanded to include controls */}
      <div className={cn(
        "relative w-full max-w-5xl border-[12px] border-zinc-900 rounded-sm overflow-hidden flex flex-col p-4 md:p-8 transition-all duration-500",
        isEcoMode 
          ? "bg-black shadow-none" 
          : "bg-[#050505] shadow-[0_0_100px_rgba(0,0,0,1),inset_0_0_60px_rgba(0,0,0,1)]"
      )}>
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30" />
        
        {/* Main Display Area */}
        <div className="relative flex-1 flex flex-col border-2 border-zinc-800/30 p-4 md:p-6">
          
          {/* Top Section: Curved Tachometer */}
          <div className="relative w-full h-40 md:h-48 mb-8">
            <svg viewBox="0 0 800 160" className="w-full h-full overflow-visible">
              {/* Tachometer Background Arc */}
              <path 
                d="M 50 150 Q 150 30 400 30 Q 650 30 750 150" 
                fill="none" 
                stroke="#1a1a1a" 
                strokeWidth="14" 
                strokeLinecap="round"
              />
              
              {/* Tachometer Active Segments */}
              <path 
                d="M 50 150 Q 150 30 400 30 Q 650 30 750 150" 
                fill="none" 
                stroke={rpmPercent > 85 ? "#ea580c" : "#10b981"} 
                strokeWidth="14" 
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (rpmPercent * 10)}
                className="transition-all duration-300 ease-out"
                style={{ filter: rpmPercent > 85 ? 'drop-shadow(0 0 15px #ea580c)' : 'drop-shadow(0 0 15px #10b981)' }}
              />

              {/* Tachometer Numbers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                const adjX = [50, 120, 210, 310, 400, 490, 590, 680, 750][num];
                const adjY = [165, 110, 75, 55, 50, 55, 75, 110, 165][num];
                return (
                  <text 
                    key={num} 
                    x={adjX} 
                    y={adjY} 
                    fill={num >= 7 ? "#991b1b" : "#444"} 
                    fontSize="18" 
                    fontWeight="900" 
                    textAnchor="middle"
                    className="font-sans italic"
                  >
                    {num}
                  </text>
                );
              })}
              
              <text x="180" y="150" fill="#333" fontSize="12" fontWeight="bold" className="uppercase tracking-[0.2em]">
                TACH x100r/min
              </text>
            </svg>

            {/* Speed Electronic Display Box & Speed Arc */}
            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
              
              {/* Speed Arc SVG */}
              <svg width="300" height="150" viewBox="0 0 300 150" className="absolute -top-8 overflow-visible">
                {/* Background Arc */}
                <path 
                  d="M 40 130 A 110 110 0 0 1 260 130" 
                  fill="none" 
                  stroke="#1a1a1a" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                />
                {/* Active Speed Arc */}
                <path 
                  d="M 40 130 A 110 110 0 0 1 260 130" 
                  fill="none" 
                  stroke={isChiming ? "#ea580c" : "#10b981"} 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  strokeDasharray="400"
                  strokeDashoffset={400 - (speedPercent * 3.8)}
                  className="transition-all duration-200 ease-out"
                  style={{ filter: isChiming ? 'drop-shadow(0 0 15px #ea580c)' : 'drop-shadow(0 0 15px #10b981)' }}
                />
                {/* Speed Scale Markers */}
                {[0, 20, 40, 60, 80, 100, 120, 140].map((val, i) => {
                  const angle = (i / 7) * Math.PI;
                  const x = 150 - Math.cos(angle) * 135;
                  const y = 130 - Math.sin(angle) * 135;
                  return (
                    <text 
                      key={val} 
                      x={x} 
                      y={y} 
                      fill="#333" 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {val}
                    </text>
                  );
                })}
              </svg>

              {/* Speed Box */}
              <div className="bg-zinc-900/95 border-2 border-zinc-800 p-4 md:p-5 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.8)] min-w-[220px] flex flex-col items-center relative">
                <div className="absolute top-1 left-2 text-[7px] text-zinc-600 font-black uppercase tracking-widest">SPEED</div>
                <div className="flex items-baseline">
                  <span className={cn(
                    "text-6xl md:text-7xl font-black tracking-tighter transition-all duration-100 tabular-nums leading-none",
                    isChiming ? "text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]" : "text-[#10b981] drop-shadow-[0_0_25px_rgba(16,185,129,0.7)]"
                  )}>
                    {displaySpeed}
                  </span>
                  <span className="text-lg md:text-xl font-black text-zinc-700 ml-2 italic">km/h</span>
                </div>
                <div className="mt-1 text-[7px] text-zinc-700 font-black tracking-[0.4em] uppercase">ELECTRONIC DISPLAY</div>
              </div>
            </div>
          </div>

          {/* Middle: Side Gauges */}
          <div className="flex-1 flex items-center justify-between px-4 mt-2">
            
            {/* Left: Fuel Gauge */}
            <div className="flex flex-col items-center gap-2 w-14">
              <div className="text-[9px] text-zinc-600 font-black uppercase">FUEL</div>
              <div className="w-8 h-28 border-2 border-zinc-800 p-1 flex flex-col-reverse gap-[2px] bg-zinc-900/40">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-full h-full transition-colors duration-500",
                      i < 7 ? "bg-[#10b981]/80" : "bg-zinc-900"
                    )} 
                  />
                ))}
              </div>
              <div className="flex justify-between w-full text-[7px] text-zinc-700 font-black px-1">
                <span>E</span><span>F</span>
              </div>
            </div>

            {/* Right: Temp Gauge */}
            <div className="flex flex-col items-center gap-2 w-14">
              <div className="text-[9px] text-zinc-600 font-black uppercase">TEMP</div>
              <div className="w-8 h-28 border-2 border-zinc-800 p-1 flex flex-col-reverse gap-[2px] bg-zinc-900/40">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isActive = (i / 10) * 100 < tempPercent;
                  const isHot = i > 8;
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full h-full transition-colors duration-500",
                        isActive ? (isHot ? "bg-orange-600" : "bg-[#10b981]/80") : "bg-zinc-900"
                      )} 
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-[7px] text-zinc-700 font-black px-1">
                <span>C</span><span>H</span>
              </div>
              <div className="text-[9px] font-black text-[#10b981]/60 mt-1">{temp !== null ? `${temp}°C` : '--'}</div>
            </div>
          </div>

          {/* Bottom: Warning Lights Row */}
          <div className="mt-4 flex justify-end gap-4 md:gap-6 border-t border-zinc-800/30 pt-4">
            <div className={cn("flex flex-col items-center gap-1 transition-colors", isChiming ? "text-orange-600" : "text-zinc-900")}>
              <AlertTriangle size={18} className={isChiming ? "animate-pulse" : ""} />
              <span className="text-[6px] font-black uppercase">Brake</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-zinc-900">
              <Zap size={18} />
              <span className="text-[6px] font-black uppercase">Charge</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-zinc-900">
              <Droplets size={18} />
              <span className="text-[6px] font-black uppercase">Oil</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-zinc-900">
              <Info size={18} />
              <span className="text-[6px] font-black uppercase">Check</span>
            </div>
          </div>

          {/* Odometer & Branding */}
          <div className="mt-4 flex justify-between items-end px-4">
            <div className="flex flex-col gap-1">
              <div className="bg-black border-2 border-zinc-800 px-3 py-1 flex gap-1">
                {["0", "3", "0", "4", "0", "9"].map((digit, i) => (
                  <span key={i} className="text-xs font-black text-zinc-400 tabular-nums bg-zinc-900 px-1 rounded-sm">{digit}</span>
                ))}
                <span className="text-[8px] text-zinc-600 self-end ml-1 font-black">km</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base md:text-lg text-zinc-600 font-black tracking-[0.3em] italic">
                {model} <span className="text-zinc-800 ml-2">GT-APEX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Controls Section */}
        <div className={cn(
          "mt-8 pt-8 border-t-4 border-zinc-900/50 flex flex-col items-center gap-6 transition-opacity duration-500",
          isEcoMode ? "opacity-60" : "opacity-100"
        )}>
          
          {isSimulating ? (
            <div className="w-full space-y-4 bg-zinc-900/40 p-6 rounded-sm border border-zinc-800/50">
              <div className="flex justify-between items-center">
                <label className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-black">Manual Override</label>
                <span className="text-xl font-black text-[#10b981] tabular-nums">{simSpeed} <span className="text-[10px] text-zinc-600">km/h</span></span>
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
                className="w-full border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[9px] uppercase tracking-[0.4em] font-black h-10"
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
                    "group relative w-24 h-24 rounded-full border-[4px] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 bg-[#1a1a1a] shadow-xl",
                    isActive 
                      ? "border-orange-600 shadow-[0_0_30px_rgba(234,88,12,0.4)]" 
                      : "border-zinc-800 hover:border-orange-600/50"
                  )}
                >
                  <Power size={32} className={cn("mb-1 transition-colors", isActive ? "text-orange-500" : "text-zinc-600")} />
                  <span className={cn(
                    "text-[8px] font-black tracking-tighter uppercase transition-colors",
                    isActive ? "text-orange-500" : "text-zinc-600"
                  )}>
                    Ignition
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-600 uppercase tracking-[0.3em] font-black ml-1">Vehicle Profile</label>
                  <Select onValueChange={setModel} defaultValue={model}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-400 h-12 rounded-sm text-[9px] uppercase tracking-widest focus:ring-orange-500/50 font-black">
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
                    variant="secondary" 
                    size="icon" 
                    onClick={() => setIsSimulating(true)}
                    className="flex-1 h-12 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800 rounded-sm"
                  >
                    <Beaker size={20} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={() => setIsEcoMode(!isEcoMode)}
                    className="flex-1 h-12 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800 rounded-sm"
                  >
                    <BatteryLow size={20} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={handleToggleMute}
                    className="flex-1 h-12 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800 rounded-sm"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AE86Dashboard;