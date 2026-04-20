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

  // Calculate Speed Arc Percent (0-140 km/h range)
  const speedPercent = Math.min((displaySpeed / 140) * 100, 100);

  // Calculate Temp Gauge (0-40C range for visualization)
  const displayTemp = temp ?? 20; 
  const tempPercent = Math.min(Math.max((displayTemp / 40) * 100, 0), 100);

  // Helper to generate graduation ticks
  const renderTicks = () => {
    const ticks = [];
    const totalTicks = 28; // Every 5 km/h up to 140
    const radius = 110; // Reduced from 125
    const innerRadius = 102;
    const centerX = 160;
    const centerY = 140;

    for (let i = 0; i <= totalTicks; i++) {
      const angle = Math.PI + (i / totalTicks) * Math.PI;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * innerRadius;
      const y2 = centerY + Math.sin(angle) * innerRadius;
      
      const isMajor = i % 4 === 0; // Every 20 km/h

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
      "flex flex-col items-center justify-center min-h-screen transition-colors duration-1000 p-4 md:p-8 font-mono",
      isEcoMode ? "bg-black" : "bg-zinc-950"
    )}>
      {/* Authentic AE86 Digital Cluster Frame */}
      <div className={cn(
        "relative w-full max-w-5xl border-8 md:border-[12px] border-zinc-900 rounded-sm overflow-hidden flex flex-col p-4 md:p-8 transition-all duration-500",
        isEcoMode 
          ? "bg-black shadow-none" 
          : "bg-[#050505] shadow-[0_0_100px_rgba(0,0,0,1),inset_0_0_60px_rgba(0,0,0,1)]"
      )}>
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30" />
        
        {/* Main Display Area */}
        <div className="relative flex-1 flex flex-col p-4 md:p-6">
          
          {/* Top Section: Speed Arc & Readout */}
          <div className="relative w-full h-48 md:h-64 mb-4 flex flex-col items-center justify-center">
            
            {/* Speed Arc SVG */}
            <svg width="320" height="160" viewBox="0 0 320 160" className="absolute top-0 overflow-visible">
              {/* Graduation Ticks */}
              {renderTicks()}

              {/* Background Arc - Slanted Endings */}
              <path 
                d="M 50 140 A 110 110 0 0 1 270 140" 
                fill="none" 
                stroke="#111" 
                strokeWidth="12" 
                strokeLinecap="butt"
              />
              
              {/* Active Speed Arc */}
              <path 
                d="M 50 140 A 110 110 0 0 1 270 140" 
                fill="none" 
                stroke={isChiming ? "#ea580c" : "#10b981"} 
                strokeWidth="12" 
                strokeLinecap="butt"
                strokeDasharray="345"
                strokeDashoffset={345 - (speedPercent * 3.45)}
                className="transition-all duration-200 ease-out"
                style={{ filter: isChiming ? 'drop-shadow(0 0 15px #ea580c)' : 'drop-shadow(0 0 15px #10b981)' }}
              />

              {/* Speed Scale Numbers */}
              {[0, 20, 40, 60, 80, 100, 120, 140].map((val, i) => {
                const angle = Math.PI + (i / 7) * Math.PI;
                const x = 160 + Math.cos(angle) * 130;
                const y = 140 + Math.sin(angle) * 130;
                return (
                  <text 
                    key={val} 
                    x={x} 
                    y={y} 
                    fill="#444" 
                    fontSize="9" 
                    fontWeight="900" 
                    textAnchor="middle"
                    className="italic"
                  >
                    {val}
                  </text>
                );
              })}
            </svg>

            {/* Speed Readout - Centered */}
            <div className="flex flex-col items-center mt-12 z-30">
              <div className="flex items-baseline">
                <span className={cn(
                  "text-7xl md:text-8xl font-black tracking-tighter transition-all duration-100 tabular-nums leading-none",
                  isChiming ? "text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]" : "text-[#10b981] drop-shadow-[0_0_25px_rgba(16,185,129,0.7)]"
                )}>
                  {displaySpeed}
                </span>
                <span className="text-xs md:text-sm font-black text-zinc-800 ml-1 italic uppercase">km/h</span>
              </div>
              <div className="mt-1 text-[6px] md:text-[8px] text-zinc-800 font-black tracking-[0.5em] uppercase">DIGITAL SPEEDOMETER</div>
            </div>
          </div>

          {/* Middle: Side Gauges */}
          <div className="flex-1 flex items-center justify-end px-4 mt-2">
            {/* Right: Graduated Temp Gauge */}
            <div className="flex flex-col items-center gap-2 w-16">
              <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">TEMP</div>
              <div className="relative w-10 h-32 border-2 border-zinc-800 p-1.5 flex flex-col-reverse gap-[3px] bg-zinc-900/40">
                {/* Graduation Marks on the side of the gauge */}
                <div className="absolute -left-3 inset-y-0 flex flex-col justify-between py-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-1.5 h-[1px] bg-zinc-800" />
                  ))}
                </div>
                
                {Array.from({ length: 12 }).map((_, i) => {
                  const isActive = (i / 12) * 100 < tempPercent;
                  const isHot = i > 10;
                  const isCold = i < 2;
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full h-full transition-colors duration-500 rounded-[1px]",
                        isActive 
                          ? (isHot ? "bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.5)]" : isCold ? "bg-blue-500" : "bg-[#10b981]/80") 
                          : "bg-zinc-900/60"
                      )} 
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-[7px] text-zinc-700 font-black px-1">
                <span>C</span><span>H</span>
              </div>
              <div className="text-[10px] font-black text-[#10b981]/80 mt-1 tabular-nums">
                {temp !== null ? `${temp}°C` : '--°C'}
              </div>
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