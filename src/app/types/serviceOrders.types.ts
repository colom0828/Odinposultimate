/**
 * ODIN POS - Tipos para Órdenes de Servicio Técnico
 * Sistema completo de gestión de reparaciones y servicios técnicos
 */

// ========================================
// ESTADOS DE ORDEN DE SERVICIO
// ========================================

export enum ServiceOrderStatus {
  RECIBIDA = 'recibida',
  DIAGNOSTICO = 'diagnostico',
  APROBACION = 'aprobacion',
  REPARACION = 'reparacion',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

// ========================================
// TIPOS DE EQUIPO
// ========================================

export enum EquipmentType {
  LAPTOP = 'laptop',
  PC = 'pc',
  IMPRESORA = 'impresora',
  MOVIL = 'movil',
  TABLET = 'tablet',
  MONITOR = 'monitor',
  ROUTER = 'router',
  OTRO = 'otro',
}

// ========================================
// PRIORIDAD
// ========================================

export enum ServicePriority {
  NORMAL = 'normal',
  URGENTE = 'urgente',
}

// ========================================
// ESTADO DE APROBACIÓN
// ========================================

export enum ApprovalStatus {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  NO_REQUERIDO = 'no_requerido',
}

// ========================================
// ESTADO DE REPUESTO
// ========================================

export enum PartStatus {
  DISPONIBLE = 'disponible',
  PENDIENTE = 'pendiente',
  RECIBIDO = 'recibido',
}

// ========================================
// ESTADO DE SINCRONIZACIÓN
// ========================================

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  ERROR = 'error',
}

// ========================================
// INTERFACES PRINCIPALES
// ========================================

export interface ServiceOrderCustomer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface ServiceOrderEquipment {
  type: EquipmentType;
  brand: string;
  model: string;
  serial?: string;
  accessories?: string; // Accesorios recibidos (ej: "Cargador, Bolso")
}

export interface ServiceOrderPart {
  id: string;
  name: string;
  quantity: number;
  status: PartStatus;
  cost?: number; // Oculto para rol Supervisor
  requestDate?: string;
  receivedDate?: string;
}

export interface ServiceOrderTask {
  id: string;
  description: string;
  completed: boolean;
  completedBy?: string; // ID del técnico
  completedAt?: string;
}

export interface ServiceOrderLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string; // Nombre del técnico/usuario
  notes?: string;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string; // Formato: OS-00087
  
  // Cliente
  customer: ServiceOrderCustomer;
  
  // Equipo
  equipment: ServiceOrderEquipment;
  
  // Problema y diagnóstico
  reportedIssue: string;
  diagnosis?: string;
  internalNotes?: string;
  
  // Estado y prioridad
  status: ServiceOrderStatus;
  priority: ServicePriority;
  
  // Técnico asignado
  assignedTechnician?: {
    id: string;
    name: string;
  };
  
  // Aprobación del cliente
  approval: {
    status: ApprovalStatus;
    note?: string;
    approvedAt?: string;
  };
  
  // Repuestos
  parts: ServiceOrderPart[];
  
  // Tareas/Checklist
  tasks: ServiceOrderTask[];
  
  // Log de acciones
  log: ServiceOrderLog[];
  
  // Fechas
  createdAt: string;
  expectedDelivery?: string;
  deliveredAt?: string;
  
  // SLA y antigüedad
  daysOld: number; // Calculado
  isOverdue: boolean; // Calculado
  
  // Integración externa
  externalOrderId?: string;
  source: 'ODIN' | 'API' | 'POS';
  syncStatus: SyncStatus;
  lastSyncAt?: string;
  
  // Entrega
  deliveryChecklist?: {
    equipmentTested: boolean;
    customerSatisfied: boolean;
    paymentReceived: boolean;
    warrantyIssued: boolean;
  };
  deliveryNotes?: string;
}

// ========================================
// CONFIGURACIÓN DE ESTADOS
// ========================================

export interface ServiceOrderStatusConfig {
  status: ServiceOrderStatus;
  label: string;
  color: string;
  icon: string;
  description: string;
}

export const SERVICE_ORDER_STATUS_CONFIG: Record<ServiceOrderStatus, ServiceOrderStatusConfig> = {
  [ServiceOrderStatus.RECIBIDA]: {
    status: ServiceOrderStatus.RECIBIDA,
    label: 'Recibida',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: 'Inbox',
    description: 'Orden recibida y registrada',
  },
  [ServiceOrderStatus.DIAGNOSTICO]: {
    status: ServiceOrderStatus.DIAGNOSTICO,
    label: 'Diagnóstico',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: 'Search',
    description: 'En proceso de diagnóstico',
  },
  [ServiceOrderStatus.APROBACION]: {
    status: ServiceOrderStatus.APROBACION,
    label: 'Aprobación',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: 'Clock',
    description: 'Esperando aprobación del cliente',
  },
  [ServiceOrderStatus.REPARACION]: {
    status: ServiceOrderStatus.REPARACION,
    label: 'Reparación',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: 'Wrench',
    description: 'En proceso de reparación',
  },
  [ServiceOrderStatus.LISTO]: {
    status: ServiceOrderStatus.LISTO,
    label: 'Listo',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: 'CheckCircle2',
    description: 'Listo para entrega',
  },
  [ServiceOrderStatus.ENTREGADO]: {
    status: ServiceOrderStatus.ENTREGADO,
    label: 'Entregado',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: 'Package',
    description: 'Entregado al cliente',
  },
  [ServiceOrderStatus.CANCELADO]: {
    status: ServiceOrderStatus.CANCELADO,
    label: 'Cancelado',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: 'XCircle',
    description: 'Orden cancelada',
  },
};

// ========================================
// CONFIGURACIÓN DE EQUIPOS
// ========================================

export const EQUIPMENT_TYPE_CONFIG: Record<EquipmentType, { label: string; icon: string }> = {
  [EquipmentType.LAPTOP]: { label: 'Laptop', icon: 'Laptop' },
  [EquipmentType.PC]: { label: 'PC Desktop', icon: 'Monitor' },
  [EquipmentType.IMPRESORA]: { label: 'Impresora', icon: 'Printer' },
  [EquipmentType.MOVIL]: { label: 'Móvil', icon: 'Smartphone' },
  [EquipmentType.TABLET]: { label: 'Tablet', icon: 'Tablet' },
  [EquipmentType.MONITOR]: { label: 'Monitor', icon: 'MonitorCheck' },
  [EquipmentType.ROUTER]: { label: 'Router', icon: 'Wifi' },
  [EquipmentType.OTRO]: { label: 'Otro', icon: 'Box' },
};

// ========================================
// FILTROS
// ========================================

export interface ServiceOrderFilters {
  search: string;
  status?: ServiceOrderStatus;
  priority?: ServicePriority;
  assignedTechnician?: string;
  isOverdue?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// ========================================
// API RESPONSE
// ========================================

export interface ServiceOrdersApiResponse {
  success: boolean;
  data: ServiceOrder[];
  total: number;
  page?: number;
  pageSize?: number;
  message?: string;
}
