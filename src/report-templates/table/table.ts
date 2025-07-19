export function renderTabla(cotizacion: any): string {
    return `
        <table class="table">
            <thead>
                <tr>
                    <th>ITEM</th>
                    <th>CANT</th>
                    <th>DESCRIPCIÓN</th>
                    <th class="text-right">PRECIO UNIT(S/.)</th>
                    <th class="text-right">PRECIO TOTAL(S/.)</th>
                </tr>
            </thead>
            <tbody>
                ${cotizacion.items.map((item: any) => `
                <tr>
                    <td class="text-center">${item.numeroItem}</td>
                    <td class="text-center">${item.cantidad}</td>
                    <td>${item.descripcion}</td>
                    <td class="text-right">${item.precioUnitarioFormatted}</td>
                    <td class="text-right">${item.totalFormatted}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="total">
            <strong>TOTAL: ${cotizacion.precioTotalFormatted}</strong>
        </div>
        ${cotizacion.observaciones ? `
        <div class="observaciones">
            <strong>Observaciones:</strong> ${cotizacion.observaciones}
        </div>
        ` : ''}
    `;
}