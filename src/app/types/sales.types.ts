/**
 * ODIN POS - Tipos para el módulo de Ventas
 * Preparado para integración con API backend
 */

// ========================================
// ENUMS
// ========================================

export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  MIXTO = 'MIXTO',
}

export enum SaleStatus {
  COMPLETADA = 'COMPLETADA',
  PENDIENTE = 'PENDIENTE',
  CANCELADA = 'CANCELADA',
  REEMBOLSADA = 'REEMBOLSADA',
}

export enum SaleType {
  MESA = 'MESA',
  PARA_LLEVAR = 'PARA_LLEVAR',
  DELIVERY = 'DELIVERY',
  MOSTRADOR = 'MOSTRADOR',
}

// ========================================
// INTERFACES
// ========================================

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount?: number;
  tax?: number;
  notes?: string;
  category?: string;
}

export interface SaleCustomer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
}

export interface SalePayment {
  method: PaymentMethod;
  amount: number;
  reference?: string; // Para transferencias/tarjetas
  change?: number; // Para efectivo
}

export interface Sale {
  // Identificación
  id: string;
  saleNumber: string; // V-0001, V-0002, etc.
  
  // Tipo y origen
  type: SaleType;
  origin?: string; // 'POS', 'WEB', 'MOBILE'
  
  // Cliente
  customer?: SaleCustomer;
  
  // Items
  items: SaleItem[];
  
  // Montos
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  
  // Pago
  payments: SalePayment[];
  paymentStatus: 'PAGADO' | 'PENDIENTE' | 'PARCIAL';
  
  // Estado
  status: SaleStatus;
  
  // Personal
  cashierId: string;
  cashierName: string;
  employeeId?: string;
  
  // Metadata
  notes?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
  
  // Para restaurante
  tableNumber?: string;
  area?: string;
  
  // Para delivery
  deliveryAddress?: string;
  deliveryFee?: number;
  
  // Timestamps
  createdAt: string;
  completedAt?: string;
  canceledAt?: string;
  refundedAt?: string;
  
  // Razones
  cancelReason?: string;
  refundReason?: string;
  
  // Metadata adicional para API
  syncedToBackend?: boolean;
  lastSyncAt?: string;
  backendId?: string;
}

// ========================================
// FILTROS Y REPORTES
// ========================================

export interface SalesFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: SaleStatus[];
  paymentMethod?: PaymentMethod[];
  type?: SaleType[];
  cashierId?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface SalesStats {
  totalSales: number;
  totalAmount: number;
  averageTicket: number;
  totalItems: number;
  
  // Por estado
  completedCount: number;
  pendingCount: number;
  canceledCount: number;
  refundedCount: number;
  
  // Por método de pago
  cashAmount: number;
  cardAmount: number;
  transferAmount: number;
  mixedAmount: number;
  
  // Por tipo
  mesaCount: number;
  paraLlevarCount: number;
  deliveryCount: number;
  mostradorCount: number;
  
  // Tendencias
  salesGrowth?: number; // Porcentaje vs período anterior
  topSellingProducts?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

// ========================================
// CONFIGURACIÓN DE UI
// ========================================

export const PAYMENT_METHOD_CONFIG = {
  [PaymentMethod.EFECTIVO]: {
    label: 'Efectivo',
    icon: 'Banknote',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/20',
  },
  [PaymentMethod.TARJETA]: {
    label: 'Tarjeta',
    icon: 'CreditCard',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  [PaymentMethod.TRANSFERENCIA]: {
    label: 'Transferencia',
    icon: 'ArrowRightLeft',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
  },
  [PaymentMethod.MIXTO]: {
    label: 'Mixto',
    icon: 'Wallet',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
  },
};

export const SALE_STATUS_CONFIG = {
  [SaleStatus.COMPLETADA]: {
    label: 'Completada',
    color: 'bg-gradient-to-br from-green-600 to-emerald-600',
    borderColor: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    icon: 'CheckCircle',
  },
  [SaleStatus.PENDIENTE]: {
    label: 'Pendiente',
    color: 'bg-gradient-to-br from-yellow-600 to-orange-600',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/20',
    icon: 'Clock',
  },
  [SaleStatus.CANCELADA]: {
    label: 'Cancelada',
    color: 'bg-gradient-to-br from-red-600 to-red-700',
    borderColor: 'border-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    icon: 'XCircle',
  },
  [SaleStatus.REEMBOLSADA]: {
    label: 'Reembolsada',
    color: 'bg-gradient-to-br from-gray-600 to-gray-700',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-600 dark:text-gray-400',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    icon: 'RotateCcw',
  },
};

export const SALE_TYPE_CONFIG = {
  [SaleType.MESA]: {
    label: 'Mesa',
    icon: 'Utensils',
    color: 'text-purple-600 dark:text-purple-400',
  },
  [SaleType.PARA_LLEVAR]: {
    label: 'Para Llevar',
    icon: 'ShoppingBag',
    color: 'text-blue-600 dark:text-blue-400',
  },
  [SaleType.DELIVERY]: {
    label: 'Delivery',
    icon: 'Bike',
    color: 'text-orange-600 dark:text-orange-400',
  },
  [SaleType.MOSTRADOR]: {
    label: 'Mostrador',
    icon: 'Store',
    color: 'text-green-600 dark:text-green-400',
  },
};
