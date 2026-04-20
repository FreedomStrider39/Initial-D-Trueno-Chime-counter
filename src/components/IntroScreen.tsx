"use client";

import React, { useState } from 'react';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import introVideo from '@/assets/intro-video.mp4';
import driftImage from '@/assets/ae86-drift.png';

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
      {/* Background Video Container */}
      <div className={cn(
        "absolute inset-0 w-full h-full overflow-hidden transition-transform duration-700 ease-in",
        isIgniting ? "scale-150 blur-sm" : "scale-100"
      )}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.2] contrast-125"
          poster={driftImage}
        >
          <source src={introVideo} type="video/mp4" />
        </video>
        
        {/* Overlay Gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950 opacity-90" />
        <div className="absolute inset-0 bg-zinc-950/30" />
      </div>
      
      {/* White Flash Overlay */}
      <div className={cn(
        "absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300",
        isIgniting ? "opacity-40" : "opacity-0"
      )} />

      <div className={cn(
        "relative flex flex-col items-center w-full max-w-2xl px-6 transition-all duration-500",
        isIgniting ? "scale-90 opacity-50 blur-md" : "scale-100 opacity-100"
      )}>
        
        {/* Title Section */}
        <div className="text-center space-y-2 mb-12 md:mb-16">
          <h1 className="text-zinc-300 text-[10px] md:text-[12px] tracking-[0.6em] md:tracking-[0.8em] uppercase font-mono drop-shadow-2xl font-bold">
            Retro Speed Warning System
          </h1>
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter font-mono italic drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            TOYOTA <span className="text-orange-500">CHIME</span>
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
              "absolute -inset-6 md:-inset-8 rounded-full blur-3xl transition-all duration-300",
              isIgniting ? "bg-orange-500 opacity-100 scale-150" : "bg-orange-500/30 opacity-100 group-hover:bg-orange-500/50"
            )} />
            <div className={cn(
              "relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 flex items-center justify-center bg-zinc-900/90 backdrop-blur-md transition-all duration-300",
              isIgniting ? "border-orange-500 scale-110" : "border-zinc-600 group-hover:border-orange-500/70"
            )}>
              <Power className={cnthink
The previous response was cut off in the middle of a `dyad-write` block for `src/components/IntroScreen.tsx`. I need to complete that file and then check if any other files need updating based on the user's request to "remove AE86 drift. put Toyota speed chime app ro something".

Looking at the previous partial output:
```tsx
              <Power className={cn
```
I need to finish the `IntroScreen.tsx` file and then check `AE86Dashboard.tsx` and `Index.tsx` for any remaining "AE86 Drift" or "AE86" branding that should be updated to "Toyota Speed Chime".

Wait, the user specifically said "remove AE86 drift. put Toyota speed chime app ro something".
In `IntroScreen.tsx`, I was changing:
`AE86 DRIFT` -> `TOYOTA CHIME`
`Initial D / Speed Monitor` -> `Retro Speed Warning System`

I should also check `AE86Dashboard.tsx`. It has `model` state defaulting to `SPRINTER TRUENO AE86`. The user didn't explicitly say to change the car models, just the app branding.

Let's finish `IntroScreen.tsx` first.

Then I'll check `index.html` and `public/manifest.json` which also have "AE86" in them.

Actually, the user's prompt was "remove AE86 drift. put Toyota speed chime app ro something".
I will update:
1. `src/components/IntroScreen.tsx` (finish it)
2. `index.html` (title)
3. `public/manifest.json` (name/short_name)
4. `src/pages/Index.tsx` (maybe just check)

Let's resume `IntroScreen.tsx`.(
                "transition-all duration-300",
                isIgniting ? "text-orange-500 scale-125" : "text-zinc-400 group-hover:text-orange-500"
              )} size={40} />
            </div>
          </div>
          <span className={cn(
            "text-[12px] md:text-[14px] font-mono tracking-[0.4em] uppercase transition-all duration-300 font-black",
            isIgniting ? "text-orange-500 translate-y-2" : "text-zinc-300 group-hover:text-white"
          )}>
            {isIgniting ? "IGNITING..." : "Ignition"}
          </span>
        </button>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-8 md:bottom-12 text-[10px] md:text-[12px] text-zinc-400 font-mono tracking-[0.4em] md:tracking-[0.6em] uppercase text-center px-4 font-bold">
        Fujiwara Tofu Shop (Private Use)
      </div>

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(3px, -3px); }
          50% { transform: translate(-3px, 3px); }
          75% { transform: translate(3px, 3px); }
          100% { transform: translate(0, 0); }
        }
      `}} />
    </div>
  );
};

export default IntroScreen;