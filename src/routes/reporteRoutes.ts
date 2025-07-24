import { Router } from 'express';
import { renderMain } from '../report-templates/main/main';
import { CotizacionModel } from '../models/CotizacionModel';
import { empresaConfig } from '../config';
import { CotizacionReporte, ItemCotizacion } from '../types/index';

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

// Generar reporte de cotización por ID
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

    // Debug: Log para ver qué datos llegan de la BD
    console.log('Cotización desde BD:', JSON.stringify(cotizacion, null, 2));
    console.log('Detalles:', JSON.stringify(cotizacion.detalles, null, 2));

    // Convertir datos de BD a formato de reporte con cálculos y validaciones
    const items: ItemCotizacion[] = cotizacion.detalles?.map((detalle): ItemCotizacion => {
      // Usar tanto camelCase como snake_case por compatibilidad
      const numeroItem = detalle.numeroItem || (detalle as any).numeroitem || 0;
      const cantidad = Number(detalle.cantidad) || 0;
      const precioUnitario = Number(detalle.precioUnitario || (detalle as any).preciounitario) || 0;
      const total = cantidad * precioUnitario;
      
      console.log('Detalle procesado:', {
        numeroItem,
        cantidad,
        precioUnitario,
        total,
        descripcion: detalle.descripcion
      });
      
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

    console.log('Totales calculados:', { subtotal, igv, total });

    const cotizacionReporte: CotizacionReporte = {
      numero: cotizacion.numero || '',
      fecha: cotizacion.fecha ? cotizacion.fecha.toLocaleDateString('es-PE') : '',
      cliente: cotizacion.clienteNombre || (cotizacion as any).clientenombre || 'Cliente no encontrado',
      receptor: cotizacion.receptor || '',
      items: items,
      subtotal: subtotal,
      igv: igv,
      total: total,
      observaciones: cotizacion.observaciones || '',
      tiempoEntrega: cotizacion.tiempoEntrega || (cotizacion as any).tiempoentrega || '',
      formaPago: cotizacion.formaPago || (cotizacion as any).formapago || '',
      banco: {
        nombre: 'Banco de Crédito del Perú (BCP)',
        cuentaCorriente: empresaConfig.cuentasBancarias?.bcp?.corriente || '',
        cuentaInterbancaria: empresaConfig.cuentasBancarias?.bcp?.interbancaria || ''
      },
      estado: cotizacion.estado as 'borrador' | 'enviada' | 'aprobada' | 'rechazada'
    };

    console.log('Reporte final:', JSON.stringify(cotizacionReporte, null, 2));

    // Renderizar el HTML completo del reporte
    const html = renderMain(empresaConfig, cotizacionReporte, 1, 1);
    
    res.send(html);
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Generar reporte de cotización por número
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

    // Debug: Log para ver qué datos llegan de la BD
    console.log('Cotización desde BD (por número):', JSON.stringify(cotizacion, null, 2));
    console.log('Detalles:', JSON.stringify(cotizacion.detalles, null, 2));

    // Convertir datos de BD a formato de reporte con cálculos y validaciones
    const items: ItemCotizacion[] = cotizacion.detalles?.map((detalle): ItemCotizacion => {
      // Usar tanto camelCase como snake_case por compatibilidad
      const numeroItem = detalle.numeroItem || (detalle as any).numeroitem || 0;
      const cantidad = Number(detalle.cantidad) || 0;
      const precioUnitario = Number(detalle.precioUnitario || (detalle as any).preciounitario) || 0;
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

    const cotizacionReporte: CotizacionReporte = {
      numero: cotizacion.numero || '',
      fecha: cotizacion.fecha ? cotizacion.fecha.toLocaleDateString('es-PE') : '',
      cliente: cotizacion.clienteNombre || (cotizacion as any).clientenombre || 'Cliente no encontrado',
      receptor: cotizacion.receptor || '',
      items: items,
      subtotal: subtotal,
      igv: igv,
      total: total,
      observaciones: cotizacion.observaciones || '',
      tiempoEntrega: cotizacion.tiempoEntrega || (cotizacion as any).tiempoentrega || '',
      formaPago: cotizacion.formaPago || (cotizacion as any).formapago || '',
      banco: {
        nombre: 'Banco de Crédito del Perú (BCP)',
        cuentaCorriente: empresaConfig.cuentasBancarias?.bcp?.corriente || '',
        cuentaInterbancaria: empresaConfig.cuentasBancarias?.bcp?.interbancaria || ''
      },
      estado: cotizacion.estado as 'borrador' | 'enviada' | 'aprobada' | 'rechazada'
    };

    // Renderizar el HTML completo del reporte
    const html = renderMain(empresaConfig, cotizacionReporte, 1, 1);
    
    res.send(html);
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
