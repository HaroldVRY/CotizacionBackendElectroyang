import { readFileSync } from 'fs';
import { join } from 'path';

export function renderIntroduccion(cotizacion: any): string {
    const templatePath = join(__dirname, 'introduccion.html');
    let template = readFileSync(templatePath, 'utf8');
    // Si necesitas reemplazar variables, agrégalas aquí
    template = template.replace(/\$\{cotizacion\.cliente\}/g, cotizacion.cliente ?? '');
    template = template.replace(/\$\{cotizacion\.receptor\}/g, cotizacion.receptor ?? '');
    return template;
}