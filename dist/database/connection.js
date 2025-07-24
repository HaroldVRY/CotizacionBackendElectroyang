"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
const config_1 = require("../config");
class Database {
    constructor() {
        this.pool = null;
    }
    async connect() {
        if (!this.pool) {
            try {
                this.pool = new pg_1.Pool({
                    host: config_1.dbConfig.host,
                    port: config_1.dbConfig.port,
                    user: config_1.dbConfig.user,
                    password: config_1.dbConfig.password,
                    database: config_1.dbConfig.database,
                    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                    max: 20,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 2000,
                });
                // Verificar conexión
                const client = await this.pool.connect();
                client.release();
                console.log('Conexión a PostgreSQL establecida');
            }
            catch (error) {
                console.error('Error conectando a PostgreSQL:', error);
                throw error;
            }
        }
        return this.pool;
    }
    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('Conexión a PostgreSQL cerrada');
        }
    }
    async query(text, params) {
        const pool = await this.connect();
        try {
            const result = await pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Error ejecutando consulta:', error);
            throw error;
        }
    }
    async execute(text, params) {
        const pool = await this.connect();
        try {
            const result = await pool.query(text, params);
            return {
                rows: result.rows,
                rowCount: result.rowCount || 0
            };
        }
        catch (error) {
            console.error('Error ejecutando consulta:', error);
            throw error;
        }
    }
}
exports.database = new Database();
