"use client";

import React, { useState } from 'react';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onStart, 800);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 transition-all duration-1000 ease-in-out overflow-hidden",
      isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
    )}>
      {/* Background Speed Lines - Static */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
      
      <div className="relative flex flex-col items-center w-full max-w-2xl px-6">
        
        {/* AE86 Image Container - Static */}
        <div className="relative w-full aspect-video mb-8">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-zinc-800/50 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <img 
              src="/src/assets/ae86-drift.png" 
              alt="AE86" 
              className="w-full h-full object-cover"
            />
            {/* Subtle Headlight Glow */}
            <div className="absolute top-[45%] right-[15%] w-24 h-24 bg-yellow-500/10 blur-3xl rounded-full" />
            <div className="absolute top-[45%] right-[35%] w-24 h-24 bg-yellow-500/10 blur-3xl rounded-full" />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2 mb-12">
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
          className="group relative flex flex-col items-center gap-4 transition-all duration-300 active:scale-95"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors" />
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
    </div>
  );
};

export default IntroScreen;