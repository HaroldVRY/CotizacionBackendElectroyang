import dotenv from 'dotenv';
import { EmpresaInfo } from './types/index';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || 'db.dgilpqompmbcfcjtpeme.supabase.co',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'harolmazna123',
  database: process.env.DB_NAME || 'postgres'
};

export const serverConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  environment: process.env.NODE_ENV || 'development'
};

export const empresaConfig: EmpresaInfo = {
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

export const reportConfig = {
  defaultCurrency: 'PEN',
  dateFormat: {
    locale: 'es-PE',
    options: {
      year: 'numeric' as const,
      month: 'long' as const,
      day: 'numeric' as const
    }
  }
  // Nota: La configuración de PDF se maneja en el servicio externo de reportes
};