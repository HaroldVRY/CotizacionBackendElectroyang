// Tipos para la base de datos
export interface Cliente {
  id?: number;
  nombre: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'usuario';
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  unidad?: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cotizacion {
  id?: number;
  numero: string;
  fecha: Date;
  clienteId: number;
  usuarioId: number;
  receptor?: string;
  observaciones?: string;
  tiempoEntrega: string;
  formaPago: string;
  estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada';
  subtotal: number;
  igv: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Campos adicionales de las consultas con JOIN
  clienteNombre?: string;
  usuarioNombre?: string;
  
  // Relaciones
  cliente?: Cliente;
  usuario?: Usuario;
  detalles?: DetalleCotizacion[];
}

export interface DetalleCotizacion {
  id?: number;
  cotizacionId: number;
  servicioId?: number;
  numeroItem: number;
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Campos adicionales de las consultas con JOIN
  servicioNombre?: string;
  
  // Relaciones
  servicio?: Servicio;
}

// Tipos para las APIs
export interface CreateCotizacionRequest {
  clienteId: number;
  receptor?: string;
  observaciones?: string;
  tiempoEntrega: string;
  formaPago: string;
  detalles: Omit<DetalleCotizacion, 'id' | 'cotizacionId' | 'total' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateCotizacionRequest extends Partial<CreateCotizacionRequest> {
  estado?: 'borrador' | 'enviada' | 'aprobada' | 'rechazada';
}

// Tipos existentes para reportes
export interface ItemCotizacion {
  numeroItem: number;
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  total: number;
}

export interface Banco {
  nombre: string;
  cuentaCorriente: string;
  cuentaInterbancaria: string;
}

export interface CotizacionReporte {
  numero: string;
  fecha: string;
  cliente: string;
  receptor: string;
  items: ItemCotizacion[];
  subtotal: number;
  igv: number;
  total: number;
  observaciones?: string;
  tiempoEntrega: string;
  formaPago: string;
  banco?: Banco;
  estado?: 'borrador' | 'aprobada' | 'rechazada' | 'enviada';
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

// Nota: Los tipos para formateo de reportes y opciones de PDF 
// se manejan ahora en el servicio externo de generación de reportes