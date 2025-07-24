import { Router } from 'express';
import { renderMain } from '../report-templates/main/main';
import { CotizacionModel } from '../models/CotizacionModel';
import { empresaConfig } from '../config';
import { CotizacionReporte, ItemCotizacion } from '../types/index';

const router = Router();
const cotizacionModel = new CotizacionModel();

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

    // Convertir datos de BD a formato de reporte
    const cotizacionReporte: CotizacionReporte = {
      numero: cotizacion.numero,
      fecha: cotizacion.fecha.toLocaleDateString('es-PE'),
      cliente: cotizacion.cliente?.nombre || 'Cliente no encontrado',
      receptor: cotizacion.receptor || '',
      items: cotizacion.detalles?.map((detalle, index): ItemCotizacion => ({
        numeroItem: index + 1,
        cantidad: detalle.cantidad,
        descripcion: detalle.descripcion,
        precioUnitario: detalle.precioUnitario
      })) || [],
      observaciones: cotizacion.observaciones,
      tiempoEntrega: cotizacion.tiempoEntrega,
      formaPago: cotizacion.formaPago,
      estado: cotizacion.estado as 'borrador' | 'aprobada' | 'rechazada'
    };

    // Renderizar el HTML completo del reporte
    const html = renderMain(empresaConfig, cotizacionReporte, 1, 1);
    
    res.send(html);
  } catch (error) {
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

    // Convertir datos de BD a formato de reporte
    const cotizacionReporte: CotizacionReporte = {
      numero: cotizacion.numero,
      fecha: cotizacion.fecha.toLocaleDateString('es-PE'),
      cliente: cotizacion.cliente?.nombre || 'Cliente no encontrado',
      receptor: cotizacion.receptor || '',
      items: cotizacion.detalles?.map((detalle, index): ItemCotizacion => ({
        numeroItem: index + 1,
        cantidad: detalle.cantidad,
        descripcion: detalle.descripcion,
        precioUnitario: detalle.precioUnitario
      })) || [],
      observaciones: cotizacion.observaciones,
      tiempoEntrega: cotizacion.tiempoEntrega,
      formaPago: cotizacion.formaPago,
      estado: cotizacion.estado as 'borrador' | 'aprobada' | 'rechazada'
    };

    // Renderizar el HTML completo del reporte
    const html = renderMain(empresaConfig, cotizacionReporte, 1, 1);
    
    res.send(html);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
