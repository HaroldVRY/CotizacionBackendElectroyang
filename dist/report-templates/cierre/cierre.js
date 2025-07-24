"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCierre = renderCierre;
const fs_1 = require("fs");
const path_1 = require("path");
function formatCurrency(value) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
function renderCierre(cotizacion) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const templatePath = (0, path_1.join)(__dirname, 'cierre.html');
    let template = (0, fs_1.readFileSync)(templatePath, 'utf8');
    template = template.replace(/\$\{cotizacion\.total\}/g, formatCurrency(cotizacion.total));
    template = template.replace(/\$\{cotizacion\.tiempoEntrega\}/g, (_a = cotizacion.tiempoEntrega) !== null && _a !== void 0 ? _a : '');
    template = template.replace(/\$\{cotizacion\.formaPago\}/g, (_b = cotizacion.formaPago) !== null && _b !== void 0 ? _b : '');
    template = template.replace(/\$\{cotizacion\.banco\.nombre\}/g, (_d = (_c = cotizacion.banco) === null || _c === void 0 ? void 0 : _c.nombre) !== null && _d !== void 0 ? _d : '');
    template = template.replace(/\$\{cotizacion\.banco\.cuentaCorriente\}/g, (_f = (_e = cotizacion.banco) === null || _e === void 0 ? void 0 : _e.cuentaCorriente) !== null && _f !== void 0 ? _f : '');
    template = template.replace(/\$\{cotizacion\.banco\.cuentaInterbancaria\}/g, (_h = (_g = cotizacion.banco) === null || _g === void 0 ? void 0 : _g.cuentaInterbancaria) !== null && _h !== void 0 ? _h : '');
    return template;
}
