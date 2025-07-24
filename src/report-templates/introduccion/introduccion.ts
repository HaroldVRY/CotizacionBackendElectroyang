import { readFileSync } from 'fs';
import { join } from 'path';
import { CotizacionReporte } from '../../types';

export function renderIntroduccion(cotizacion: CotizacionReporte): string {
    const templatePath = join(__dirname, 'introduccion.html');
    let template = readFileSync(templatePath, 'utf8');
    
    template = template.replace(/\$\{cotizacion\.cliente\}/g, cotizacion.cliente ?? '');
    template = template.replace(/\$\{cotizacion\.receptor\}/g, cotizacion.receptor ?? '');
    
    return template;
}