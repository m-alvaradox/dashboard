import React from 'react';
import { Grid } from '@mui/material';

function App() {
   return (
      <Grid container spacing={5} justifyContent="center" alignItems="center">

         {/* Encabezado */}
         <Grid size = { {xs:12, md:12} }>Elemento: Encabezado</Grid>

         {/* Alertas */}
         <Grid>Elemento: Alertas</Grid>

         {/* Selector */}
         <Grid size = { {xs:12, md:3} }>Elemento: Selector</Grid>

         {/* Indicadores */}
         <Grid size = { {xs:12, md:9} }>Elemento: Indicadores</Grid>

         {/* Gráfico */}
         <Grid>Elemento: Gráfico</Grid>

         {/* Tabla */}
         <Grid>Elemento: Tabla</Grid>

         {/* Información adicional */}
         <Grid>Elemento: Información adicional</Grid>

      </Grid>
   );
}

export default App;
