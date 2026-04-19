"use client";

import React, { useState, useEffect } from 'react';
import Wheel from './Wheel';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onStart, 800);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 transition-all duration-1000 ease-in-out",
      isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
    )}>
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className={cn(
        "relative flex flex-col items-center transition-all duration-1000 delay-300",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        {/* Spinning Wheel Container */}
        <div className="relative w-48 h-48 mb-12">
          <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full animate-pulse" />
          <div className="animate-[spin_8s_linear_infinite]">
            <Wheel />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-zinc-500 text-[10px] tracking-[0.8em] uppercase font-mono">
            Project D / Speed Warning
          </h1>
          <h2 className="text-white text-4xl font-black tracking-tighter font-mono italic">
            AE86 <span className="text-orange-500">CHIME</span>
          </h2>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="group relative flex flex-col items-center gap-4 transition-transform active:scale-95"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/40 transition-colors" />
            <div className="relative w-20 h-20 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-zinc-900 group-hover:border-orange-500/50 transition-colors">
              <Power className="text-zinc-600 group-hover:text-orange-500 transition-colors" size={32} />
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase group-hover:text-zinc-300 transition-colors">
            Initialize System
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