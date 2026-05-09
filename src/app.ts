import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { serverConfig } from './config';
import { database } from './database/connection';
import swaggerSpec from './swagger';

// Importar rutas
import rolRoutes from './routes/rolRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import funcionalidadRoutes from './routes/funcionalidadRoutes';
import accesoRoutes from './routes/accesoRoutes';
import parametroRoutes from './routes/parametroRoutes';
import maestroRoutes from './routes/maestroRoutes';

const app = express();
const PORT = serverConfig.port;

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Middlewares de parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Archivos estáticos - servir desde src/public
app.use('/public', express.static('src/public'));
app.use(express.static('src/public'));

// Documentación de Swagger - API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a Administración API - Electroyang',
    version: '2.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      roles: '/api/admin/roles',
      usuarios: '/api/admin/usuarios',
      funcionalidades: '/api/admin/funcionalidades',
      accesos: '/api/admin/accesos',
      parametros: '/api/admin/parametros',
      maestros: '/api/admin/maestros',
      health: '/api/health'
    }
  });
});

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

// Rutas de la API - Admin
app.use('/api/admin/roles', rolRoutes);
app.use('/api/admin/usuarios', usuarioRoutes);
app.use('/api/admin/funcionalidades', funcionalidadRoutes);
app.use('/api/admin/accesos', accesoRoutes);
app.use('/api/admin/parametros', parametroRoutes);
app.use('/api/admin/maestros', maestroRoutes);

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} (http://localhost:${PORT})`);
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