import { readFileSync } from 'fs';
import { join } from 'path';

export function renderFooter(page: number, pages: number): string {
    const templatePath = join(__dirname, 'footer.html');
    let template = readFileSync(templatePath, 'utf8');
    template = template.replace(/\$\{page\}/g, page.toString());
    template = template.replace(/\$\{pages\}/g, pages.toString());
    return template;
}