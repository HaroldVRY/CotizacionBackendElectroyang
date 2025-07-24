import { readFileSync } from 'fs';
import { join } from 'path';
import { renderHeader } from '../header/header';
import { renderCierre } from '../cierre/cierre';
import { renderFooter } from '../footer/footer';
import { renderIntroduccion } from '../introduccion/introduccion';
import { renderTabla } from '../table/table';
import { CotizacionReporte, EmpresaInfo } from '../../types';

export function renderMain(empresa: EmpresaInfo, cotizacion: CotizacionReporte, page: number, pages: number): string {
    const templatePath = join(__dirname, 'main.html');
    let template = readFileSync(templatePath, 'utf8');
    
    // Cargar CSS
    const cssPath = join(__dirname, '../header/header.css');
    const cssContent = readFileSync(cssPath, 'utf8');
    
    const headerHtml = renderHeader(empresa, cotizacion);
    const introduccionHtml = renderIntroduccion(cotizacion);
    const tablaHtml = renderTabla(cotizacion);
    const cierreHtml = renderCierre(cotizacion);
    const footerHtml = renderFooter(page, pages);
    
    template = template.replace(/\$\{css\}/g, cssContent);
    template = template.replace(/\$\{header\}/g, headerHtml);
    template = template.replace(/\$\{introduccion\}/g, introduccionHtml);
    template = template.replace(/\$\{tabla\}/g, tablaHtml);
    template = template.replace(/\$\{cierre\}/g, cierreHtml);
    template = template.replace(/\$\{footer\}/g, footerHtml);
    template = template.replace(/\$\{cotizacion.numero\}/g, cotizacion.numero ?? '');
    
    return template;
}