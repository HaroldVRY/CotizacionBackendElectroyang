"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToWords = numberToWords;
const UNIDADES = [
    'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'
];
const DECENAS = [
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis',
    'diecisiete', 'dieciocho', 'diecinueve'
];
const DIEZ_DIEZ = [
    '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta',
    'sesenta', 'setenta', 'ochenta', 'noventa'
];
const CIENTOS = [
    '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos',
    'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
];
function convertNumber(num) {
    if (num < 10)
        return UNIDADES[num];
    if (num < 20)
        return DECENAS[num - 10];
    if (num < 100) {
        const decena = Math.floor(num / 10);
        const unidad = num % 10;
        if (unidad === 0)
            return DIEZ_DIEZ[decena];
        return DIEZ_DIEZ[decena] + ' y ' + UNIDADES[unidad];
    }
    if (num < 1000) {
        const centena = Math.floor(num / 100);
        const resto = num % 100;
        if (resto === 0) {
            return centena === 1 ? 'cien' : CIENTOS[centena];
        }
        return CIENTOS[centena] + ' ' + convertNumber(resto);
    }
    if (num < 1000000) {
        const millar = Math.floor(num / 1000);
        const resto = num % 1000;
        if (millar === 1) {
            return resto === 0 ? 'mil' : 'mil ' + convertNumber(resto);
        }
        return convertNumber(millar) + ' mil' + (resto === 0 ? '' : ' ' + convertNumber(resto));
    }
    if (num < 1000000000) {
        const millon = Math.floor(num / 1000000);
        const resto = num % 1000000;
        if (millon === 1) {
            return resto === 0 ? 'un millón' : 'un millón ' + convertNumber(resto);
        }
        return convertNumber(millon) + ' millones' + (resto === 0 ? '' : ' ' + convertNumber(resto));
    }
    return 'Número demasiado grande';
}
function numberToWords(num) {
    if (num === 0)
        return 'cero';
    let result = '';
    const entero = Math.floor(num);
    const decimal = Math.round((num - entero) * 100);
    if (entero > 0) {
        result = convertNumber(entero);
    }
    if (decimal > 0) {
        if (result)
            result += ' con ';
        result += convertNumber(decimal);
    }
    return result;
}
