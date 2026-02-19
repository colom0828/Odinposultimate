/**
 * ODIN POS - Servicio de Órdenes de Servicio Técnico
 * Gestiona datos mock y preparado para integración con API
 */

import {
  ServiceOrder,
  ServiceOrderStatus,
  ServicePriority,
  ApprovalStatus,
  PartStatus,
  SyncStatus,
  EquipmentType,
} from '../types/serviceOrders.types';

// ========================================
// DATOS MOCK
// ========================================

const MOCK_TECHNICIANS = [
  { id: 'tech-1', name: 'Carlos Méndez' },
  { id: 'tech-2', name: 'Ana Rodríguez' },
  { id: 'tech-3', name: 'Luis Fernández' },
  { id: 'tech-4', name: 'María González' },
];

const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'OS-00087',
    customer: {
      id: 'cust-1',
      name: 'Roberto Jiménez',
      phone: '+506 8888-1234',
      email: 'roberto@email.com',
    },
    equipment: {
      type: EquipmentType.LAPTOP,
      brand: 'HP',
      model: 'Pavilion 15',
      serial: 'HP2024XYZ123',
      accessories: 'Cargador original, Bolso',
    },
    reportedIssue: 'No enciende, posible problema con batería o placa madre',
    diagnosis: 'Batería dañada confirmada, puerto de carga con daño menor',
    internalNotes: 'Cliente acepta cotización. Proceder con reemplazo.',
    status: ServiceOrderStatus.REPARACION,
    priority: ServicePriority.URGENTE,
    assignedTechnician: MOCK_TECHNICIANS[0],
    approval: {
      status: ApprovalStatus.APROBADO,
      note: 'Cliente aprobó por WhatsApp el 15/02',
      approvedAt: '2025-02-15T10:30:00Z',
    },
    parts: [
      {
        id: 'part-1',
        name: 'Batería HP Original',
        quantity: 1,
        status: PartStatus.RECIBIDO,
        cost: 45000,
        requestDate: '2025-02-14T09:00:00Z',
        receivedDate: '2025-02-16T14:00:00Z',
      },
    ],
    tasks: [
      { id: 'task-1', description: 'Diagnóstico inicial', completed: true, completedBy: 'tech-1', completedAt: '2025-02-14T11:00:00Z' },
      { id: 'task-2', description: 'Prueba de batería', completed: true, completedBy: 'tech-1', completedAt: '2025-02-14T11:30:00Z' },
      { id: 'task-3', description: 'Instalación de batería nueva', completed: false },
      { id: 'task-4', description: 'Prueba funcional completa', completed: false },
    ],
    log: [
      { id: 'log-1', timestamp: '2025-02-13T08:00:00Z', action: 'Orden creada', performedBy: 'Admin' },
      { id: 'log-2', timestamp: '2025-02-13T08:15:00Z', action: 'Asignado a técnico', performedBy: 'Admin', notes: 'Asignado a Carlos Méndez' },
      { id: 'log-3', timestamp: '2025-02-14T11:00:00Z', action: 'Diagnóstico completado', performedBy: 'Carlos Méndez' },
      { id: 'log-4', timestamp: '2025-02-15T10:30:00Z', action: 'Cliente aprobó reparación', performedBy: 'Admin' },
      { id: 'log-5', timestamp: '2025-02-16T14:00:00Z', action: 'Repuesto recibido', performedBy: 'Bodega' },
    ],
    createdAt: '2025-02-13T08:00:00Z',
    expectedDelivery: '2025-02-18T17:00:00Z',
    daysOld: 5,
    isOverdue: false,
    source: 'ODIN',
    syncStatus: SyncStatus.SYNCED,
  },
  {
    id: 'so-2',
    orderNumber: 'OS-00088',
    customer: {
      id: 'cust-2',
      name: 'Laura Vargas',
      phone: '+506 7777-5678',
      email: 'laura.vargas@company.com',
    },
    equipment: {
      type: EquipmentType.PC,
      brand: 'Dell',
      model: 'OptiPlex 7090',
      serial: 'DELL2024ABC456',
      accessories: 'Teclado, Mouse, Cable de poder',
    },
    reportedIssue: 'Lentitud extrema, ventilador hace ruido',
    diagnosis: '',
    status: ServiceOrderStatus.DIAGNOSTICO,
    priority: ServicePriority.NORMAL,
    assignedTechnician: MOCK_TECHNICIANS[1],
    approval: {
      status: ApprovalStatus.NO_REQUERIDO,
    },
    parts: [],
    tasks: [
      { id: 'task-5', description: 'Revisión de hardware', completed: true, completedBy: 'tech-2', completedAt: '2025-02-17T10:00:00Z' },
      { id: 'task-6', description: 'Análisis de software', completed: false },
      { id: 'task-7', description: 'Limpieza interna', completed: false },
    ],
    log: [
      { id: 'log-6', timestamp: '2025-02-17T09:00:00Z', action: 'Orden creada', performedBy: 'Recepción' },
      { id: 'log-7', timestamp: '2025-02-17T09:15:00Z', action: 'Asignado a técnico', performedBy: 'Admin', notes: 'Asignado a Ana Rodríguez' },
    ],
    createdAt: '2025-02-17T09:00:00Z',
    expectedDelivery: '2025-02-20T17:00:00Z',
    daysOld: 1,
    isOverdue: false,
    source: 'ODIN',
    syncStatus: SyncStatus.SYNCED,
  },
  {
    id: 'so-3',
    orderNumber: 'OS-00089',
    customer: {
      id: 'cust-3',
      name: 'Distribuidora El Sol',
      phone: '+506 2222-3344',
      email: 'servicios@elsol.cr',
    },
    equipment: {
      type: EquipmentType.IMPRESORA,
      brand: 'Epson',
      model: 'L3210',
      serial: 'EPSON789XYZ',
      accessories: 'Cable USB',
    },
    reportedIssue: 'No imprime, luz roja parpadeando',
    diagnosis: 'Cabezal obstruido, requiere limpieza profunda y recarga de tintas',
    internalNotes: 'Requiere aprobación porque superó presupuesto original',
    status: ServiceOrderStatus.APROBACION,
    priority: ServicePriority.NORMAL,
    assignedTechnician: MOCK_TECHNICIANS[2],
    approval: {
      status: ApprovalStatus.PENDIENTE,
      note: 'Esperando confirmación del cliente por llamada',
    },
    parts: [
      {
        id: 'part-2',
        name: 'Kit de tintas Epson',
        quantity: 1,
        status: PartStatus.DISPONIBLE,
        cost: 28000,
      },
    ],
    tasks: [
      { id: 'task-8', description: 'Diagnóstico', completed: true, completedBy: 'tech-2', completedAt: '2025-02-15T14:00:00Z' },
      { id: 'task-9', description: 'Limpieza de cabezal', completed: false },
      { id: 'task-10', description: 'Recarga de tintas', completed: false },
      { id: 'task-11', description: 'Prueba de impresión', completed: false },
    ],
    log: [
      { id: 'log-8', timestamp: '2025-02-14T16:00:00Z', action: 'Orden creada', performedBy: 'Recepción' },
      { id: 'log-9', timestamp: '2025-02-14T16:10:00Z', action: 'Asignado a técnico', performedBy: 'Admin' },
      { id: 'log-10', timestamp: '2025-02-15T14:00:00Z', action: 'Diagnóstico completado', performedBy: 'Luis Fernández' },
      { id: 'log-11', timestamp: '2025-02-16T09:00:00Z', action: 'Pendiente aprobación cliente', performedBy: 'Admin' },
    ],
    createdAt: '2025-02-14T16:00:00Z',
    expectedDelivery: '2025-02-19T17:00:00Z',
    daysOld: 4,
    isOverdue: false,
    source: 'ODIN',
    syncStatus: SyncStatus.SYNCED,
  },
  {
    id: 'so-4',
    orderNumber: 'OS-00090',
    customer: {
      id: 'cust-4',
      name: 'José Ramírez',
      phone: '+506 6666-9988',
    },
    equipment: {
      type: EquipmentType.MOVIL,
      brand: 'Samsung',
      model: 'Galaxy S21',
      serial: 'SAM2024S21789',
      accessories: 'Funda, Cable de carga',
    },
    reportedIssue: 'Pantalla quebrada, táctil no responde',
    status: ServiceOrderStatus.RECIBIDA,
    priority: ServicePriority.URGENTE,
    approval: {
      status: ApprovalStatus.NO_REQUERIDO,
    },
    parts: [],
    tasks: [],
    log: [
      { id: 'log-12', timestamp: '2025-02-18T08:30:00Z', action: 'Orden creada', performedBy: 'Recepción' },
    ],
    createdAt: '2025-02-18T08:30:00Z',
    daysOld: 0,
    isOverdue: false,
    source: 'ODIN',
    syncStatus: SyncStatus.SYNCED,
  },
  {
    id: 'so-5',
    orderNumber: 'OS-00091',
    customer: {
      id: 'cust-5',
      name: 'Patricia Solís',
      phone: '+506 8888-7766',
      email: 'paty.solis@gmail.com',
    },
    equipment: {
      type: EquipmentType.LAPTOP,
      brand: 'Lenovo',
      model: 'ThinkPad X1',
      serial: 'LENOVO2024XYZ',
      accessories: 'Cargador',
    },
    reportedIssue: 'Disco duro con errores, Windows no arranca',
    diagnosis: 'Disco duro dañado (sectores defectuosos). Recomendar reemplazo por SSD.',
    status: ServiceOrderStatus.LISTO,
    priority: ServicePriority.NORMAL,
    assignedTechnician: MOCK_TECHNICIANS[3],
    approval: {
      status: ApprovalStatus.APROBADO,
      approvedAt: '2025-02-11T11:00:00Z',
    },
    parts: [
      {
        id: 'part-3',
        name: 'SSD Kingston 500GB',
        quantity: 1,
        status: PartStatus.RECIBIDO,
        cost: 55000,
        requestDate: '2025-02-11T12:00:00Z',
        receivedDate: '2025-02-13T10:00:00Z',
      },
    ],
    tasks: [
      { id: 'task-12', description: 'Diagnóstico', completed: true, completedBy: 'tech-4', completedAt: '2025-02-11T10:00:00Z' },
      { id: 'task-13', description: 'Instalación de SSD', completed: true, completedBy: 'tech-4', completedAt: '2025-02-14T09:00:00Z' },
      { id: 'task-14', description: 'Instalación de Windows', completed: true, completedBy: 'tech-4', completedAt: '2025-02-14T15:00:00Z' },
      { id: 'task-15', description: 'Pruebas finales', completed: true, completedBy: 'tech-4', completedAt: '2025-02-15T11:00:00Z' },
    ],
    log: [
      { id: 'log-13', timestamp: '2025-02-10T14:00:00Z', action: 'Orden creada', performedBy: 'Recepción' },
      { id: 'log-14', timestamp: '2025-02-10T14:15:00Z', action: 'Asignado a técnico', performedBy: 'Admin' },
      { id: 'log-15', timestamp: '2025-02-11T10:00:00Z', action: 'Diagnóstico completado', performedBy: 'María González' },
      { id: 'log-16', timestamp: '2025-02-15T11:30:00Z', action: 'Reparación completada', performedBy: 'María González' },
      { id: 'log-17', timestamp: '2025-02-15T11:31:00Z', action: 'Marcado como listo', performedBy: 'María González' },
    ],
    createdAt: '2025-02-10T14:00:00Z',
    expectedDelivery: '2025-02-17T17:00:00Z',
    daysOld: 8,
    isOverdue: false,
    source: 'ODIN',
    syncStatus: SyncStatus.SYNCED,
  },
  {
    id: 'so-6',
    orderNumber: 'OS-00092',
    customer: {
      id: 'cust-6',
      name: 'TechMart SA',
      phone: '+506 2555-8899',
      email: 'soporte@techmart.cr',
    },
    equipment: {
      type: EquipmentType.ROUTER,
      brand: 'TP-Link',
      model: 'Archer AX50',
      serial: 'TPL2024ROUTER',
      accessories: 'Antenas (2), Cable ethernet',
    },
    reportedIssue: 'No emite señal WiFi, solo funciona por cable',
    diagnosis: 'Módulo WiFi dañado, requiere reemplazo completo',
    status: ServiceOrderStatus.CANCELADO,
    priority: ServicePriority.NORMAL,
    assignedTechnician: MOCK_TECHNICIANS[0],
    approval: {
      status: ApprovalStatus.RECHAZADO,
      note: 'Cliente decidió comprar equipo nuevo',
      approvedAt: '2025-02-09T16:00:00Z',
    },
    parts: [],
    tasks: [
      { id: 'task-16', description: 'Diagnóstico', completed: true, completedBy: 'tech-1', completedAt: '2025-02-08T10:00:00Z' },
    ],
    log: [
      { id: 'log-18', timestamp: '2025-02-07T11:00:00Z', action: 'Orden creada', performedBy: 'Recepción' },
      { id: 'log-19', timestamp: '2025-02-08T10:00:00Z', action: 'Diagnóstico completado', performedBy: 'Carlos Méndez' },
      { id: 'log-20', timestamp: '2025-02-09T16:00:00Z', action: 'Cliente rechazó reparación', performedBy: 'Admin' },
      { id: 'log-21', timestamp: '2025-02-09T16:05:00Z', action: 'Orden cancelada', performedBy: 'Admin' },
    ],
    createdAt: '2025-02-07T11:00:00Z',
    daysOld: 11,
    isOverdue: true,
    source: 'ODIN',
    syncStatus: SyncStatus.SYNCED,
  },
  {
    id: 'so-7',
    orderNumber: 'OS-00093',
    customer: {
      id: 'cust-7',
      name: 'Mónica Herrera',
      phone: '+506 7777-4455',
    },
    equipment: {
      type: EquipmentType.TABLET,
      brand: 'Apple',
      model: 'iPad Air',
      serial: 'APPLE2024IPAD',
    },
    reportedIssue: 'No carga, posible problema con puerto',
    status: ServiceOrderStatus.RECIBIDA,
    priority: ServicePriority.NORMAL,
    approval: {
      status: ApprovalStatus.NO_REQUERIDO,
    },
    parts: [],
    tasks: [],
    log: [
      { id: 'log-22', timestamp: '2025-02-18T10:00:00Z', action: 'Orden creada', performedBy: 'Recepción' },
    ],
    createdAt: '2025-02-18T10:00:00Z',
    daysOld: 0,
    isOverdue: false,
    source: 'API',
    syncStatus: SyncStatus.SYNCED,
    externalOrderId: 'EXT-2024-789',
  },
];

