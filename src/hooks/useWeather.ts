"use client";

import { useState, useEffect } from 'react';

export const useWeather = (lat?: number, lon?: number) => {
  const [temp, setTemp] = useState<number | null>(null);
  const [station, setStation] = useState<string>("N/A");
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setStation("OFFLINE");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setStation("OFFLINE");
      return;
    }

    if (lat === undefined || lon === undefined) {
      setStation("N/A");
      return;
    }

    const fetchWeather = async () => {
      try {
        setStation("CONNECTING...");
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemp(Math.round(data.current_weather.temperature));
          setStation("METEO-FRANCE / STN-086");
        } else {
          setStation("N/A");
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setStation("OFFLINE");
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, [lat, lon, isOnline]);

  return { temp, station, isOnline };
};