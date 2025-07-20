import { readFileSync } from 'fs';
import { join } from 'path';

export function renderCierre(cotizacion: any): string {
    const templatePath = join(__dirname, 'cierre.html');
    let template = readFileSync(templatePath, 'utf8');
    template = template.replace(/\$\{cotizacion.precioTotalFormatted\}/g, cotizacion.precioTotalFormatted ?? '');
    template = template.replace(/\$\{cotizacion.precioTotalLetras\}/g, cotizacion.precioTotalLetras ?? '');
    template = template.replace(/\$\{cotizacion.tiempoEntrega\}/g, cotizacion.tiempoEntrega ?? '');
    template = template.replace(/\$\{cotizacion.formaPago\}/g, cotizacion.formaPago ?? '');
    template = template.replace(/\$\{cotizacion.banco\.nombre\}/g, cotizacion.banco?.nombre ?? '');
    template = template.replace(/\$\{cotizacion.banco\.cuentaCorriente\}/g, cotizacion.banco?.cuentaCorriente ?? '');
    template = template.replace(/\$\{cotizacion.banco\.cuentaInterbancaria\}/g, cotizacion.banco?.cuentaInterbancaria ?? '');
    // Si tienes bloques condicionales, deberás procesarlos manualmente o con una función extra.
    return template;
}