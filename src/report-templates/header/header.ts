import { readFileSync } from 'fs';
import { join } from 'path';

export function renderHeader(empresa: any, cotizacion: any): string {
    const templatePath = join(__dirname, 'header.html');
    let template = readFileSync(templatePath, 'utf8');
    // Reemplazo simple de variables (puedes mejorar con una función más robusta si lo deseas)
    template = template.replace(/\$\{empresa\.nombre\}/g, empresa.nombre ?? '');
    template = template.replace(/\$\{empresa\.servicio\}/g, empresa.servicio ?? '');
    template = template.replace(/\$\{cotizacion\.numero\}/g, cotizacion.numero ?? '');
    template = template.replace(/\$\{cotizacion\.fecha\}/g, cotizacion.fecha ?? '');
    return template;
}