"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTabla = renderTabla;
const fs_1 = require("fs");
const path_1 = require("path");
function formatCurrency(value) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
function renderTabla(cotizacion) {
    const templatePath = (0, path_1.join)(__dirname, 'table.html');
    let template = (0, fs_1.readFileSync)(templatePath, 'utf8');
    const rows = cotizacion.items.map((item) => {
        return `
        <tr>
            <td class="text-center">${item.numeroItem}</td>
            <td class="text-center">${item.cantidad.toFixed(3)}</td>
            <td>${item.descripcion}</td>
            <td class="text-right">${formatCurrency(item.precioUnitario)}</td>
            <td class="text-right">${formatCurrency(item.total)}</td>
        </tr>
    `;
    }).join('');
    template = template.replace(/\$\{rows\}/g, rows);
    template = template.replace(/\$\{cotizacion\.subtotal\}/g, formatCurrency(cotizacion.subtotal));
    template = template.replace(/\$\{cotizacion\.igv\}/g, formatCurrency(cotizacion.igv));
    template = template.replace(/\$\{cotizacion\.total\}/g, formatCurrency(cotizacion.total));
    template = template.replace(/\$\{cotizacion\.observaciones\}/g, cotizacion.observaciones || '');
    return template;
}
