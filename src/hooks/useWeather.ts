"use client";
import { useState, useEffect } from 'react';

export const useWeather = (lat?: number, lon?: number) => {
  const [temp, setTemp] = useState<number | null>(null);
  const [station, setStation] = useState<string>("SEARCHING...");

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    const fetchWeather = async () => {
      try {
        // Updated Open-Meteo API format with current conditions
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=kmh&timeformat=unixtime`
        );
        const data = await response.json();

        if (data.current) {
          setTemp(Math.round(data.current.temperature_2m));

          // Build a station label from actual coordinates
          const latDir = lat >= 0 ? 'N' : 'S';
          const lonDir = lon >= 0 ? 'E' : 'W';
          const latStr = Math.abs(lat).toFixed(2);
          const lonStr = Math.abs(lon).toFixed(2);
          setStation(`OPEN-METEO ${latStr}°${latDir} ${lonStr}°${lonDir}`);
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setStation("STATION OFFLINE");
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Every 10 minutes
    return () => clearInterval(interval);
  }, [lat, lon]);

  return { temp, station };
};
