/**
 * ODIN POS - Modelo Unificado de Órdenes
 * Compartido entre Cocina, Delivery y otros módulos
 */

// ========================================
// ENUMS
// ========================================

export enum OrderType {
  MESA = 'MESA',
  PARA_LLEVAR = 'PARA_LLEVAR',
  DELIVERY = 'DELIVERY',
}

export enum KitchenStatus {
  NUEVA = 'NUEVA',
  PREPARANDO = 'PREPARANDO',
  LISTA = 'LISTA',
  ENTREGADA = 'ENTREGADA',
}

export enum DeliveryStatus {
  PENDIENTE_ASIGNAR = 'PENDIENTE_ASIGNAR',
  EN_RUTA = 'EN_RUTA',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export enum Priority {
  NORMAL = 'NORMAL',
  URGENTE = 'URGENTE',
}

// ========================================
// INTERFACES
// ========================================

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price?: number;
  notes?: string;
}

export interface Customer {
  name: string;
  phone?: string;
  email?: string;
}

export interface DeliveryInfo {
  address: string;
  addressNumber: string;
  reference?: string;
  neighborhood?: string;
  city?: string;
  postalCode?: string;
  courierId?: string;
  courierName?: string;
  deliveryCost?: number;
}

// Metadata de integración con sistemas externos
export interface OrderIntegration {
  externalOrderId?: string; // ID del sistema externo
  channel: 'ODIN' | 'POS_EXTERNO' | 'API' | 'WEB' | 'MOBILE';
  receivedAt?: string; // Timestamp de recepción
  syncStatus?: 'SYNCED' | 'PENDING' | 'FAILED';
  lastSyncAt?: string;
  failedReason?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // #0001
  type: OrderType;
  
  // Para MESA
  area?: string; // "salon" | "terraza"
  tableNumber?: string;
  
  // Para DELIVERY y PARA_LLEVAR
  customer?: Customer;
  
  // Solo para DELIVERY
  delivery?: DeliveryInfo;
  
  // Items y totales
  items: OrderItem[];
  notes?: string;
  subtotal: number;
  discount?: number;
  total: number;
  paymentMethod?: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  
  // Estados
  kitchenStatus: KitchenStatus;
  deliveryStatus?: DeliveryStatus;
  priority: Priority;
  
  // Integración con sistemas externos
  integration?: OrderIntegration;
  
  // Timestamps
  createdAt: string;
  kitchenStartedAt?: string;
  kitchenReadyAt?: string;
  deliveryAssignedAt?: string;
  deliveryStartedAt?: string;
  deliveryCompletedAt?: string;
  canceledAt?: string;
  cancelReason?: string;
}

// ========================================
// CONFIGURACIÓN DE ESTADOS (UI)
// ========================================

export const KITCHEN_STATUS_CONFIG = {
  [KitchenStatus.NUEVA]: {
    label: 'Nueva',
    color: 'bg-gradient-to-br from-blue-600 to-purple-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'Bell',
  },
  [KitchenStatus.PREPARANDO]: {
    label: 'Preparando',
    color: 'bg-gradient-to-br from-yellow-600 to-orange-600',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/20',
    icon: 'ChefHat',
  },
  [KitchenStatus.LISTA]: {
    label: 'Lista',
    color: 'bg-gradient-to-br from-green-600 to-emerald-600',
    borderColor: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    icon: 'CheckCircle',
  },
  [KitchenStatus.ENTREGADA]: {
    label: 'Entregada',
    color: 'bg-gradient-to-br from-green-600 to-emerald-600',
    borderColor: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    icon: 'CheckCircle2',
  },
};

export const DELIVERY_STATUS_CONFIG = {
  [DeliveryStatus.PENDIENTE_ASIGNAR]: {
    label: 'Pendiente Asignar',
    color: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'Clock',
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

export const ORDER_TYPE_CONFIG = {
  [OrderType.MESA]: {
    label: 'Mesa',
    icon: 'Utensils',
    color: 'text-purple-600 dark:text-purple-400',
  },
  [OrderType.PARA_LLEVAR]: {
    label: 'Para Llevar',
    icon: 'ShoppingBag',
    color: 'text-blue-600 dark:text-blue-400',
  },
  [OrderType.DELIVERY]: {
    label: 'Delivery',
    icon: 'Bike',
    color: 'text-orange-600 dark:text-orange-400',
  },
};