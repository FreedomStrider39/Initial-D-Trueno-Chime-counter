"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isArrived, setIsArrived] = useState(false);

  useEffect(() => {
    // Trigger the "arrival" animation after a short delay
    const timer = setTimeout(() => setIsArrived(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onStart, 800);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 transition-all duration-1000 ease-in-out overflow-hidden",
      isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
    )}>
      {/* Background Speed Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-[pulse_2s_infinite]" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-[pulse_3s_infinite]" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-[pulse_1.5s_infinite]" />
      </div>
      
      <div className="relative flex flex-col items-center w-full max-w-2xl px-6">
        
        {/* Drifting AE86 Image Container */}
        <div className={cn(
          "relative w-full aspect-video mb-8 transition-all duration-1000 ease-out transform",
          isArrived 
            ? "translate-x-0 rotate-0 opacity-100" 
            : "translate-x-[120%] -rotate-12 opacity-0"
        )}>
          {/* Tire Smoke Effects */}
          <div className={cn(
            "absolute -bottom-4 -left-4 w-32 h-16 bg-white/10 blur-2xl rounded-full transition-opacity duration-1000",
            isArrived ? "opacity-100 animate-pulse" : "opacity-0"
          )} />
          <div className={cn(
            "absolute -bottom-4 -right-4 w-32 h-16 bg-white/10 blur-2xl rounded-full transition-opacity duration-1000",
            isArrived ? "opacity-100 animate-pulse delay-300" : "opacity-0"
          )} />

          {/* The Car Image with "Drifting on the spot" vibration */}
          <div className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden border-2 border-zinc-800/50 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
            isArrived && "animate-[wiggle_0.15s_ease-in-out_infinite]"
          )}>
            <img 
              src="/src/assets/ae86-drift.png" 
              alt="AE86 Drifting" 
              className="w-full h-full object-cover"
            />
            {/* Headlight Glow */}
            <div className="absolute top-[45%] right-[15%] w-24 h-24 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute top-[45%] right-[35%] w-24 h-24 bg-yellow-500/20 blur-3xl rounded-full animate-pulse delay-75" />
          </div>
        </div>

        {/* Title Section */}
        <div className={cn(
          "text-center space-y-2 mb-12 transition-all duration-700 delay-500",
          isArrived ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <h1 className="text-zinc-500 text-[10px] tracking-[0.8em] uppercase font-mono">
            Initial D / Speed Monitor
          </h1>
          <h2 className="text-white text-5xl font-black tracking-tighter font-mono italic">
            AE86 <span className="text-orange-500">DRIFT</span>
          </h2>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className={cn(
            "group relative flex flex-col items-center gap-4 transition-all duration-700 delay-700 active:scale-95",
            isArrived ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/40 transition-colors" />
            <div className="relative w-20 h-20 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-zinc-900 group-hover:border-orange-500/50 transition-colors">
              <Power className="text-zinc-600 group-hover:text-orange-500 transition-colors" size={32} />
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase group-hover:text-zinc-300 transition-colors">
            Ignition
          </span>
        </button>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-12 text-[8px] text-zinc-700 font-mono tracking-[0.4em] uppercase">
        Fujiwara Tofu Shop (Private Use)
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wiggle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(1px, 1px) rotate(0.1deg); }
          50% { transform: translate(-1px, 0px) rotate(-0.1deg); }
          75% { transform: translate(1px, -1px) rotate(0.1deg); }
        }
      `}} />
    </div>
  );
};

export default IntroScreen;