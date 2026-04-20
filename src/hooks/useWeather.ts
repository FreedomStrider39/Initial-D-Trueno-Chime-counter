"use client";

import { useState, useEffect } from 'react';

export const useWeather = (lat?: number, lon?: number) => {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemp(Math.round(data.current_weather.temperature));
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
      }
    };

    fetchWeather();
    // Update every 10 minutes
    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, [lat, lon]);

  return { temp };
};