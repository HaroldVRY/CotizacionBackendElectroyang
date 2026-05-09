"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const bodyParser = __importStar(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const connection_1 = require("./database/connection");
const swagger_1 = __importDefault(require("./swagger"));
// Importar rutas
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const servicioRoutes_1 = __importDefault(require("./routes/servicioRoutes"));
const cotizacionRoutes_1 = __importDefault(require("./routes/cotizacionRoutes"));
const reporteRoutes_1 = __importDefault(require("./routes/reporteRoutes"));
const app = (0, express_1.default)();
const PORT = config_1.serverConfig.port;
// Middlewares de seguridad
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Middlewares de parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Archivos estáticos - servir desde src/public
app.use('/public', express_1.default.static('src/public'));
app.use(express_1.default.static('src/public'));
// Documentación de Swagger - API Docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Ruta raíz - redireccionar a Swagger
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido a Cotizaciones API - Electroyang',
        version: '1.0.0',
        documentation: `http://localhost:${PORT}/api-docs`,
        endpoints: {
            clientes: '/api/clientes',
            usuarios: '/api/usuarios',
            servicios: '/api/servicios',
            cotizaciones: '/api/cotizaciones',
            reportes: '/api/reportes',
            health: '/api/health'
        }
    });
});
// Middleware para conectar a la base de datos
app.use(async (req, res, next) => {
    try {
        await connection_1.database.connect();
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error de conexión a la base de datos',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
// Rutas de la API
app.use('/api/clientes', clienteRoutes_1.default);
app.use('/api/usuarios', usuarioRoutes_1.default);
app.use('/api/servicios', servicioRoutes_1.default);
app.use('/api/cotizaciones', cotizacionRoutes_1.default);
app.use('/api/reportes', reporteRoutes_1.default);
// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: config_1.serverConfig.environment === 'development' ? err.message : 'Error interno'
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
    console.log(`Ambiente: ${config_1.serverConfig.environment}`);
});
// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('Cerrando servidor...');
    await connection_1.database.disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('Cerrando servidor...');
    await connection_1.database.disconnect();
    process.exit(0);
});
