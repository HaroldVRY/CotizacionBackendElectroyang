-- Script para verificar la estructura de las tablas en PostgreSQL

-- Verificar columnas de la tabla cliente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cliente' 
ORDER BY ordinal_position;

-- Verificar columnas de la tabla usuario
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuario' 
ORDER BY ordinal_position;

-- Verificar columnas de la tabla servicio
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'servicio' 
ORDER BY ordinal_position;

-- Verificar columnas de la tabla cotizacion
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cotizacion' 
ORDER BY ordinal_position;

-- Verificar columnas de la tabla detalle_cotizacion
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'detalle_cotizacion' 
ORDER BY ordinal_position;
