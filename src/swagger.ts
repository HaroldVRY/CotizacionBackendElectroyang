import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cotizaciones API - Electroyang',
      version: '1.0.0',
      description: 'API para gestionar cotizaciones, clientes, usuarios y servicios',
      contact: {
        name: 'Electroyang',
        email: 'info@electroyang.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.electroyang.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      schemas: {
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único del cliente' },
            nombre: { type: 'string', description: 'Nombre del cliente' },
            email: { type: 'string', format: 'email', description: 'Email del cliente' },
            telefono: { type: 'string', description: 'Teléfono del cliente' },
            empresa: { type: 'string', description: 'Empresa del cliente' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único del usuario' },
            nombre: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Email del usuario' },
            rol: { type: 'string', enum: ['admin', 'usuario'], description: 'Rol del usuario' }
          }
        },
        Servicio: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único del servicio' },
            nombre: { type: 'string', description: 'Nombre del servicio' },
            descripcion: { type: 'string', description: 'Descripción del servicio' },
            precio: { type: 'number', format: 'float', description: 'Precio del servicio' }
          }
        },
        Cotizacion: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único de la cotización' },
            cliente_id: { type: 'integer', description: 'ID del cliente' },
            usuario_id: { type: 'integer', description: 'ID del usuario que realizó la cotización' },
            fecha: { type: 'string', format: 'date-time', description: 'Fecha de la cotización' },
            total: { type: 'number', format: 'float', description: 'Total de la cotización' },
            estado: { type: 'string', enum: ['pendiente', 'aprobada', 'rechazada'], description: 'Estado de la cotización' }
          }
        }
      }
    },
    paths: {
      '/api/clientes': {
        get: { tags: ['Clientes'], summary: 'Listar clientes', responses: { 200: { description: 'Listado de clientes' } } },
        post: {
          tags: ['Clientes'],
          summary: 'Crear cliente',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Cliente' } } } },
          responses: { 201: { description: 'Cliente creado' } }
        }
      },
      '/api/clientes/search': { get: { tags: ['Clientes'], summary: 'Buscar clientes', responses: { 200: { description: 'Resultados de búsqueda' } } } },
      '/api/clientes/search/advanced': { get: { tags: ['Clientes'], summary: 'Búsqueda avanzada de clientes', responses: { 200: { description: 'Resultados de búsqueda avanzada' } } } },
      '/api/clientes/{id}': {
        get: { tags: ['Clientes'], summary: 'Obtener cliente por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cliente encontrado' } } },
        put: { tags: ['Clientes'], summary: 'Actualizar cliente', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cliente actualizado' } } },
        delete: { tags: ['Clientes'], summary: 'Eliminar cliente', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cliente eliminado' } } }
      },
      '/api/usuarios': {
        get: { tags: ['Usuarios'], summary: 'Listar usuarios', responses: { 200: { description: 'Listado de usuarios' } } },
        post: {
          tags: ['Usuarios'],
          summary: 'Crear usuario',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          responses: { 201: { description: 'Usuario creado' } }
        }
      },
      '/api/usuarios/{id}': {
        get: { tags: ['Usuarios'], summary: 'Obtener usuario por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuario encontrado' } } },
        put: { tags: ['Usuarios'], summary: 'Actualizar usuario', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuario actualizado' } } },
        delete: { tags: ['Usuarios'], summary: 'Eliminar usuario', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuario eliminado' } } }
      },
      '/api/servicios': {
        get: { tags: ['Servicios'], summary: 'Listar servicios', responses: { 200: { description: 'Listado de servicios' } } },
        post: {
          tags: ['Servicios'],
          summary: 'Crear servicio',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Servicio' } } } },
          responses: { 201: { description: 'Servicio creado' } }
        }
      },
      '/api/servicios/activos': { get: { tags: ['Servicios'], summary: 'Listar servicios activos', responses: { 200: { description: 'Servicios activos' } } } },
      '/api/servicios/search': { get: { tags: ['Servicios'], summary: 'Buscar servicios', responses: { 200: { description: 'Resultados de búsqueda' } } } },
      '/api/servicios/search/advanced': { get: { tags: ['Servicios'], summary: 'Búsqueda avanzada de servicios', responses: { 200: { description: 'Resultados de búsqueda avanzada' } } } },
      '/api/servicios/{id}': {
        get: { tags: ['Servicios'], summary: 'Obtener servicio por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Servicio encontrado' } } },
        put: { tags: ['Servicios'], summary: 'Actualizar servicio', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Servicio actualizado' } } },
        delete: { tags: ['Servicios'], summary: 'Eliminar servicio', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Servicio eliminado' } } }
      },
      '/api/cotizaciones': {
        get: { tags: ['Cotizaciones'], summary: 'Listar cotizaciones', responses: { 200: { description: 'Listado de cotizaciones' } } },
        post: {
          tags: ['Cotizaciones'],
          summary: 'Crear cotización',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 201: { description: 'Cotización creada' } }
        }
      },
      '/api/cotizaciones/search': { get: { tags: ['Cotizaciones'], summary: 'Buscar cotizaciones', responses: { 200: { description: 'Resultados de búsqueda' } } } },
      '/api/cotizaciones/search/advanced': { get: { tags: ['Cotizaciones'], summary: 'Búsqueda avanzada de cotizaciones', responses: { 200: { description: 'Resultados de búsqueda avanzada' } } } },
      '/api/cotizaciones/cliente/{clienteId}': { get: { tags: ['Cotizaciones'], summary: 'Cotizaciones por cliente', parameters: [{ name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cotizaciones del cliente' } } } },
      '/api/cotizaciones/estado/{estado}': { get: { tags: ['Cotizaciones'], summary: 'Cotizaciones por estado', parameters: [{ name: 'estado', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Cotizaciones por estado' } } } },
      '/api/cotizaciones/numero/{numero}': { get: { tags: ['Cotizaciones'], summary: 'Cotización por número', parameters: [{ name: 'numero', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Cotización encontrada' } } } },
      '/api/cotizaciones/{id}': {
        get: { tags: ['Cotizaciones'], summary: 'Obtener cotización por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cotización encontrada' } } },
        put: { tags: ['Cotizaciones'], summary: 'Actualizar cotización', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cotización actualizada' } } },
        delete: { tags: ['Cotizaciones'], summary: 'Eliminar cotización', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Cotización eliminada' } } }
      },
      '/api/reportes/debug/cotizacion/{id}': { get: { tags: ['Reportes'], summary: 'Debug de cotización para reportes', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Datos de cotización para debug' } } } },
      '/api/reportes/debug/empresa': { get: { tags: ['Reportes'], summary: 'Debug de configuración de empresa', responses: { 200: { description: 'Configuración de empresa' } } } },
      '/api/reportes/cotizacion/{id}': { get: { tags: ['Reportes'], summary: 'Datos de cotización para reporte', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Datos del reporte' } } } },
      '/api/reportes/cotizacion/numero/{numero}': { get: { tags: ['Reportes'], summary: 'Datos de cotización para reporte por número', parameters: [{ name: 'numero', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Datos del reporte' } } } }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
