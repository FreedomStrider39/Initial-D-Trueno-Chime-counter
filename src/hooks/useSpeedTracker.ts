"use client";
import { useState, useEffect, useRef } from 'react';
import { chime } from '@/utils/audio';
import { showSuccess, showError } from '@/utils/toast';

export type GpsStatus = 'idle' | 'searching' | 'poor' | 'locked';

const SMOOTHING_WINDOW = 4; // Average over last 4 readings

export const useSpeedTracker = (thresholdKmH: number = 100, hysteresisLow: number = 95) => {
  const [speed, setSpeed] = useState<number>(0);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChiming, setIsChiming] = useState<boolean>(false);
  const [tripDistance, setTripDistance] = useState<number>(0);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');

  const watchId = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const lastPositionRef = useRef<GeolocationCoordinates | null>(null);
  const isChimingRef = useRef<boolean>(false);
  const speedBufferRef = useRef<number[]>([]);

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

  const getSmoothedSpeed = (rawSpeed: number): number => {
    speedBufferRef.current.push(rawSpeed);
    if (speedBufferRef.current.length > SMOOTHING_WINDOW) {
      speedBufferRef.current.shift();
    }
    const sum = speedBufferRef.current.reduce((a, b) => a + b, 0);
    return Math.round(sum / speedBufferRef.current.length);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported");
      return;
    }
    setIsActive(true);
    setTripDistance(0);
    setGpsStatus('searching');
    speedBufferRef.current = [];
    lastPositionRef.current = null;
    isChimingRef.current = false;
    showSuccess("Takumi Mode Activated");

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        const accuracy = position.coords.accuracy;

        // Update GPS status and skip poor readings
        if (accuracy <= 25) {
          setGpsStatus('locked');
        } else {
          setGpsStatus('poor');
          return;
        }

        const rawSpeedKmH = (position.coords.speed || 0) * 3.6;
        const smoothedSpeedKmH = getSmoothedSpeed(rawSpeedKmH);

        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

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

        // Chime logic via ref — no stale closure
        if (smoothedSpeedKmH >= thresholdKmH) {
          if (!isChimingRef.current) {
            chime.start();
            isChimingRef.current = true;
            setIsChiming(true);
          }
        } else if (smoothedSpeedKmH < hysteresisLow) {
          if (isChimingRef.current) {
            chime.stopGracefully(); // Let current chime finish naturally
            isChimingRef.current = false;
            setIsChiming(false);
          }
        }

        if (now - lastUpdateRef.current > 500) {
          setSpeed(smoothedSpeedKmH);
          lastUpdateRef.current = now;
        }
      },
      (err) => {
        setError(err.message);
        setGpsStatus('poor');
        console.error("GPS Error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
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
    setGpsStatus('idle');
    isChimingRef.current = false;
    setIsChiming(false);
    speedBufferRef.current = [];
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

  return { speed, coords, isActive, isChiming, error, tripDistance, gpsStatus, startTracking, stopTracking };
};
