"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMain = renderMain;
const fs_1 = require("fs");
const path_1 = require("path");
const header_1 = require("../header/header");
const cierre_1 = require("../cierre/cierre");
const footer_1 = require("../footer/footer");
const introduccion_1 = require("../introduccion/introduccion");
const table_1 = require("../table/table");
function renderMain(empresa, cotizacion, page, pages) {
    var _a;
    const templatePath = (0, path_1.join)(__dirname, 'main.html');
    let template = (0, fs_1.readFileSync)(templatePath, 'utf8');
    // Cargar CSS
    const cssPath = (0, path_1.join)(__dirname, '../header/header.css');
    const cssContent = (0, fs_1.readFileSync)(cssPath, 'utf8');
    const headerHtml = (0, header_1.renderHeader)(empresa, cotizacion);
    const introduccionHtml = (0, introduccion_1.renderIntroduccion)(cotizacion);
    const tablaHtml = (0, table_1.renderTabla)(cotizacion);
    const cierreHtml = (0, cierre_1.renderCierre)(cotizacion);
    const footerHtml = (0, footer_1.renderFooter)(page, pages);
    template = template.replace(/\$\{css\}/g, cssContent);
    template = template.replace(/\$\{header\}/g, headerHtml);
    template = template.replace(/\$\{introduccion\}/g, introduccionHtml);
    template = template.replace(/\$\{tabla\}/g, tablaHtml);
    template = template.replace(/\$\{cierre\}/g, cierreHtml);
    template = template.replace(/\$\{footer\}/g, footerHtml);
    template = template.replace(/\$\{cotizacion.numero\}/g, (_a = cotizacion.numero) !== null && _a !== void 0 ? _a : '');
    return template;
}
