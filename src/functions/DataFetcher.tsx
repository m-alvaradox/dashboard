import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

export default function DataFetcher(lat: number, lon: number): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const result: OpenMeteoResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon]); // Se vuelve a ejecutar si cambian lat/lon

  return { data, loading, error };
}
