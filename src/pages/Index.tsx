"use client";

import AE86Dashboard from "@/components/AE86Dashboard";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AE86Dashboard />
      <div className="fixed bottom-0 w-full">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;