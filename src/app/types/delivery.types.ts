/**
 * ODIN POS - Tipos para Módulo de Delivery
 * Sistema de gestión de pedidos a domicilio
 */

// ========================================
// ENUMS
// ========================================

export enum DeliveryStatus {
  NUEVO = 'nuevo',
  PREPARANDO = 'preparando',
  EN_RUTA = 'en_ruta',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

export enum PaymentMethod {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
}

export enum DeliveryPriority {
  NORMAL = 'normal',
  URGENTE = 'urgente',
}

// ========================================
// INTERFACES
// ========================================

export interface DeliveryItem {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  notas?: string;
}

export interface DeliveryAddress {
  calle: string;
  numero: string;
  referencia?: string;
  colonia?: string;
  ciudad?: string;
  codigoPostal?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface DeliveryCourier {
  id: string;
  nombre: string;
  telefono: string;
  vehiculo: 'moto' | 'bicicleta' | 'auto';
  disponible: boolean;
  pedidosActivos: number;
}

export interface DeliveryOrder {
  id: string;
  numero: string; // #DEL-0001
  cliente: {
    nombre: string;
    telefono: string;
    email?: string;
  };
  direccion: DeliveryAddress;
  items: DeliveryItem[];
  subtotal: number;
  costoEnvio: number;
  descuento: number;
  total: number;
  metodoPago: PaymentMethod;
  status: DeliveryStatus;
  prioridad: DeliveryPriority;
  repartidor?: DeliveryCourier;
  notas?: string;
  horaCreacion: Date;
  horaPreparacion?: Date;
  horaSalida?: Date;
  horaEntrega?: Date;
  horaCancelacion?: Date;
  razonCancelacion?: string;
  tiempoEstimado?: number; // minutos
}

// ========================================
// CONFIGURACIÓN DE ESTADOS
// ========================================

export const DELIVERY_STATUS_CONFIG = {
  [DeliveryStatus.NUEVO]: {
    label: 'Nuevo',
    color: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'Bell',
  },
  [DeliveryStatus.PREPARANDO]: {
    label: 'Preparando',
    color: 'bg-gradient-to-br from-yellow-600 to-orange-600',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/20',
    icon: 'ChefHat',
  },
  [DeliveryStatus.EN_RUTA]: {
    label: 'En Ruta',
    color: 'bg-gradient-to-br from-purple-600 to-pink-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    icon: 'Bike',
  },
  [DeliveryStatus.ENTREGADO]: {
    label: 'Entregado',
    color: 'bg-gradient-to-br from-green-600 to-emerald-600',
    borderColor: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    icon: 'CheckCircle2',
  },
  [DeliveryStatus.CANCELADO]: {
    label: 'Cancelado',
    color: 'bg-gradient-to-br from-red-600 to-red-700',
    borderColor: 'border-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    icon: 'XCircle',
  },
};

export const PAYMENT_METHOD_CONFIG = {
  [PaymentMethod.EFECTIVO]: {
    label: 'Efectivo',
    icon: 'Banknote',
    color: 'text-green-600 dark:text-green-400',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
  },
  [PaymentMethod.TARJETA]: {
    label: 'Tarjeta',
    icon: 'CreditCard',
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
  },
  [PaymentMethod.TRANSFERENCIA]: {
    label: 'Transferencia',
    icon: 'Smartphone',
    color: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
  },
};

export const COURIER_VEHICLE_CONFIG = {
  moto: {
    label: 'Moto',
    icon: 'Bike',
    color: 'text-orange-600 dark:text-orange-400',
  },
  bicicleta: {
    label: 'Bicicleta',
    icon: 'Bike',
    color: 'text-green-600 dark:text-green-400',
  },
  auto: {
    label: 'Auto',
    icon: 'Car',
    color: 'text-blue-600 dark:text-blue-400',
  },
};
