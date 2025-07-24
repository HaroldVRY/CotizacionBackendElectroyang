"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogoBase64 = getLogoBase64;
exports.getImageBase64 = getImageBase64;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getLogoBase64() {
    try {
        const logoPath = path_1.default.join(__dirname, '..', 'public', 'img', 'logo.png');
        if (!fs_1.default.existsSync(logoPath)) {
            console.warn('Logo no encontrado en:', logoPath);
            return '';
        }
        const imageBuffer = fs_1.default.readFileSync(logoPath);
        const base64String = imageBuffer.toString('base64');
        return `data:image/png;base64,${base64String}`;
    }
    catch (error) {
        console.error('Error al cargar el logo:', error);
        return '';
    }
}
function getImageBase64(imagePath) {
    try {
        if (!fs_1.default.existsSync(imagePath)) {
            console.warn('Imagen no encontrada en:', imagePath);
            return '';
        }
        const imageBuffer = fs_1.default.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        const extension = path_1.default.extname(imagePath).toLowerCase();
        let mimeType = 'image/png';
        if (extension === '.jpg' || extension === '.jpeg') {
            mimeType = 'image/jpeg';
        }
        else if (extension === '.gif') {
            mimeType = 'image/gif';
        }
        else if (extension === '.svg') {
            mimeType = 'image/svg+xml';
        }
        return `data:${mimeType};base64,${base64String}`;
    }
    catch (error) {
        console.error('Error al cargar la imagen:', error);
        return '';
    }
}
