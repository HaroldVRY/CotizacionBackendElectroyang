# Sistema de Cotizaciones Electroyang - Backend

Sistema completo de gestión de cotizaciones para Electroyang, incluyendo APIs CRUD para todas las entidades y generación de reportes.

## Características

- ✅ API REST completa para gestión de cotizaciones
- ✅ CRUD para Clientes, Usuarios, Servicios y Cotizaciones
- ✅ API de datos para reportes (generación externa)
- ✅ Base de datos PostgreSQL
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Arquitectura escalable

## Tecnologías

- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL
- **Validación**: express-validator
- **Seguridad**: helmet, cors
- **Cliente BD**: pg (node-postgres)

## Estructura del Proyecto

```
src/
├── controllers/           # Controladores de la API
├── models/               # Modelos de datos
├── routes/               # Rutas de la API
├── database/             # Configuración de BD
├── types/                # Tipos de TypeScript
├── utils/                # Utilidades
├── public/               # Archivos estáticos
└── app.ts               # Aplicación principal

database/
└── (no incluido - usar BD existente)
```

## Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd CotizacionBackendElectroyang
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu configuración
```

4. **Compilar el proyecto**
```bash
npm run build
```

## Scripts Disponibles

### 🚀 **Desarrollo**
```bash
# Iniciar servidor de desarrollo con recarga automática
npm run dev

# Compilar en modo watch (recompila automáticamente)
npm run watch
```

### 🏗️ **Build y Producción**
```bash
# Compilar para producción
npm run build

# Build limpio (elimina dist/ y recompila)
npm run build:prod

# Compilar y ejecutar
npm run serve

# Solo ejecutar (requiere build previo)
npm start
```

### 🧹 **Utilidades**
```bash
# Limpiar carpeta dist/
npm run clean

# Ejecutar linter (cuando esté configurado)
npm run lint

# Formatear código (cuando esté configurado)  
npm run format
```

## 📋 **Flujo de Trabajo Recomendado**

### Durante Desarrollo:
```bash
# Opción 1: Servidor con recarga automática
npm run dev

# Opción 2: Compilación automática en terminal separada
npm run watch
# Y en otra terminal:
npm start
```

### Antes de Producción:
```bash
# Build limpio
npm run build:prod

# Probar localmente
npm start

# Si todo funciona, hacer deploy
```

### Para Cambios Rápidos:
```bash
# Solo recompilar (más rápido)
npm run build

# Y reiniciar
npm start
```

3. **Configurar base de datos**
   - La base de datos PostgreSQL ya debe estar creada
   - Configurar las variables de entorno en `.env`

4. **Configurar variables de entorno**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=electroyang_cotizaciones
PORT=3001
NODE_ENV=development
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

6. **Compilar para producción**
```bash
npm run build
npm start
```

## APIs Disponibles

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `GET /api/clientes/search?term=<término>` - Buscar clientes
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Servicios
- `GET /api/servicios` - Obtener todos los servicios
- `GET /api/servicios/activos` - Obtener servicios activos
- `GET /api/servicios/:id` - Obtener servicio por ID
- `GET /api/servicios/search?term=<término>` - Buscar servicios
- `POST /api/servicios` - Crear nuevo servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Cotizaciones
- `GET /api/cotizaciones` - Obtener todas las cotizaciones
- `GET /api/cotizaciones/:id` - Obtener cotización por ID
- `GET /api/cotizaciones/numero/:numero` - Obtener por número
- `GET /api/cotizaciones/cliente/:clienteId` - Obtener por cliente
- `GET /api/cotizaciones/estado/:estado` - Obtener por estado
- `POST /api/cotizaciones` - Crear nueva cotización
- `PUT /api/cotizaciones/:id` - Actualizar cotización
- `DELETE /api/cotizaciones/:id` - Eliminar cotización

### Reportes
- `GET /api/reportes/cotizacion/:id` - Obtener datos de cotización para reporte por ID
- `GET /api/reportes/cotizacion/numero/:numero` - Obtener datos de cotización para reporte por número
- `GET /api/reportes/debug/cotizacion/:id` - Debug: datos de cotización desde BD
- `GET /api/reportes/debug/empresa` - Debug: configuración de empresa

**Nota**: Este backend solo proporciona los datos. La generación de reportes HTML/PDF se maneja en un proyecto separado.

### Health Check
- `GET /api/health` - Verificar estado del servidor

## Próximas Funcionalidades

- [ ] Autenticación JWT
- [ ] Envío de cotizaciones por email
- [ ] Dashboard de métricas
- [ ] Sistema de notificaciones
- [ ] API para servicios/productos
- [ ] Historial de cambios
- [ ] Exportación a Excel
- [ ] Integración con servicio externo de reportes

## Notas Importantes

- La generación de reportes HTML/PDF se maneja en un proyecto separado
- Este backend solo expone las APIs de datos necesarias para la generación de reportes
- Los endpoints de reportes devuelven datos JSON estructurados para el servicio externo