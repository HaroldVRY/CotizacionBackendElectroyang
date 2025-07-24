import { readFileSync } from 'fs';
import { join } from 'path';
import { EmpresaInfo, CotizacionReporte } from '../../types';
import { getLogoBase64 } from '../../utils/imageUtils';

export function renderHeader(empresa: EmpresaInfo, cotizacion: CotizacionReporte): string {
    const templatePath = join(__dirname, 'header.html');
    let template = readFileSync(templatePath, 'utf8');
    
    // Obtener el logo en Base64
    const logoBase64 = getLogoBase64();
    
    template = template.replace(/\$\{empresa\.nombre\}/g, empresa.nombre ?? '');
    template = template.replace(/\$\{empresa\.servicio\}/g, empresa.servicio ?? '');
    template = template.replace(/\$\{cotizacion\.numero\}/g, cotizacion.numero ?? '');
    template = template.replace(/\$\{cotizacion\.fecha\}/g, cotizacion.fecha ?? '');
    template = template.replace(/\$\{logoBase64\}/g, logoBase64);
    
    return template;
}