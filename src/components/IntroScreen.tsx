"use client";

import React, { useState } from 'react';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isIgniting, setIsIgniting] = useState(false);

  const handleStart = () => {
    setIsIgniting(true);
    
    // Sequence: Shake -> Flash -> Exit
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onStart, 800);
    }, 400);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 transition-all duration-1000 ease-in-out overflow-hidden",
      isExiting ? "opacity-0 scale-[2] pointer-events-none" : "opacity-100 scale-100",
      isIgniting && !isExiting && "animate-[shake_0.4s_infinite]"
    )}>
      {/* Video Background Container */}
      <div className={cn(
        "absolute inset-0 w-full h-full overflow-hidden transition-transform duration-700 ease-in",
        isIgniting ? "scale-150 blur-sm" : "scale-100"
      )}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale-[0.5] contrast-125"
        >
          <source src="/src/assets/intro-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950 opacity-80" />
        <div className="absolute inset-0 bg-zinc-950/20" />
      </div>
      
      {/* White Flash Overlay */}
      <div className={cn(
        "absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300",
        isIgniting ? "opacity-30" : "opacity-0"
      )} />

      <div className={cn(
        "relative flex flex-col items-center w-full max-w-2xl px-6 transition-all duration-500",
        isIgniting ? "scale-90 opacity-50 blur-md" : "scale-100 opacity-100"
      )}>
        
        {/* Title Section */}
        <div className="text-center space-y-2 mb-16">
          <h1 className="text-zinc-400 text-[10px] tracking-[0.8em] uppercase font-mono drop-shadow-lg">
            Initial D / Speed Monitor
          </h1>
          <h2 className="text-white text-6xl font-black tracking-tighter font-mono italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            AE86 <span className="text-orange-500">DRIFT</span>
          </h2>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={isIgniting}
          className="group relative flex flex-col items-center gap-4 transition-all duration-300 active:scale-95"
        >
          <div className="relative">
            <div className={cn(
              "absolute -inset-6 rounded-full blur-2xl transition-all duration-300",
              isIgniting ? "bg-orange-500 opacity-100 scale-150" : "bg-orange-500/20 opacity-100 group-hover:bg-orange-500/40"
            )} />
            <div className={cn(
              "relative w-24 h-24 rounded-full border-2 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm transition-all duration-300",
              isIgniting ? "border-orange-500 scale-110" : "border-zinc-700 group-hover:border-orange-500/50"
            )}>
              <Power className={cn(
                "transition-all duration-300",
                isIgniting ? "text-orange-500 scale-125" : "text-zinc-500 group-hover:text-orange-500"
              )} size={40} />
            </div>
          </div>
          <span className={cn(
            "text-[12px] font-mono tracking-[0.3em] uppercase transition-all duration-300 font-bold",
            isIgniting ? "text-orange-500 translate-y-2" : "text-zinc-400 group-hover:text-white"
          )}>
            {isIgniting ? "IGNITING..." : "Ignition"}
          </span>
        </button>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-12 text-[10px] text-zinc-600 font-mono tracking-[0.5em] uppercase">
        Fujiwara Tofu Shop (Private Use)
      </div>

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, 2px); }
          100% { transform: translate(0, 0); }
        }
      `}} />
    </div>
  );
};

export default IntroScreen;