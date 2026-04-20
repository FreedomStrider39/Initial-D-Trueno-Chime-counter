"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Navigation, Volume2, VolumeX, Power, BatteryLow, Beaker, Thermometer, Zap, Droplets, Info } from 'lucide-react';
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
  const rpmValue = (displaySpeed / 140) * 8; // 0 to 8 range
  const rpmPercent = Math.min((displaySpeed / 140) * 100, 100);

  // Calculate Temp Gauge (0-40C range for visualization)
  const displayTemp = temp ?? 20; 
  const tempPercent = Math.min(Math.max((displayTemp / 40) * 100, 0), 100);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen transition-colors duration-1000 p-4 md:p-8 font-mono",
      isEcoMode ? "bg-black" : "bg-zinc-950"
    )}>
      {/* Authentic AE86 Digital Cluster Container */}
      <div className={cn(
        "relative w-full max-w-4xl aspect-[2.2/1] border-[10px] border-zinc-900 rounded-sm overflow-hidden flex flex-col p-6 md:p-10 transition-all duration-500",
        isEcoMode 
          ? "bg-black shadow-none" 
          : "bg-[#0a0a0a] shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_40px_rgba(0,0,0,1)]"
      )}>
        
        {/* Background Grid Lines (Authentic Style) */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-700" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-zinc-700" />
        </div>

        {/* Main Display Area */}
        <div className="relative flex-1 flex flex-col">
          
          {/* Top: Sweeping Tachometer Arc */}
          <div className="relative h-32 md:h-40 w-full mb-4">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
              {/* Tachometer Path Background */}
              <path 
                d="M 50 180 Q 200 50 400 50 Q 600 50 750 180" 
                fill="none" 
                stroke="#1a1a1a" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
              
              {/* Tachometer Active Path */}
              <path 
                d="M 50 180 Q 200 50 400 50 Q 600 50 750 180" 
                fill="none" 
                stroke={rpmValue > 7 ? "#ea580c" : "#10b981"} 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (rpmPercent * 10)}
                className="transition-all duration-300 ease-out"
                style={{ filter: rpmValue > 7 ? 'drop-shadow(0 0 8px #ea580c)' : 'drop-shadow(0 0 8px #10b981)' }}
              />

              {/* Tachometer Numbers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                const angle = (num / 8) * Math.PI;
                // Approximate positions along the curve
                const x = 50 + (num * 87.5);
                const y = num <= 4 ? 180 - (num * 30) : 60 + ((num - 4) * 30);
                
                // Manual adjustment for better arc alignment
                const adjX = [50, 120, 210, 310, 400, 490, 590, 680, 750][num];
                const adjY = [195, 140, 95, 70, 65, 70, 95, 140, 195][num];

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
              
              <text x="400" y="110" fill="#333" fontSize="12" fontWeight="bold" textAnchor="middle" className="uppercase tracking-[0.3em]">
                TACH x1000r/min
              </text>
            </svg>
          </div>

          {/* Middle: Speedometer Box & Side Gauges */}
          <div className="flex-1 flex items-center justify-between px-2 md:px-6">
            
            {/* Left Gauge: Eco/Battery (Replacing Fuel) */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">ECO</div>
              <div className="w-12 h-32 border-2 border-zinc-800 p-1 flex flex-col-reverse gap-[2px] bg-zinc-900/20">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isActive = (i / 10) * 100 < (100 - rpmPercent);
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full h-full transition-colors duration-500",
                        isActive ? "bg-emerald-600/80" : "bg-zinc-900"
                      )} 
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-[8px] text-zinc-700 font-black px-1">
                <span>E</span><span>F</span>
              </div>
            </div>

            {/* Center: Speedometer Box */}
            <div className="relative flex flex-col items-center">
              <div className="bg-zinc-900/40 border-2 border-zinc-800 p-6 md:p-10 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] min-w-[240px] flex flex-col items-center">
                <div className="absolute top-2 left-4 text-[10px] text-zinc-600 font-black uppercase tracking-widest">SPEED</div>
                <div className="flex items-baseline">
                  <span className={cn(
                    "text-8xl md:text-9xl font-black tracking-tighter transition-all duration-100 tabular-nums leading-none",
                    isChiming ? "text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]" : "text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                  )}>
                    {displaySpeed}
                  </span>
                  <span className="text-xl md:text-2xl font-black text-zinc-600 ml-2 italic">km/h</span>
                </div>
                <div className="mt-4 text-[10px] text-zinc-700 font-black tracking-[0.5em] uppercase">ELECTRONIC DISPLAY</div>
              </div>
              
              {/* Digital Clock Integrated Below Speed */}
              <div className="mt-4 bg-zinc-900/60 border border-zinc-800 px-4 py-1 rounded-sm">
                <span className="text-lg font-black text-emerald-500/80 tabular-nums tracking-widest">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>
            </div>

            {/* Right Gauge: Temperature (Live Weather) */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">TEMP</div>
              <div className="w-12 h-32 border-2 border-zinc-800 p-1 flex flex-col-reverse gap-[2px] bg-zinc-900/20">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isActive = (i / 10) * 100 < tempPercent;
                  const isHot = i > 7;
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full h-full transition-colors duration-500",
                        isActive ? (isHot ? "bg-orange-600" : "bg-emerald-600") : "bg-zinc-900"
                      )} 
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-[8px] text-zinc-700 font-black px-1">
                <span>C</span><span>H</span>
              </div>
              <div className="text-[10px] font-black text-emerald-500/60 mt-1">{temp !== null ? `${temp}°C` : '--'}</div>
            </div>
          </div>

          {/* Bottom: Warning Lights Row */}
          <div className="mt-8 flex justify-center gap-4 md:gap-8 border-t border-zinc-800/50 pt-6">
            <div className={cn("flex flex-col items-center gap-1 transition-colors", isChiming ? "text-orange-600" : "text-zinc-900")}>
              <AlertTriangle size={20} className={isChiming ? "animate-pulse" : ""} />
              <span className="text-[7px] font-black uppercase">Warning</span>
            </div>
            <div className={cn("flex flex-col items-center gap-1 transition-colors", (isActive || isSimulating) ? "text-emerald-600" : "text-zinc-900")}>
              <Navigation size={20} />
              <span className="text-[7px] font-black uppercase">GPS Link</span>
            </div>
            <div className={cn("flex flex-col items-center gap-1 transition-colors", isMuted ? "text-orange-600" : "text-zinc-900")}>
              <VolumeX size={20} />
              <span className="text-[7px] font-black uppercase">Mute</span>
            </div>
            <div className={cn("flex flex-col items-center gap-1 transition-colors", isEcoMode ? "text-emerald-600" : "text-zinc-900")}>
              <Zap size={20} />
              <span className="text-[7px] font-black uppercase">Eco</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-zinc-900">
              <Droplets size={20} />
              <span className="text-[7px] font-black uppercase">Oil</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-zinc-900">
              <Info size={20} />
              <span className="text-[7px] font-black uppercase">Check</span>
            </div>
          </div>

          {/* Odometer Style Bottom Bar */}
          <div className="mt-6 flex justify-between items-center px-4">
            <div className="bg-black border border-zinc-800 px-3 py-1 flex gap-1">
              {["0", "8", "6", "1", "0", ".", "1"].map((digit, i) => (
                <span key={i} className="text-xs font-black text-zinc-400 tabular-nums bg-zinc-900 px-1 rounded-sm">{digit}</span>
              ))}
              <span className="text-[8px] text-zinc-600 self-end ml-1 font-black">km</span>
            </div>
            <div className="text-[10px] text-zinc-600 font-black tracking-[0.4em] italic">
              {model} <span className="text-zinc-800 ml-2">GT-APEX</span>
            </div>
          </div>
        </div>

        {/* Scanline & CRT Effect */}
        {!isEcoMode && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.02),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] opacity-50" />
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
      </div>
    </div>
  );
};

export default AE86Dashboard;