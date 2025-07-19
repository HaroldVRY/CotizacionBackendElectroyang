import { EmpresaInfo } from './types/index';

export const empresaConfig: EmpresaInfo = {
  nombre: 'ELECTROYANG',
  servicio: 'SERVICIO DE BOBINADO DE TRANSFORMADORES ELÉCTRICOS Y REPARACIONES',
  ciudad: 'Lima'
};

export const reportConfig = {
  defaultCurrency: 'PEN',
  dateFormat: {
    locale: 'es-PE',
    options: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  },
  pdfOptions: {
    format: 'A4' as const,
    border: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    },
    footer: {
      height: '10mm',
      contents: {
        default: '<div style="text-align: center; font-size: 10px;">Página {{page}} de {{pages}}</div>'
      }
    }
  }
};