"use client";

import React, { useState } from 'react';
import AE86Dashboard from "@/components/AE86Dashboard";
import IntroScreen from "@/components/IntroScreen";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {!hasStarted ? (
        <IntroScreen onStart={() => setHasStarted(true)} />
      ) : (
        <div className="animate-in fade-in duration-1000">
          <AE86Dashboard />
          <div className="fixed bottom-0 w-full">
            <MadeWithDyad />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;