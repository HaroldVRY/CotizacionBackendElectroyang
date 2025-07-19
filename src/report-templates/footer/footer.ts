export function renderFooter(page: number, pages: number): string {
    return `
        <div class="footer">
            <p>Página ${page} de ${pages}</p>
        </div>
    `;
}