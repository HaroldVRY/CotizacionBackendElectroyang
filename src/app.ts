import express from 'express';
import * as bodyParser from 'body-parser';
import { renderMain } from './report-templates/main/main';
import { renderHeader } from './report-templates/header/header';
import { renderCierre } from './report-templates/cierre/cierre';
import { renderFooter } from './report-templates/footer/footer';
import { EmpresaInfo } from './types/index';

const app = express();
// const reportService = new ReportService();

app.use(bodyParser.json());
app.use(express.static('public'));

const empresaInfo: EmpresaInfo = {
  nombre: 'ELECTROYANG',
  servicio: 'SERVICIO DE BOBINADO DE TRANSFORMADORES ELÉCTRICOS Y REPARACIONES',
  ciudad: 'Lima'
};

app.post('/api/generar-reporte', async (req, res) => {
  try {
    const cotizacionData = req.body;
    
    // Validación básica
    if (!cotizacionData?.cliente || !cotizacionData?.items?.length) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }


    // Aquí puedes agregar lógica para calcular totales y formatear los datos si es necesario
    // Por ejemplo, agregar precioTotalFormatted, totalFormatted, etc.

    // Renderizar el HTML completo del reporte
    const html = renderMain(empresaInfo, cotizacionData, 1, 1); // page y pages pueden ser calculados si usas paginación

    // Aquí puedes guardar el HTML como PDF usando html-pdf o similar, o devolver el HTML directamente
    // Por ejemplo, para pruebas puedes devolver el HTML:
    res.send(html);
    // Si quieres guardar como PDF, deberías usar html-pdf aquí y devolver la ruta del archivo generado
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});