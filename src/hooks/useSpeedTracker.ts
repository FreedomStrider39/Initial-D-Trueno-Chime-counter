"use client";

import { useState, useEffect, useRef } from 'react';
import { chime } from '@/utils/audio';
import { showSuccess, showError } from '@/utils/toast';

export const useSpeedTracker = (thresholdKmH: number = 100, hysteresisLow: number = 95) => {
  const [speed, setSpeed] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChiming, setIsChiming] = useState<boolean>(false);
  const watchId = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const startTracking = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported");
      return;
    }

    setIsActive(true);
    showSuccess("Takumi Mode Activated");

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        // Throttle UI updates to 2Hz (every 500ms) to save battery, 
        // but keep logic processing for the chime real-time
        const currentSpeedMs = position.coords.speed || 0;
        const currentSpeedKmH = Math.round(currentSpeedMs * 3.6);

        // Logic processing (Must be real-time for safety/accuracy)
        if (currentSpeedKmH >= thresholdKmH) {
          if (!isChiming) {
            chime.start();
            setIsChiming(true);
          }
        } else if (currentSpeedKmH < hysteresisLow) {
          if (isChiming) {
            chime.stop();
            setIsChiming(false);
          }
        }

        // UI Throttling
        if (now - lastUpdateRef.current > 500) {
          setSpeed(currentSpeedKmH);
          lastUpdateRef.current = now;
        }
      },
      (err) => {
        setError(err.message);
        console.error("GPS Error:", err.message);
      },
      {
        enableHighAccuracy: true, // Required for speed
        maximumAge: 1000,         // Allow 1s old data to reduce GPS hardware wake-ups
        timeout: 10000
      }
    );
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsActive(false);
    setSpeed(0);
    setIsChiming(false);
    chime.stop();
    showSuccess("Takumi Mode Deactivated");
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      chime.stop();
    };
  }, []);

  return { speed, isActive, isChiming, error, startTracking, stopTracking };
};