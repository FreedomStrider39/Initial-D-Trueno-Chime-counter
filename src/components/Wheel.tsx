"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface WheelProps {
  className?: string;
}

const Wheel = ({ className }: WheelProps) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]", className)}
    >
      {/* Outer Rim */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#333" strokeWidth="4" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      
      {/* Inner Hub */}
      <circle cx="50" cy="50" r="12" fill="#222" />
      <circle cx="50" cy="50" r="10" fill="#111" />
      
      {/* Spokes (RS Watanabe style - 8 spokes) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path
          key={angle}
          d="M 50 40 L 46 15 Q 50 12 54 15 L 50 40"
          fill="#2a2a2a"
          transform={`rotate(${angle} 50 50)`}
          className="stroke-[#333] stroke-[0.5]"
        />
      ))}
      
      {/* Lug Nuts */}
      {[0, 90, 180, 270].map((angle) => (
        <circle
          key={angle}
          cx="50"
          cy="44"
          r="1.5"
          fill="#444"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      
      {/* Center Cap */}
      <circle cx="50" cy="50" r="4" fill="#000" />
    </svg>
  );
};

export default Wheel;