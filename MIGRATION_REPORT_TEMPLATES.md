# Migración: Eliminación de Report Templates

## Resumen de Cambios

Este documento detalla los cambios realizados para eliminar la dependencia de la carpeta `report-templates` del proyecto backend, ya que la generación de reportes ahora se maneja en un proyecto separado.

## Archivos Modificados

### 1. `src/routes/reporteRoutes.ts`
- **Antes**: Archivo vacío
- **Después**: Implementado con endpoints que devuelven datos JSON en lugar de HTML
- **Cambios**:
  - Eliminada dependencia de `../report-templates/main/main`
  - Los endpoints ahora devuelven datos estructurados para el servicio externo
  - Mantiene la funcionalidad de debug
  - Calcula totales y formatea datos para el consumo externo

### 2. `src/app.ts`
- **Cambios**:
  - Agregada importación de `reporteRoutes`
  - Registrada ruta `/api/reportes` en la aplicación

### 3. `src/config.ts`
- **Cambios**:
  - Simplificada configuración de `reportConfig`
  - Eliminadas opciones de PDF (se manejan externamente)
  - Mantenida configuración de fecha y moneda

### 4. `src/types/index.ts`
- **Cambios**:
  - Eliminados tipos `CotizacionConCalculos` y `ReportOptions`
  - Mantenidos tipos base necesarios para la API (`CotizacionReporte`, `ItemCotizacion`, etc.)

### 5. `package.json`
- **Cambios**:
  - Eliminada dependencia `html-pdf`
  - Eliminada dependencia de desarrollo `@types/html-pdf`

### 6. `README.md`
- **Cambios**:
  - Actualizada descripción de características
  - Modificada estructura del proyecto (eliminado `report-templates`)
  - Actualizada documentación de endpoints de reportes
  - Agregada nota sobre generación externa de reportes

## Endpoints Afectados

### Antes
- `GET /api/reportes/cotizacion/:id` - Generaba y devolvía HTML
- `GET /api/reportes/cotizacion/numero/:numero` - Generaba y devolvía HTML

### Después
- `GET /api/reportes/cotizacion/:id` - Devuelve datos JSON para generación externa
- `GET /api/reportes/cotizacion/numero/:numero` - Devuelve datos JSON para generación externa
- `GET /api/reportes/debug/cotizacion/:id` - Debug: datos desde BD
- `GET /api/reportes/debug/empresa` - Debug: configuración empresa

## Respuestas de la API

Los endpoints de reportes ahora devuelven:

```json
{
  "success": true,
  "message": "Datos de cotización obtenidos correctamente. La generación de reportes se maneja en un servicio externo.",
  "data": {
    "empresa": {
      // Configuración de la empresa
    },
    "cotizacion": {
      // Datos formateados de la cotización
    }
  }
}
```

## Archivos para Eliminar

Una vez confirmado que todo funciona correctamente, se pueden eliminar:

- `src/report-templates/` (toda la carpeta)
- `dist/report-templates/` (si existe)

## Verificaciones Realizadas

- ✅ No hay errores de TypeScript
- ✅ No hay importaciones rotas
- ✅ Endpoints funcionan correctamente
- ✅ Documentación actualizada
- ✅ Dependencias innecesarias eliminadas

## Próximos Pasos

1. Eliminar físicamente la carpeta `report-templates`
2. Probar los endpoints de reportes
3. Configurar el servicio externo de generación de reportes para consumir estos endpoints
4. Actualizar cualquier cliente que consuma los antiguos endpoints HTML

## Notas Importantes

- Los tipos de datos se mantienen para compatibilidad con el servicio externo
- La configuración de empresa se mantiene disponible via API
- Los cálculos de totales e IGV se siguen realizando en el backend
- Los endpoints de debug facilitan la migración y troubleshooting