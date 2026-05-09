import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Administración API - Electroyang v2',
      version: '2.0.0',
      description: 'API para gestionar administración del sistema: Roles, Usuarios, Funcionalidades, Accesos, Parámetros y Maestros',
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
        Rol: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            estado: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            rol_id: { type: 'integer' },
            nombres: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string' },
            password_hash: { type: 'string' },
            estado: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Funcionalidad: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            ruta_frontend: { type: 'string' },
            descripcion: { type: 'string' },
            estado: { type: 'boolean' }
          }
        },
        Acceso: {
          type: 'object',
          properties: {
            rol_id: { type: 'integer' },
            funcionalidad_id: { type: 'integer' },
            puede_crear: { type: 'boolean' },
            puede_leer: { type: 'boolean' },
            puede_editar: { type: 'boolean' },
            puede_eliminar: { type: 'boolean' }
          }
        },
        Parametro: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            codigo: { type: 'string' },
            valor: { type: 'string' },
            descripcion: { type: 'string' },
            fecha_actualizacion: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/api/admin/roles': {
        get: { tags: ['Roles'], summary: 'Listar todos los roles', responses: { 200: { description: 'Lista de roles' } } },
        post: { tags: ['Roles'], summary: 'Crear nuevo rol', responses: { 201: { description: 'Rol creado' } } }
      },
      '/api/admin/roles/{id}': {
        get: { tags: ['Roles'], summary: 'Obtener rol por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Rol encontrado' } } },
        put: { tags: ['Roles'], summary: 'Actualizar rol', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Rol actualizado' } } },
        delete: { tags: ['Roles'], summary: 'Eliminar rol', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Rol eliminado' } } }
      },
      '/api/admin/roles/{id}/toggle-estado': {
        patch: { tags: ['Roles'], summary: 'Cambiar estado del rol', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Estado actualizado' } } }
      },
      '/api/admin/usuarios': {
        get: { tags: ['Usuarios'], summary: 'Listar todos los usuarios', responses: { 200: { description: 'Lista de usuarios' } } },
        post: { tags: ['Usuarios'], summary: 'Crear nuevo usuario', responses: { 201: { description: 'Usuario creado' } } }
      },
      '/api/admin/usuarios/{id}': {
        get: { tags: ['Usuarios'], summary: 'Obtener usuario por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuario encontrado' } } },
        put: { tags: ['Usuarios'], summary: 'Actualizar usuario', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuario actualizado' } } },
        delete: { tags: ['Usuarios'], summary: 'Eliminar usuario', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuario eliminado' } } }
      },
      '/api/admin/usuarios/{id}/toggle-estado': {
        patch: { tags: ['Usuarios'], summary: 'Cambiar estado del usuario', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Estado actualizado' } } }
      },
      '/api/admin/funcionalidades': {
        get: { tags: ['Funcionalidades'], summary: 'Listar todas las funcionalidades', responses: { 200: { description: 'Lista de funcionalidades' } } },
        post: { tags: ['Funcionalidades'], summary: 'Crear nueva funcionalidad', responses: { 201: { description: 'Funcionalidad creada' } } }
      },
      '/api/admin/funcionalidades/{id}': {
        get: { tags: ['Funcionalidades'], summary: 'Obtener funcionalidad por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Funcionalidad encontrada' } } },
        put: { tags: ['Funcionalidades'], summary: 'Actualizar funcionalidad', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Funcionalidad actualizada' } } },
        delete: { tags: ['Funcionalidades'], summary: 'Eliminar funcionalidad', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Funcionalidad eliminada' } } }
      },
      '/api/admin/accesos': {
        get: { tags: ['Accesos'], summary: 'Listar todos los accesos', responses: { 200: { description: 'Lista de accesos' } } },
        post: { tags: ['Accesos'], summary: 'Crear nuevo acceso', responses: { 201: { description: 'Acceso creado' } } }
      },
      '/api/admin/accesos/rol/{rol_id}': {
        get: { tags: ['Accesos'], summary: 'Obtener accesos de un rol', parameters: [{ name: 'rol_id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Accesos del rol' } } }
      },
      '/api/admin/parametros': {
        get: { tags: ['Parámetros'], summary: 'Listar todos los parámetros', responses: { 200: { description: 'Lista de parámetros' } } },
        post: { tags: ['Parámetros'], summary: 'Crear nuevo parámetro', responses: { 201: { description: 'Parámetro creado' } } }
      },
      '/api/admin/parametros/{id}': {
        get: { tags: ['Parámetros'], summary: 'Obtener parámetro por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Parámetro encontrado' } } },
        put: { tags: ['Parámetros'], summary: 'Actualizar parámetro', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Parámetro actualizado' } } },
        delete: { tags: ['Parámetros'], summary: 'Eliminar parámetro', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Parámetro eliminado' } } }
      },
      '/api/admin/maestros/cabecera': {
        get: { tags: ['Maestros'], summary: 'Listar maestros cabeceras', responses: { 200: { description: 'Lista de cabeceras' } } },
        post: { tags: ['Maestros'], summary: 'Crear nueva cabecera', responses: { 201: { description: 'Cabecera creada' } } }
      },
      '/api/admin/maestros/detalle': {
        get: { tags: ['Maestros'], summary: 'Listar maestros detalles', responses: { 200: { description: 'Lista de detalles' } } },
        post: { tags: ['Maestros'], summary: 'Crear nuevo detalle', responses: { 201: { description: 'Detalle creado' } } }
      },
      '/api/health': {
        get: { tags: ['Health'], summary: 'Health check', responses: { 200: { description: 'Servidor funcionando' } } }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
