/**
 * ODIN POS - Tipos para Módulo de Cocina (KDS)
 * Kitchen Display System para gestión de órdenes
 */

// ========================================
// ENUMS
// ========================================

export enum OrderStatus {
  NUEVA = 'nueva',
  EN_PREPARACION = 'en_preparacion',
  LISTA = 'lista',
  ENTREGADA = 'entregada',
}

export enum OrderType {
  MESA = 'mesa',
  PARA_LLEVAR = 'para_llevar',
  DELIVERY = 'delivery',
}

export enum Priority {
  NORMAL = 'normal',
  URGENTE = 'urgente',
}

// ========================================
// INTERFACES
// ========================================

export interface OrderItem {
  id: string;
  nombre: string;
  cantidad: number;
  notas?: string;
}

export interface KitchenOrder {
  id: string;
  numero: string; // Número de orden visual: #0001
  tipo: OrderType;
  mesaNumero?: number; // Si es tipo MESA
  status: OrderStatus;
  prioridad: Priority;
  items: OrderItem[];
  notasCliente?: string;
  horaCreacion: Date;
  horaInicio?: Date; // Cuando empezó la preparación
  horaLista?: Date; // Cuando se marcó como lista
}

// ========================================
// CONFIGURACIÓN DE ESTADOS
// ========================================

export const ORDER_STATUS_CONFIG = {
  [OrderStatus.NUEVA]: {
    label: 'Nueva',
    color: 'bg-gradient-to-br from-blue-600 to-purple-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-900/10',
    icon: 'Bell',
  },
  [OrderStatus.EN_PREPARACION]: {
    label: 'En Preparación',
    color: 'bg-gradient-to-br from-yellow-600 to-orange-600',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50 dark:bg-yellow-900/10',
    icon: 'ChefHat',
  },
  [OrderStatus.LISTA]: {
    label: 'Lista',
    color: 'bg-gradient-to-br from-green-600 to-emerald-600',
    borderColor: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgLight: 'bg-green-50 dark:bg-green-900/10',
    icon: 'CheckCircle',
  },
  [OrderStatus.ENTREGADA]: {
    label: 'Entregada',
    color: 'bg-gradient-to-br from-slate-600 to-slate-700',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-600 dark:text-slate-400',
    bgLight: 'bg-slate-50 dark:bg-slate-900/10',
    icon: 'Package',
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
