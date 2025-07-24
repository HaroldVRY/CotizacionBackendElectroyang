import { Pool, Client } from 'pg';
import { dbConfig } from '../config';

class Database {
  private pool: Pool | null = null;

  async connect(): Promise<Pool> {
    if (!this.pool) {
      try {
        this.pool = new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
        
        // Verificar conexión
        const client = await this.pool.connect();
        client.release();
        
        console.log('Conexión a PostgreSQL establecida');
      } catch (error) {
        console.error('Error conectando a PostgreSQL:', error);
        throw error;
      }
    }
    return this.pool;
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Conexión a PostgreSQL cerrada');
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    const pool = await this.connect();
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Error ejecutando consulta:', error);
      throw error;
    }
  }

  async execute(text: string, params?: any[]): Promise<{ rows: any[], rowCount: number }> {
    const pool = await this.connect();
    try {
      const result = await pool.query(text, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      console.error('Error ejecutando consulta:', error);
      throw error;
    }
  }
}

export const database = new Database();
