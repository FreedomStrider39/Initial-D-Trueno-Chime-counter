"use client";

import React, { useState, useEffect } from 'react';
import { useSpeedTracker } from '@/hooks/useSpeedTracker';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Volume2, VolumeX, Power, Beaker, Zap, WifiOff, Radio } from 'lucide-react';
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
  const { temp, station } = useWeather(coords?.latitude, coords?.longitude);
  
  const [model, setModel] = useState("PEUGEOT 208");
  const [isMuted, setIsMuted] = useState(chime.getMuteStatus());
  
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

  // Retro Gauge Graduations - Enlarged
  const renderGraduations = () => {
    const elements = [];
    const totalTicks = 14; // Every 10 km/h
    const radius = 135;
    const innerRadius = 118;
    const textRadius = 98;
    const centerX = 160;
    const centerY = 150;

    for (let i = 0; i <= totalTicks; i++) {
      const angle = Math.PI + (i / totalTicks) * Math.PI;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * innerRadius;
      const y2 = centerY + Math.sin(angle) * innerRadius;
      
      // Tick marks
      elements.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#333"
          strokeWidth="2.5"
        />
      );

      // Numbers every 20 km/h - Enlarged
      if (i % 2 === 0) {
        const tx = centerX + Math.cos(angle) * textRadius;
        const ty = centerY + Math.sin(angle) * textRadius;
        elements.push(
          <text
            key={`text-${i}`}
            x={tx}
            y={ty}
            fill="#222"
            fontSize="11"
            fontWeight="900"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="font-mono italic"
          >
            {i * 10}
          </text>
        );
      }
    }
    return elements;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-zinc-950 p-2 font-mono overflow-hidden">
      {/* Main Cluster Housing */}
      <div className="relative w-full max-w-md border-[6px] border-zinc-900 rounded-sm bg-[#080808] shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_30px_rgba(0,0,0,1)] flex flex-col p-4 h-full max-h-[620px]">
        
        {/* CRT Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
        
        <div className="relative flex-1 flex flex-col justify-between">
          
          {/* Speedometer Section */}
          <div className="relative w-full h-52 flex flex-col items-center justify-center">
            <svg width="320" height="160" viewBox="0 0 320 160" className="absolute top-0 overflow-visible">
              {renderGraduations()}
              
              {/* Background Track - Enlarged */}
              <path 
                d="M 25 150 A 135 135 0 0 1 295 150" 
                fill="none" 
                stroke="#111" 
                strokeWidth="16" 
                strokeLinecap="butt"
              />
              
              {/* Active Speed Bar - Enlarged */}
              <path 
                d="M 25 150 A 135 135 0 0 1 295 150" 
                fill="none" 
                stroke={isChiming ? "#f97316" : "#00ffcc"} 
                strokeWidth="16" 
                strokeLinecap="butt"
                strokeDasharray="424"
                strokeDashoffset={424 - (speedPercent * 4.24)}
                className="transition-all duration-300 ease-out"
                style={{ filter: isChiming ? 'drop-shadow(0 0 12px #f97316)' : 'drop-shadow(0 0 12px #00ffcc)' }}
              />
            </svg>

            {/* Digital Speed Readout */}
            <div className="flex flex-col items-center z-30 mt-10">
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-8xl font-black tracking-tighter tabular-nums leading-none italic transition-all duration-150",
                  isChiming ? "text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.9)]" : "text-[#00ffcc] drop-shadow-[0_0_20px_rgba(0,255,204,0.8)]"
                )}>
                  {displaySpeed}
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-800 italic leading-none">KM/H</span>
                  <span className="text-[8px] font-bold text-zinc-900 tracking-tighter">DIGITAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Displays */}
          <div className="flex justify-between items-end px-2 -mt-2">
            {/* Left: VFD Style Temp & Trip */}
            <div className="flex flex-col gap-3">
              <div className="bg-zinc-950/50 p-2 border border-zinc-900 rounded-sm min-w-[100px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[7px] text-zinc-700 font-black uppercase tracking-[0.2em]">OAT TEMP</div>
                  <Radio size={8} className={cn("text-zinc-800", temp !== null && "text-orange-500 animate-pulse")} />
                </div>
                <div className="text-2xl font-black text-[#00ffcc]/70 tabular-nums italic leading-none drop-shadow-[0_0_8px_rgba(0,255,204,0.4)]">
                  {temp !== null ? `${temp}°C` : '--°C'}
                </div>
                <div className="text-[6px] text-zinc-800 font-bold mt-1 tracking-tighter truncate">
                  {station}
                </div>
              </div>
              <div className="bg-zinc-950/50 p-2 border border-zinc-900 rounded-sm min-w-[100px]">
                <div className="text-[7px] text-zinc-700 font-black uppercase tracking-[0.2em] mb-1">TRIP METER</div>
                <div className="text-2xl font-black text-zinc-500 tabular-nums italic leading-none">
                  {tripDistance.toFixed(1)}<span className="text-[10px] ml-1">km</span>
                </div>
              </div>
            </div>

            {/* Right: Retro Warning Lights */}
            <div className="grid grid-cols-2 gap-1">
              <div className={cn(
                "w-10 h-8 border flex items-center justify-center transition-all duration-300",
                error ? "bg-orange-950/30 border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-zinc-950 border-zinc-900 text-zinc-900"
              )}>
                <WifiOff size={16} strokeWidth={3} />
              </div>
              <div className={cn(
                "w-10 h-8 border flex items-center justify-center transition-all duration-300",
                isChiming ? "bg-orange-950/50 border-orange-600 text-orange-600 animate-pulse shadow-[0_0_15px_rgba(234,88,12,0.5)]" : "bg-zinc-950 border-zinc-900 text-zinc-900"
              )}>
                <AlertTriangle size={16} strokeWidth={3} />
              </div>
              <div className="w-10 h-8 border border-zinc-900 bg-zinc-950 flex items-center justify-center text-zinc-900">
                <Zap size={16} strokeWidth={3} />
              </div>
              <div className="w-10 h-8 border border-zinc-900 bg-zinc-950 flex items-center justify-center text-zinc-900">
                <Beaker size={16} strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="mt-6 border-t-2 border-zinc-900 pt-6 pb-2">
            {isSimulating ? (
              <div className="space-y-4 bg-zinc-900/10 p-4 rounded-sm border border-zinc-900/50">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-black">SIMULATION VELOCITY</label>
                  <span className="text-xl font-black text-[#00ffcc] tabular-nums italic">{simSpeed}</span>
                </div>
                <Slider 
                  value={[simSpeed]} 
                  onValueChange={(val) => setSimSpeed(val[0])} 
                  max={140} 
                  step={1}
                  className="py-2"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setIsSimulating(false)}
                  className="w-full border-zinc-800 bg-zinc-900/20 text-zinc-500 text-[9px] uppercase tracking-[0.4em] font-black h-10 hover:bg-zinc-800 hover:text-zinc-300"
                >
                  TERMINATE SIM
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                  <button
                    onClick={isActive ? stopTracking : startTracking}
                    className={cn(
                      "group relative w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 active:scale-90 bg-[#0a0a0a] shadow-2xl",
                      isActive 
                        ? "border-orange-600 shadow-[0_0_25px_rgba(234,88,12,0.4)]" 
                        : "border-zinc-800"
                    )}
                  >
                    <Power size={28} className={cn("mb-1 transition-colors", isActive ? "text-orange-500" : "text-zinc-800")} />
                    <span className={cn(
                      "text-[7px] font-black uppercase tracking-widest transition-colors",
                      isActive ? "text-orange-500" : "text-zinc-800"
                    )}>
                      IGNITION
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select onValueChange={setModel} defaultValue={model}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-900 text-zinc-600 h-12 rounded-sm text-[9px] uppercase tracking-[0.2em] font-black focus:ring-0">
                      <SelectValue placeholder="VEHICLE" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-500">
                      <SelectItem value="PEUGEOT 208">208 GT-APEX</SelectItem>
                      <SelectItem value="VOLKSWAGEN SHARAN">SHARAN GTV</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => setIsSimulating(true)}
                      className="flex-1 h-12 bg-zinc-900/30 text-zinc-700 border border-zinc-900 rounded-sm hover:bg-zinc-800"
                    >
                      <Beaker size={18} />
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleToggleMute}
                      className="flex-1 h-12 bg-zinc-900/30 text-zinc-700 border border-zinc-900 rounded-sm hover:bg-zinc-800"
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div className="flex justify-between items-center px-2 pt-4 border-t border-zinc-900/30">
            <div className="text-[9px] text-zinc-800 font-black tracking-[0.2em] italic">
              {model} <span className="text-zinc-900 ml-1">TWIN CAM 16</span>
            </div>
            <div className="text-[9px] text-zinc-900 font-black tracking-[0.3em]">
              TOYOTA MOTOR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AE86Dashboard;