// ========================================
// KEY PARA LOCALSTORAGE
// ========================================

const STORAGE_KEY = 'odin_service_orders';

// ========================================
// HELPERS
// ========================================

function getStoredOrders(): ServiceOrder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_SERVICE_ORDERS;
  } catch {
    return MOCK_SERVICE_ORDERS;
  }
}

function saveOrders(orders: ServiceOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving service orders:', error);
  }
}

function calculateDaysOld(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ========================================
// API DE SERVICIO
// ========================================

export const serviceOrdersService = {
  /**
   * Obtener todas las órdenes
   */
  async getAll(): Promise<ServiceOrder[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const orders = getStoredOrders();
    
    // Actualizar daysOld calculado
    return orders.map(order => ({
      ...order,
      daysOld: calculateDaysOld(order.createdAt),
    }));
  },

  /**
   * Obtener orden por ID
   */
  async getById(id: string): Promise<ServiceOrder | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const orders = getStoredOrders();
    const order = orders.find(o => o.id === id);
    
    if (!order) return null;
    
    return {
      ...order,
      daysOld: calculateDaysOld(order.createdAt),
    };
  },

  /**
   * Crear nueva orden
   */
  async create(orderData: Partial<ServiceOrder>): Promise<ServiceOrder> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const orders = getStoredOrders();
    const lastOrderNumber = orders.length > 0 
      ? Math.max(...orders.map(o => parseInt(o.orderNumber.split('-')[1])))
      : 86;
    
    const newOrder: ServiceOrder = {
      id: `so-${Date.now()}`,
      orderNumber: `OS-${String(lastOrderNumber + 1).padStart(5, '0')}`,
      customer: orderData.customer!,
      equipment: orderData.equipment!,
      reportedIssue: orderData.reportedIssue || '',
      status: ServiceOrderStatus.RECIBIDA,
      priority: orderData.priority || ServicePriority.NORMAL,
      approval: {
        status: ApprovalStatus.NO_REQUERIDO,
      },
      parts: [],
      tasks: [],
      log: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Orden creada',
          performedBy: 'Sistema',
        },
      ],
      createdAt: new Date().toISOString(),
      daysOld: 0,
      isOverdue: false,
      source: 'ODIN',
      syncStatus: SyncStatus.SYNCED,
      ...orderData,
    };
    
    const updatedOrders = [...orders, newOrder];
    saveOrders(updatedOrders);
    
    return newOrder;
  },

  /**
   * Actualizar orden
   */
  async update(id: string, updates: Partial<ServiceOrder>): Promise<ServiceOrder> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === id);
    
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }
    
    const updatedOrder = {
      ...orders[index],
      ...updates,
      daysOld: calculateDaysOld(orders[index].createdAt),
    };
    
    orders[index] = updatedOrder;
    saveOrders(orders);
    
    return updatedOrder;
  },

  /**
   * Cambiar estado de orden
   */
  async changeStatus(id: string, newStatus: ServiceOrderStatus, performedBy: string): Promise<ServiceOrder> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === id);
    
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }
    
    const order = orders[index];
    const newLog: ServiceOrderLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: `Estado cambiado a ${newStatus}`,
      performedBy,
    };
    
    const updatedOrder = {
      ...order,
      status: newStatus,
      log: [...order.log, newLog],
      daysOld: calculateDaysOld(order.createdAt),
    };
    
    orders[index] = updatedOrder;
    saveOrders(orders);
    
    return updatedOrder;
  },

  /**
   * Asignar técnico
   */
  async assignTechnician(orderId: string, technicianId: string, technicianName: string, performedBy: string): Promise<ServiceOrder> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }
    
    const order = orders[index];
    const newLog: ServiceOrderLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Técnico asignado',
      performedBy,
      notes: `Asignado a ${technicianName}`,
    };
    
    const updatedOrder = {
      ...order,
      assignedTechnician: { id: technicianId, name: technicianName },
      log: [...order.log, newLog],
      daysOld: calculateDaysOld(order.createdAt),
    };
    
    orders[index] = updatedOrder;
    saveOrders(orders);
    
    return updatedOrder;
  },

  /**
   * Obtener técnicos disponibles
   */
  async getTechnicians() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_TECHNICIANS;
  },

  /**
   * Eliminar orden (soft delete)
   */
  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const orders = getStoredOrders();
    const filteredOrders = orders.filter(o => o.id !== id);
    saveOrders(filteredOrders);
  },

  /**
   * Resetear a datos mock (desarrollo)
   */
  resetToMock(): void {
    saveOrders(MOCK_SERVICE_ORDERS);
  },
};
