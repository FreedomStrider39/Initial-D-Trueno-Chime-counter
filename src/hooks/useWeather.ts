"use client";

import { useState, useEffect } from 'react';

export const useWeather = (lat?: number, lon?: number) => {
  const [temp, setTemp] = useState<number | null>(null);
  const [station, setStation] = useState<string>("SEARCHING...");

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    const fetchWeather = async () => {
      try {
        // Using Open-Meteo which aggregates data from global stations including Meteo France
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemp(Math.round(data.current_weather.temperature));
          setStation("METEO-FRANCE / STN-086");
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setStation("STATION OFFLINE");
      }
    };

    fetchWeather();
    // Update every 10 minutes
    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, [lat, lon]);

  return { temp, station };
};