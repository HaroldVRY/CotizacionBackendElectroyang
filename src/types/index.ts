export interface ItemCotizacion {
  numeroItem: number;
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
}

export interface Banco {
  nombre: string;
  cuentaCorriente: string;
  cuentaInterbancaria: string;
}

export interface Cotizacion {
  numero: string;
  fecha: string;
  cliente: string;
  receptor: string;
  items: ItemCotizacion[];
  observaciones?: string;
  tiempoEntrega: string;
  formaPago: string;
  banco?: Banco;
  estado?: 'borrador' | 'aprobada' | 'rechazada';
}

export interface EmpresaInfo {
  nombre: string;
  servicio: string;
  ciudad?: string;
  cuentasBancarias?: {
    bcp?: {
      corriente: string;
      interbancaria: string;
    };
  };
}

export interface CotizacionConCalculos extends Cotizacion {
  items: (ItemCotizacion & {
    total: number;
    precioUnitarioFormatted: string;
    totalFormatted: string;
  })[];
  precioTotal: number;
  precioTotalFormatted: string;
  precioTotalLetras: string;
  mostrarDatosBancarios: boolean;
}

export interface ReportOptions {
  format: 'A4' | 'Letter';
  border: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  footer: {
    height: string;
    contents: {
      default: string;
    };
  };
}