# Sistema de Cotizaciones Electroyang - Backend

Sistema completo de gestión de cotizaciones para Electroyang, incluyendo APIs CRUD para todas las entidades y generación de reportes.

## Características

- ✅ API REST completa para gestión de cotizaciones
- ✅ CRUD para Clientes, Usuarios, Servicios y Cotizaciones
- ✅ Generación de reportes en HTML
- ✅ Base de datos MySQL
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
├── report-templates/     # Plantillas de reportes
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
PORT=3000
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
- `GET /api/reportes/cotizacion/:id` - Generar reporte HTML por ID
- `GET /api/reportes/cotizacion/numero/:numero` - Generar reporte por número

### Health Check
- `GET /api/health` - Verificar estado del servidor

## Próximas Funcionalidades

- [ ] Autenticación JWT
- [ ] Generación de PDF
- [ ] Envío de cotizaciones por email
- [ ] Dashboard de métricas
- [ ] Sistema de notificaciones
- [ ] API para servicios/productos
- [ ] Historial de cambios
- [ ] Exportación a Excel