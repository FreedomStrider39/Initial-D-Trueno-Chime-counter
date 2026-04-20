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
    
    // Sequence: Intensifying shake -> Flash -> Warp Exit
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onStart, 1000);
    }, 800);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 transition-all duration-1000 ease-in-out overflow-hidden",
      isExiting ? "opacity-0 scale-[3] blur-2xl pointer-events-none" : "opacity-100 scale-100",
    )}>
      {/* Background Video Container */}
      <div className={cn(
        "absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 ease-in",
        isIgniting ? "scale-[2] blur-md rotate-1" : "scale-105"
      )}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[0.5] contrast-150"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-night-city-traffic-in-the-rain-3134-large.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950 opacity-90" />
      </div>
      
      {/* Engine Vibration Effect */}
      <div className={cn(
        "relative flex flex-col items-center w-full max-w-2xl px-6 transition-all duration-500",
        isIgniting && "animate-[engine-vibrate_0.1s_infinite]"
      )}>
        
        {/* Title Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-3 py-1 border border-orange-500/30 rounded-full bg-orange-500/5 mb-4">
            <span className="text-orange-500 text-[10px] tracking-[0.5em] uppercase font-black">
              System Ready
            </span>
          </div>
          <h2 className="text-white text-5xl sm:text-7xl font-black tracking-tighter font-mono italic drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            TOYOTA <span className="text-orange-500">CHIME</span>
          </h2>
          <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">
            Precision Speed Monitoring
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={isIgniting}
          className="group relative flex flex-col items-center gap-6 transition-all duration-300 active:scale-90"
        >
          <div className="relative">
            {/* Outer Glows */}
            <div className={cn(
              "absolute -inset-12 rounded-full blur-3xl transition-all duration-700",
              isIgniting ? "bg-orange-500 opacity-100 scale-150 animate-pulse" : "bg-orange-500/20 opacity-0 group-hover:opacity-100"
            )} />
            
            <div className={cn(
              "relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 flex items-center justify-center bg-zinc-900/80 backdrop-blur-xl transition-all duration-500",
              isIgniting ? "border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.5)]" : "border-zinc-800 group-hover:border-orange-500/50"
            )}>
              <Power className={cn(
                "transition-all duration-500",
                isIgniting ? "text-orange-500 scale-125 rotate-12" : "text-zinc-600 group-hover:text-orange-500"
              )} size={48} />
              
              {/* Circular Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100 100"
                  className={cn(
                    "text-orange-500/20 transition-all duration-1000",
                    isIgniting ? "stroke-dashoffset-0" : "stroke-dashoffset-100"
                  )}
                />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className={cn(
              "text-[12px] font-mono tracking-[0.6em] uppercase transition-all duration-500 font-black",
              isIgniting ? "text-orange-500 translate-y-2" : "text-zinc-400 group-hover:text-white"
            )}>
              {isIgniting ? "CRANKING..." : "Ignition"}
            </span>
            {!isIgniting && (
              <span className="text-[8px] text-zinc-600 tracking-widest uppercase animate-pulse">
                Press to start engine
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes engine-vibrate {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2px, -2px) rotate(0.5deg); }
          50% { transform: translate(-2px, 2px) rotate(-0.5deg); }
          75% { transform: translate(2px, 2px) rotate(0.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}} />
    </div>
  );
};

export default IntroScreen;