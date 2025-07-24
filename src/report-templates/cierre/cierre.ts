import { readFileSync } from 'fs';
import { join } from 'path';
import { CotizacionReporte } from '../../types';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function renderCierre(cotizacion: CotizacionReporte): string {
    const templatePath = join(__dirname, 'cierre.html');
    let template = readFileSync(templatePath, 'utf8');
    
    template = template.replace(/\$\{cotizacion\.total\}/g, formatCurrency(cotizacion.total));
    template = template.replace(/\$\{cotizacion\.tiempoEntrega\}/g, cotizacion.tiempoEntrega ?? '');
    template = template.replace(/\$\{cotizacion\.formaPago\}/g, cotizacion.formaPago ?? '');
    template = template.replace(/\$\{cotizacion\.banco\.nombre\}/g, cotizacion.banco?.nombre ?? '');
    template = template.replace(/\$\{cotizacion\.banco\.cuentaCorriente\}/g, cotizacion.banco?.cuentaCorriente ?? '');
    template = template.replace(/\$\{cotizacion\.banco\.cuentaInterbancaria\}/g, cotizacion.banco?.cuentaInterbancaria ?? '');
    
    return template;
}