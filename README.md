# ⚙️ Módulo de Administración API

Este repositorio contiene el backend exclusivo para el **Módulo de Administración** del sistema Electroyang. Se encarga de gestionar la seguridad, el control de accesos (Roles y Permisos), las configuraciones globales y los diccionarios de datos del sistema.

## 🗄️ Estructura de la Base de Datos (Última Versión)

El módulo está respaldado por PostgreSQL (Supabase) y gestiona 6 entidades principales:
1. **Roles:** Perfiles de acceso del sistema (Admin, Vendedor, etc).
2. **Usuarios:** Credenciales y datos del personal autenticado.
3. **Funcionalidades:** Pantallas o módulos del frontend.
4. **Accesos:** Matriz de permisos granulares (Crear, Leer, Editar, Eliminar) cruzando Roles y Funcionalidades.
5. **Parámetros:** Variables globales del negocio (IGV, RUC, Tipo de Cambio).
6. **Tablas Maestras (Cabecera/Detalle):** Diccionarios de datos (Tipos de Documento, Estados, Métodos de Pago).

## 🔌 Endpoints de la API

La API expone las siguientes rutas principales para el control administrativo:

### Usuarios y Roles
* `GET /api/admin/roles` - Lista todos los roles disponibles.
* `POST /api/admin/roles` - Crea un nuevo perfil de rol.
* `GET /api/admin/usuarios` - Lista los usuarios con su rol asociado.
* `POST /api/admin/usuarios` - Registra un nuevo usuario (encriptando la contraseña).

### Permisos y Accesos
* `GET /api/admin/funcionalidades` - Lista todas las pantallas registradas en el sistema.
* `GET /api/admin/accesos/:rol_id` - Obtiene la matriz de permisos para un rol específico.
* `PUT /api/admin/accesos` - Actualiza los permisos (CRUD) de un rol sobre una funcionalidad.

### Configuración del Sistema
* `GET /api/admin/parametros` - Obtiene las variables globales del negocio.
* `PUT /api/admin/parametros/:codigo` - Actualiza el valor de un parámetro (ej. IGV).

### Tablas Maestras
* `GET /api/admin/maestros` - Lista todas las cabeceras de los diccionarios.
* `GET /api/admin/maestros/:codigo/detalles` - Lista las opciones de una lista específica (ej. Tipos de documento).
* `POST /api/admin/maestros/detalles` - Agrega un nuevo valor a un diccionario existente.

## 🚀 Configuración y Despliegue

### 1. Instalación Local
```bash
git clone [https://github.com/HaroldVRY/ModuloAdministracion.git](https://github.com/HaroldVRY/ModuloAdministracion.git)
cd ModuloAdministracion
npm install
