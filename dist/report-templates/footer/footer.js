"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFooter = renderFooter;
const fs_1 = require("fs");
const path_1 = require("path");
function renderFooter(page, pages) {
    const templatePath = (0, path_1.join)(__dirname, 'footer.html');
    let template = (0, fs_1.readFileSync)(templatePath, 'utf8');
    template = template.replace(/\$\{page\}/g, page.toString());
    template = template.replace(/\$\{pages\}/g, pages.toString());
    return template;
}
