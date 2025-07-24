"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderIntroduccion = renderIntroduccion;
const fs_1 = require("fs");
const path_1 = require("path");
function renderIntroduccion(cotizacion) {
    var _a, _b;
    const templatePath = (0, path_1.join)(__dirname, 'introduccion.html');
    let template = (0, fs_1.readFileSync)(templatePath, 'utf8');
    template = template.replace(/\$\{cotizacion\.cliente\}/g, (_a = cotizacion.cliente) !== null && _a !== void 0 ? _a : '');
    template = template.replace(/\$\{cotizacion\.receptor\}/g, (_b = cotizacion.receptor) !== null && _b !== void 0 ? _b : '');
    return template;
}
