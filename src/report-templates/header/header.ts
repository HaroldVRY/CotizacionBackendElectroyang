export function renderHeader(empresa: any, cotizacion: any): string {
    return `
        <div class="header">
            <div class="company-name">${empresa.nombre}</div>
            <div class="document-title">${empresa.servicio}</div>
            <div class="document-info">
                <div><strong>Cotización Nº</strong> ${cotizacion.numero}</div>
                <div><strong>Fecha:</strong> ${cotizacion.fecha}</div>
            </div>
        </div>
        <div class="client-info">
            <p><strong>Señores:</strong><br>${cotizacion.cliente}</p>
            <p><strong>Atención:</strong> ${cotizacion.receptor}</p>
        </div>
    `;
}