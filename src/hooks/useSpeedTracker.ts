"use client";

import { useState, useEffect, useRef } from 'react';
import { chime } from '@/utils/audio';
import { showSuccess, showError } from '@/utils/toast';

export const useSpeedTracker = (thresholdKmH: number = 105, hysteresisLow: number = 100) => {
  const [speed, setSpeed] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChiming, setIsChiming] = useState<boolean>(false);
  const watchId = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported");
      return;
    }

    setIsActive(true);
    showSuccess("Takumi Mode Activated");

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const currentSpeedMs = position.coords.speed || 0;
        const currentSpeedKmH = Math.round(currentSpeedMs * 3.6);
        setSpeed(currentSpeedKmH);

        // Hysteresis Logic
        if (currentSpeedKmH >= thresholdKmH) {
          chime.start();
          setIsChiming(true);
        } else if (currentSpeedKmH < hysteresisLow) {
          chime.stop();
          setIsChiming(false);
        }
      },
      (err) => {
        setError(err.message);
        // Don't show toast for every error to keep it "invisible"
        console.error("GPS Error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
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