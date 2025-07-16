import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

const CACHE_EXPIRATION_MINUTES = 10;

export default function DataFetcher(lat: number, lon: number): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `weather_${lat}_${lon}`;

  useEffect(() => {
    const fetchData = async () => {
      let cached: string | null = null;
      try {
        setLoading(true);

        // 1. Verificamos si hay cache válida
        cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data: cachedData } = JSON.parse(cached);
          const ageMinutes = (Date.now() - timestamp) / 1000 / 60;

          if (ageMinutes < CACHE_EXPIRATION_MINUTES) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }

        // 2. Hacemos fetch si no hay cache o si expiró
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const result: OpenMeteoResponse = await response.json();
        setData(result);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data: result
          })
        );
      } catch (err: any) {
        // 3. Si hay error, tratamos de usar datos cache aunque estén viejos
        if (cached) {
          const { data: cachedData } = JSON.parse(cached);
          setData(cachedData);
        } else {
          setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon]);

  return { data, loading, error };
}

