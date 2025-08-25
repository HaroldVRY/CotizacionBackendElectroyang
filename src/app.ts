import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { serverConfig } from './config';
import { database } from './database/connection';

// Importar rutas
import clienteRoutes from './routes/clienteRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import servicioRoutes from './routes/servicioRoutes';
import cotizacionRoutes from './routes/cotizacionRoutes';

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Middlewares de parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Archivos estáticos - servir desde src/public
app.use('/public', express.static('src/public'));
app.use(express.static('src/public'));

// Middleware para conectar a la base de datos
app.use(async (req, res, next) => {
  try {
    await database.connect();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Rutas de la API
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: serverConfig.environment === 'development' ? err.message : 'Error interno'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

const PORT = serverConfig.port;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Ambiente: ${serverConfig.environment}`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await database.disconnect();
  process.exit(0);
});