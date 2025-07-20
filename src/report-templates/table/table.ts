import { readFileSync } from 'fs';
import { join } from 'path';
import { ItemCotizacion } from '../../types';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function calculateTotal(item: ItemCotizacion): number {
    return item.cantidad * item.precioUnitario;
}

export function renderTabla(cotizacion: { items: ItemCotizacion[], precioTotal?: number, observaciones?: string }): string {
    const templatePath = join(__dirname, 'table.html');
    let template = readFileSync(templatePath, 'utf8');
    
    const rows = cotizacion.items.map((item: ItemCotizacion) => {
        const total = calculateTotal(item);
        return `
        <tr>
            <td class="text-center">${item.numeroItem}</td>
            <td class="text-center">${item.cantidad}</td>
            <td>${item.descripcion}</td>
            <td class="text-right">${formatCurrency(item.precioUnitario)}</td>
            <td class="text-right">${formatCurrency(total)}</td>
        </tr>
    `}).join('');
    
    const totalGeneral = cotizacion.items.reduce((sum, item) => sum + calculateTotal(item), 0);

    template = template.replace(/\$\{rows\}/g, rows);
    template = template.replace(/\$\{cotizacion.precioTotalFormatted\}/g, formatCurrency(totalGeneral));
    template = template.replace(/\$\{cotizacion.observaciones\}/g, cotizacion.observaciones ?? '');
    return template;
}