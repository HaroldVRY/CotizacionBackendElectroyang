"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHeader = renderHeader;
const fs_1 = require("fs");
const path_1 = require("path");
const imageUtils_1 = require("../../utils/imageUtils");
function renderHeader(empresa, cotizacion) {
    var _a, _b, _c, _d;
    const templatePath = (0, path_1.join)(__dirname, 'header.html');
    let template = (0, fs_1.readFileSync)(templatePath, 'utf8');
    // Obtener el logo en Base64
    const logoBase64 = (0, imageUtils_1.getLogoBase64)();
    template = template.replace(/\$\{empresa\.nombre\}/g, (_a = empresa.nombre) !== null && _a !== void 0 ? _a : '');
    template = template.replace(/\$\{empresa\.servicio\}/g, (_b = empresa.servicio) !== null && _b !== void 0 ? _b : '');
    template = template.replace(/\$\{cotizacion\.numero\}/g, (_c = cotizacion.numero) !== null && _c !== void 0 ? _c : '');
    template = template.replace(/\$\{cotizacion\.fecha\}/g, (_d = cotizacion.fecha) !== null && _d !== void 0 ? _d : '');
    template = template.replace(/\$\{logoBase64\}/g, logoBase64);
    return template;
}
