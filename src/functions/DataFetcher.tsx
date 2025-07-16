import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const STORAGE_KEY = 'openMeteoData';
const EXPIRATION_MINUTES = 10; 

export default function DataFetcher(): DataFetcherOutput {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;

        // Función para verificar si los datos almacenados siguen vigentes
        const isDataValid = (timestamp: number) => {
            const now = Date.now();
            const diffMinutes = (now - timestamp) / 1000 / 60;
            return diffMinutes < EXPIRATION_MINUTES;
        };

        const fetchData = async () => {
            setLoading(true);

            // Intentar obtener datos del localStorage
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                try {
                    const { data: cachedData, timestamp } = JSON.parse(cached);
                    if (isDataValid(timestamp)) {
                        setData(cachedData);
                        setLoading(false);
                        return; // Usar datos en caché si son válidos
                    }
                } catch {
                    // Si hay error al parsear, ignorar y continuar
                }
            }

            // Si no hay datos válidos en caché, llamar a la API
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }
                const result: OpenMeteoResponse = await response.json();
                setData(result);
                // Guardar en localStorage con timestamp
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    data: result,
                    timestamp: Date.now()
                }));
            } catch (err: any) {
                // Si falla la API, intentar usar datos viejos si existen
                if (cached) {
                    try {
                        const { data: cachedData } = JSON.parse(cached);
                        setData(cachedData);
                        setError("No se pudo actualizar, mostrando datos almacenados.");
                    } catch {
                        setError("Ocurrió un error al obtener los datos almacenados.");
                    }
                } else {
                    setError(err instanceof Error ? err.message : "Ocurrió un error desconocido al obtener los datos.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
}
