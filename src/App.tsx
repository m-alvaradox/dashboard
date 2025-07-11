import { useState } from 'react';
import { Grid } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';

// Tipo restringido para los nombres de ciudades
type CityName = 'guayaquil' | 'quito' | 'manta' | 'cuenca';

// Coordenadas por ciudad
const cityCoordinates: Record<CityName, { lat: number; lon: number }> = {
  guayaquil: { lat: -2.1962, lon: -79.8862 },
  quito: { lat: -0.1807, lon: -78.4678 },
  manta: { lat: -0.9677, lon: -80.7089 },
  cuenca: { lat: -2.9006, lon: -79.0045 },
};

function App() {
  const [selectedCity, setSelectedCity] = useState<CityName>('guayaquil');
  const coords = cityCoordinates[selectedCity];

  const dataFetcherOutput = DataFetcher(coords.lat, coords.lon);

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size = { {xs:12, md:12} }>
        <HeaderUI />
      </Grid>

      {/* Alerta */}
      <Grid container justifyContent="right" alignItems="center">
        <AlertUI description="No se prevén lluvias" />
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}>
        <SelectorUI onCityChange={setSelectedCity} />
      </Grid>

      {/* Estado de carga o error */}
      {dataFetcherOutput.loading && (
        <Grid>
          <p>Cargando datos...</p>
        </Grid>
      )}
      {dataFetcherOutput.error && (
        <Grid>
          <p>Error: {dataFetcherOutput.error}</p>
        </Grid>
      )}

      {/* Indicadores dinámicos con datos reales */}
      {dataFetcherOutput.data && (
        <Grid container size={{ xs: 12, md: 9 }} >
          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Temperatura (2m)'
              description={`${dataFetcherOutput.data.current.temperature_2m} ${dataFetcherOutput.data.current_units.temperature_2m}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Temperatura aparente'
              description={`${dataFetcherOutput.data.current.apparent_temperature} ${dataFetcherOutput.data.current_units.apparent_temperature}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Velocidad del viento'
              description={`${dataFetcherOutput.data.current.wind_speed_10m} ${dataFetcherOutput.data.current_units.wind_speed_10m}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Humedad relativa'
              description={`${dataFetcherOutput.data.current.relative_humidity_2m} ${dataFetcherOutput.data.current_units.relative_humidity_2m}`}
            />
          </Grid>
        </Grid>
      )}

      {/* Gráfico */}
      <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
        <ChartUI
          labels={dataFetcherOutput.data?.hourly?.time.slice(0, 25) ?? []}
          values1={dataFetcherOutput.data?.hourly?.temperature_2m.slice(0, 25) ?? []}
          values2={dataFetcherOutput.data?.hourly?.wind_speed_10m.slice(0, 25) ?? []}
          units1={dataFetcherOutput.data?.hourly_units?.temperature_2m ?? ''}
          units2={dataFetcherOutput.data?.hourly_units?.wind_speed_10m ?? ''}
          loading={dataFetcherOutput.loading}
          error={dataFetcherOutput.error}
        />
      </Grid>

      {/* Tabla */}
      <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
        <TableUI
          labels={dataFetcherOutput.data?.hourly?.time ?? []}
          values1={dataFetcherOutput.data?.hourly?.temperature_2m ?? []}
          values2={dataFetcherOutput.data?.hourly?.wind_speed_10m ?? []}
          units1={dataFetcherOutput.data?.hourly_units?.temperature_2m ?? ''}
          units2={dataFetcherOutput.data?.hourly_units?.wind_speed_10m ?? ''}
          loading={dataFetcherOutput.loading}
          error={dataFetcherOutput.error}
        />
      </Grid>

      {/* Información adicional */}
      <Grid>
        <p>Elemento: Información adicional</p>
      </Grid>
    </Grid>
  );
}

export default App;

