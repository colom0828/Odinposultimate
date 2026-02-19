// ============================================
// TIPOS PARA DASHBOARD SUPERVISOR (OPERATIVO)
// ============================================
// Sin datos financieros, solo métricas operativas

// ========================================
// RESTAURANT DASHBOARD
// ========================================

export interface RealTimeMetrics {
  activeOrders: number;
  ordersInKitchen: number;
  deliveriesInRoute: number;
  tablesOccupied: number;
  tablesFree: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  units: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface TopCategory {
  id: string;
  name: string;
  orders: number;
  icon: string;
}

export interface TopCourier {
  id: string;
  name: string;
  deliveriesCompleted: number;
  avgDeliveryTime: number; // minutos
  avatar?: string;
}

export interface TopTable {
  id: string;
  tableNumber: string;
  rotationCount: number; // cuántas veces se ha usado hoy
  area: string;
}

export interface DailyPerformance {
  topProducts: TopProduct[];
  topCategory: TopCategory;
  topCourier: TopCourier;
  topTable: TopTable;
}

export interface OperationalAlert {
  id: string;
  type: 'DELAYED_ORDER' | 'OLD_ORDER' | 'LONG_TABLE' | 'LOW_STOCK' | 'DELAYED_APPOINTMENT' | 'SCHEDULE_GAP' | 'OVERBOOKED_TECHNICIAN' | 'NO_SHOW' | 'LOW_SUPPLIES';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string; // ID de la orden, mesa, producto, etc.
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'COCINERO' | 'CAJERO' | 'REPARTIDOR' | 'MESERO';
  status: 'active' | 'break' | 'offline';
  currentTask?: string;
  avatar?: string;
}

export interface StaffStatus {
  chefs: StaffMember[];
  cashiers: StaffMember[];
  couriers: StaffMember[];
  waiters: StaffMember[];
}

export interface SupervisorDashboardData {
  realTimeMetrics: RealTimeMetrics;
  dailyPerformance: DailyPerformance;
  alerts: OperationalAlert[];
  staffStatus: StaffStatus;
  lastUpdated?: string;
}

// ========================================
// SPA DASHBOARD
// ========================================

export interface SpaRealTimeMetrics {
  appointmentsToday: number;
  appointmentsInProgress: number;
  upcomingAppointments: number;
  cancelledToday: number;
  activeStaff: number;
  scheduleOccupation: number; // porcentaje
}

export interface DailyAppointment {
  id: string;
  time: string;
  client: string;
  service: string;
  technicianName: string;  // Nombre del estilista/especialista
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  duration: number; // minutos
  room: string;
}

export interface TopService {
  id: string;
  name: string;
  category: string;
  count: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface SpaTechnician {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  currentTask: string | null;
  appointmentsToday: number;
  nextAvailable: string;
  efficiency: number; // porcentaje
}

export interface SpaSupervisorDashboardData {
  realTimeMetrics: SpaRealTimeMetrics;
  dailySchedule: DailyAppointment[];
  topServices: TopService[];
  alerts: OperationalAlert[];
  staffStatus: SpaTechnician[];
  lastUpdated?: string;
}