import { Router } from 'express';
import { CotizacionModel } from '../models/CotizacionModel';
import { empresaConfig } from '../config';

const router = Router();
const cotizacionModel = new CotizacionModel();

// Endpoint de debug para verificar datos de BD
router.get('/debug/cotizacion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await cotizacionModel.getById(parseInt(id));
    
    res.json({
      success: true,
      data: cotizacion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint de debug para verificar configuración de empresa
router.get('/debug/empresa', (req, res) => {
  res.json({
    success: true,
    data: empresaConfig
  });
});

// Generar datos de cotización por ID (sin generar HTML)
router.get('/cotizacion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await cotizacionModel.getById(parseInt(id));
    
    if (!cotizacion) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }

    // Convertir datos de BD a formato de reporte
    const items = cotizacion.detalles?.map((detalle) => {
      const numeroItem = detalle.numeroItem || 0;
      const cantidad = Number(detalle.cantidad) || 0;
      const precioUnitario = Number(detalle.precioUnitario) || 0;
      const total = cantidad * precioUnitario;

      return {
        numeroItem,
        cantidad,
        descripcion: detalle.descripcion || '',
        precioUnitario,
        total
      };
    }) || [];

    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const igv = subtotal * 0.18; // 18% IGV
    const total = subtotal + igv;

    const cotizacionReporte = {
      numero: cotizacion.numero || '',
      fecha: cotizacion.fecha ? cotizacion.fecha.toLocaleDateString('es-PE') : '',
      cliente: cotizacion.clienteNombre || 'Cliente no encontrado',
      receptor: cotizacion.receptor || '',
      items: items,
      subtotal: subtotal,
      igv: igv,
      total: total,
      observaciones: cotizacion.observaciones || '',
      tiempoEntrega: cotizacion.tiempoEntrega || '',
      formaPago: cotizacion.formaPago || '',
      banco: {
        nombre: 'Banco de Crédito del Perú (BCP)',
        cuentaCorriente: empresaConfig.cuentasBancarias?.bcp?.corriente || '',
        cuentaInterbancaria: empresaConfig.cuentasBancarias?.bcp?.interbancaria || ''
      },
      estado: cotizacion.estado
    };

    // Devolver los datos del reporte como JSON
    // Nota: La generación de HTML se hace ahora en otro proyecto
    res.json({
      success: true,
      message: 'Datos de cotización obtenidos correctamente. La generación de reportes se maneja en un servicio externo.',
      data: {
        empresa: empresaConfig,
        cotizacion: cotizacionReporte
      }
    });

  } catch (error) {
    console.error('Error al obtener datos de cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de cotización',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Generar datos de cotización por número (sin generar HTML)
router.get('/cotizacion/numero/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const cotizacion = await cotizacionModel.getByNumero(numero);
    
    if (!cotizacion) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }

    // Convertir datos de BD a formato de reporte
    const items = cotizacion.detalles?.map((detalle) => {
      const numeroItem = detalle.numeroItem || 0;
      const cantidad = Number(detalle.cantidad) || 0;
      const precioUnitario = Number(detalle.precioUnitario) || 0;
      const total = cantidad * precioUnitario;

      return {
        numeroItem,
        cantidad,
        descripcion: detalle.descripcion || '',
        precioUnitario,
        total
      };
    }) || [];

    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const igv = subtotal * 0.18; // 18% IGV
    const total = subtotal + igv;

    const cotizacionReporte = {
      numero: cotizacion.numero || '',
      fecha: cotizacion.fecha ? cotizacion.fecha.toLocaleDateString('es-PE') : '',
      cliente: cotizacion.clienteNombre || 'Cliente no encontrado',
      receptor: cotizacion.receptor || '',
      items: items,
      subtotal: subtotal,
      igv: igv,
      total: total,
      observaciones: cotizacion.observaciones || '',
      tiempoEntrega: cotizacion.tiempoEntrega || '',
      formaPago: cotizacion.formaPago || '',
      banco: {
        nombre: 'Banco de Crédito del Perú (BCP)',
        cuentaCorriente: empresaConfig.cuentasBancarias?.bcp?.corriente || '',
        cuentaInterbancaria: empresaConfig.cuentasBancarias?.bcp?.interbancaria || ''
      },
      estado: cotizacion.estado
    };

    // Devolver los datos del reporte como JSON
    // Nota: La generación de HTML se hace ahora en otro proyecto
    res.json({
      success: true,
      message: 'Datos de cotización obtenidos correctamente. La generación de reportes se maneja en un servicio externo.',
      data: {
        empresa: empresaConfig,
        cotizacion: cotizacionReporte
      }
    });

  } catch (error) {
    console.error('Error al obtener datos de cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de cotización',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;