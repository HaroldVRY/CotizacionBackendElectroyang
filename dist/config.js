"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportConfig = exports.empresaConfig = exports.serverConfig = exports.dbConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbConfig = {
    host: process.env.DB_HOST || 'db.dgilpqompmbcfcjtpeme.supabase.co',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'harolmazna123',
    database: process.env.DB_NAME || 'postgres'
};
exports.serverConfig = {
    port: parseInt(process.env.PORT || '3001', 10),
    environment: process.env.NODE_ENV || 'development'
};
exports.empresaConfig = {
    nombre: 'ELECTROYANG',
    servicio: 'SERVICIO DE BOBINADO DE TRANSFORMADORES ELÉCTRICOS Y REPARACIONES',
    ciudad: 'Lima',
    cuentasBancarias: {
        bcp: {
            corriente: '123-456789-0-12',
            interbancaria: '002-123-001234567890-12'
        }
    }
};
exports.reportConfig = {
    defaultCurrency: 'PEN',
    dateFormat: {
        locale: 'es-PE',
        options: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    }
    // Nota: La configuración de PDF se maneja en el servicio externo de reportes
};
