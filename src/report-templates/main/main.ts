import { renderHeader } from '../header/header';
import { renderCierre } from '../cierre/cierre';
import { renderFooter } from '../footer/footer';
import { renderIntroduccion } from '../introduccion/introduccion';
import { renderTabla } from '../table/table';

export function renderMain(empresa: any, cotizacion: any, page: number, pages: number): string {
    const headerHtml = renderHeader(empresa, cotizacion);
    const introduccionHtml = renderIntroduccion(cotizacion);
    const tablaHtml = renderTabla(cotizacion);
    const cierreHtml = renderCierre(cotizacion);
    const footerHtml = renderFooter(page, pages);

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Cotización ${cotizacion.numero}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                .footer { text-align: center; font-size: 10px; margin-top: 40px; color: #888; }
            </style>
        </head>
        <body>
            ${headerHtml}
            ${introduccionHtml}
            ${tablaHtml}
            ${cierreHtml}
            ${footerHtml}
        </body>
        </html>
    `;
}

