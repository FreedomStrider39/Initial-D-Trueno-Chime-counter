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
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=kmh&timeformat=unixtime`
        );
        const data = await response.json();

        if (data.current) {
          setTemp(Math.round(data.current.temperature_2m));

          const latDir = lat >= 0 ? 'N' : 'S';
          const lonDir = lon >= 0 ? 'E' : 'W';
          const latStr = Math.abs(lat).toFixed(2);
          const lonStr = Math.abs(lon).toFixed(2);
          setStation(`OPEN-METEO ${latStr}°${latDir} ${lonStr}°${lonDir}`);
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setStation("OFFLINE");
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Every 10 minutes
    return () => clearInterval(interval);
  }, [lat, lon, isOnline]);

  return { temp, station, isOnline };
};