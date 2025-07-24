import { readFileSync } from 'fs';
import { join } from 'path';
import { ItemCotizacion, CotizacionReporte } from '../../types';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function renderTabla(cotizacion: CotizacionReporte): string {
    const templatePath = join(__dirname, 'table.html');
    let template = readFileSync(templatePath, 'utf8');
    
    const rows = cotizacion.items.map((item: ItemCotizacion) => {
        return `
        <tr>
            <td class="text-center">${item.numeroItem}</td>
            <td class="text-center">${item.cantidad.toFixed(3)}</td>
            <td>${item.descripcion}</td>
            <td class="text-right">${formatCurrency(item.precioUnitario)}</td>
            <td class="text-right">${formatCurrency(item.total)}</td>
        </tr>
    `}).join('');
    
    template = template.replace(/\$\{rows\}/g, rows);
    template = template.replace(/\$\{cotizacion\.subtotal\}/g, formatCurrency(cotizacion.subtotal));
    template = template.replace(/\$\{cotizacion\.igv\}/g, formatCurrency(cotizacion.igv));
    template = template.replace(/\$\{cotizacion\.total\}/g, formatCurrency(cotizacion.total));
    template = template.replace(/\$\{cotizacion\.observaciones\}/g, cotizacion.observaciones || '');
    
    return template;
}