import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

interface ChartUIProps {
   labels: string[];
   values1: number[];
   values2: number[];
   units1: string;
   units2: string;
   loading: boolean;
   error: string | null;
}


export default function ChartUI({ labels, values1, values2, units1, units2, loading, error }: ChartUIProps) {
   if (loading) return <Typography>Cargando gráfico...</Typography>;
   if (error) return <Typography color="error">Error al cargar el gráfico: {error}</Typography>;
   if (!labels.length) return <Typography>No hay datos para mostrar.</Typography>;
   
   return (
      <>
         <Typography variant="h5" component="div">
            Temperatura ({units1}) y Velocidad del viento ({units2}) por hora
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: values1, label: `Temperatura (${units1})` },
               { data: values2, label: `Viento (${units2})` },
            ]}
            xAxis={[{ scaleType: 'point', data: labels }]}
         />
      </>
   );
}