"use client";
import { useState, useEffect, useRef } from 'react';
import { chime } from '@/utils/audio';
import { showSuccess, showError } from '@/utils/toast';

export const useSpeedTracker = (thresholdKmH: number = 100, hysteresisLow: number = 95) => {
  const [speed, setSpeed] = useState<number>(0);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChiming, setIsChiming] = useState<boolean>(false);
  const [tripDistance, setTripDistance] = useState<number>(0);

  const watchId = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const lastPositionRef = useRef<GeolocationCoordinates | null>(null);
  const isChimingRef = useRef<boolean>(false); // Fix stale closure

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported");
      return;
    }
    setIsActive(true);
    setTripDistance(0);
    lastPositionRef.current = null;
    isChimingRef.current = false;
    showSuccess("Takumi Mode Activated");

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();

        // Skip low-accuracy readings (worse than 25 metres)
        if (position.coords.accuracy > 25) return;

        const currentSpeedMs = position.coords.speed || 0;
        const currentSpeedKmH = Math.round(currentSpeedMs * 3.6);

        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // Trip distance calculation
        if (lastPositionRef.current) {
          const dist = calculateDistance(
            lastPositionRef.current.latitude,
            lastPositionRef.current.longitude,
            position.coords.latitude,
            position.coords.longitude
          );
          if (dist > 0.001) {
            setTripDistance(prev => prev + dist);
          }
        }
        lastPositionRef.current = position.coords;

        // Use ref to avoid stale closure bug
        if (currentSpeedKmH >= thresholdKmH) {
          if (!isChimingRef.current) {
            chime.start();
            isChimingRef.current = true;
            setIsChiming(true);
          }
        } else if (currentSpeedKmH < hysteresisLow) {
          if (isChimingRef.current) {
            chime.stop();
            isChimingRef.current = false;
            setIsChiming(false);
          }
        }

        // UI throttle to 500ms
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
        enableHighAccuracy: true,
        maximumAge: 0,   // Always demand a fresh reading
        timeout: 10000,
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
    setCoords(null);
    isChimingRef.current = false;
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

  return { speed, coords, isActive, isChiming, error, tripDistance, startTracking, stopTracking };
};
