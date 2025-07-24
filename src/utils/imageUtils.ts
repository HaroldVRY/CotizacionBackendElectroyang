import fs from 'fs';
import path from 'path';

export function getLogoBase64(): string {
  try {
    const logoPath = path.join(__dirname, '..', 'public', 'img', 'logo.png');
    
    if (!fs.existsSync(logoPath)) {
      console.warn('Logo no encontrado en:', logoPath);
      return '';
    }
    
    const imageBuffer = fs.readFileSync(logoPath);
    const base64String = imageBuffer.toString('base64');
    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error('Error al cargar el logo:', error);
    return '';
  }
}

export function getImageBase64(imagePath: string): string {
  try {
    if (!fs.existsSync(imagePath)) {
      console.warn('Imagen no encontrada en:', imagePath);
      return '';
    }
    
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    const extension = path.extname(imagePath).toLowerCase();
    
    let mimeType = 'image/png';
    if (extension === '.jpg' || extension === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (extension === '.gif') {
      mimeType = 'image/gif';
    } else if (extension === '.svg') {
      mimeType = 'image/svg+xml';
    }
    
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    return '';
  }
}
