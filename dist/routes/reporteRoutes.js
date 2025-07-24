"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_1 = require("../report-templates/main/main");
const CotizacionModel_1 = require("../models/CotizacionModel");
const config_1 = require("../config");
const router = (0, express_1.Router)();
const cotizacionModel = new CotizacionModel_1.CotizacionModel();
// Endpoint de debug para verificar datos de BD
router.get('/debug/cotizacion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cotizacion = await cotizacionModel.getById(parseInt(id));
        res.json({
            success: true,
            data: cotizacion
        });
    }
    catch (error) {
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
        data: config_1.empresaConfig
    });
});
// Generar reporte de cotización por ID
router.get('/cotizacion/:id', async (req, res) => {
    var _a, _b, _c, _d, _e;
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
        const items = ((_a = cotizacion.detalles) === null || _a === void 0 ? void 0 : _a.map((detalle) => {
            // Usar tanto camelCase como snake_case por compatibilidad
            const numeroItem = detalle.numeroItem || detalle.numeroitem || 0;
            const cantidad = Number(detalle.cantidad) || 0;
            const precioUnitario = Number(detalle.precioUnitario || detalle.preciounitario) || 0;
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
        })) || [];
        // Calcular totales
        const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
        const igv = subtotal * 0.18; // 18% IGV
        const total = subtotal + igv;
        console.log('Totales calculados:', { subtotal, igv, total });
        const cotizacionReporte = {
            numero: cotizacion.numero || '',
            fecha: cotizacion.fecha ? cotizacion.fecha.toLocaleDateString('es-PE') : '',
            cliente: cotizacion.clienteNombre || cotizacion.clientenombre || 'Cliente no encontrado',
            receptor: cotizacion.receptor || '',
            items: items,
            subtotal: subtotal,
            igv: igv,
            total: total,
            observaciones: cotizacion.observaciones || '',
            tiempoEntrega: cotizacion.tiempoEntrega || cotizacion.tiempoentrega || '',
            formaPago: cotizacion.formaPago || cotizacion.formapago || '',
            banco: {
                nombre: 'Banco de Crédito del Perú (BCP)',
                cuentaCorriente: ((_c = (_b = config_1.empresaConfig.cuentasBancarias) === null || _b === void 0 ? void 0 : _b.bcp) === null || _c === void 0 ? void 0 : _c.corriente) || '',
                cuentaInterbancaria: ((_e = (_d = config_1.empresaConfig.cuentasBancarias) === null || _d === void 0 ? void 0 : _d.bcp) === null || _e === void 0 ? void 0 : _e.interbancaria) || ''
            },
            estado: cotizacion.estado
        };
        console.log('Reporte final:', JSON.stringify(cotizacionReporte, null, 2));
        // Renderizar el HTML completo del reporte
        const html = (0, main_1.renderMain)(config_1.empresaConfig, cotizacionReporte, 1, 1);
        res.send(html);
    }
    catch (error) {
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
    var _a, _b, _c, _d, _e;
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
        const items = ((_a = cotizacion.detalles) === null || _a === void 0 ? void 0 : _a.map((detalle) => {
            // Usar tanto camelCase como snake_case por compatibilidad
            const numeroItem = detalle.numeroItem || detalle.numeroitem || 0;
            const cantidad = Number(detalle.cantidad) || 0;
            const precioUnitario = Number(detalle.precioUnitario || detalle.preciounitario) || 0;
            const total = cantidad * precioUnitario;
            return {
                numeroItem,
                cantidad,
                descripcion: detalle.descripcion || '',
                precioUnitario,
                total
            };
        })) || [];
        // Calcular totales
        const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
        const igv = subtotal * 0.18; // 18% IGV
        const total = subtotal + igv;
        const cotizacionReporte = {
            numero: cotizacion.numero || '',
            fecha: cotizacion.fecha ? cotizacion.fecha.toLocaleDateString('es-PE') : '',
            cliente: cotizacion.clienteNombre || cotizacion.clientenombre || 'Cliente no encontrado',
            receptor: cotizacion.receptor || '',
            items: items,
            subtotal: subtotal,
            igv: igv,
            total: total,
            observaciones: cotizacion.observaciones || '',
            tiempoEntrega: cotizacion.tiempoEntrega || cotizacion.tiempoentrega || '',
            formaPago: cotizacion.formaPago || cotizacion.formapago || '',
            banco: {
                nombre: 'Banco de Crédito del Perú (BCP)',
                cuentaCorriente: ((_c = (_b = config_1.empresaConfig.cuentasBancarias) === null || _b === void 0 ? void 0 : _b.bcp) === null || _c === void 0 ? void 0 : _c.corriente) || '',
                cuentaInterbancaria: ((_e = (_d = config_1.empresaConfig.cuentasBancarias) === null || _d === void 0 ? void 0 : _d.bcp) === null || _e === void 0 ? void 0 : _e.interbancaria) || ''
            },
            estado: cotizacion.estado
        };
        // Renderizar el HTML completo del reporte
        const html = (0, main_1.renderMain)(config_1.empresaConfig, cotizacionReporte, 1, 1);
        res.send(html);
    }
    catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.default = router;
