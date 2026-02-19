/**
 * ODIN POS - Configuración de Dashboards por Vertical
 * Define cards, secciones y configuraciones según businessType y role
 */

import { BusinessType } from '../types/config.types';

// ========================================
// TIPOS DE CONFIGURACIÓN
// ========================================

export interface DashboardCard {
  id: string;
  label: string;
  icon: string;
  color: string;
  dataKey: string;
  format: 'number' | 'percentage' | 'time';
  showTrend?: boolean;
}

export interface DashboardSection {
  id: string;
  title: string;
  icon: string;
  componentType: 'operations' | 'performance' | 'alerts' | 'staff' | 'appointments' | 'services';
  order: number;
}

export interface DashboardConfig {
  businessType: BusinessType;
  role: 'supervisor' | 'admin' | 'cashier';
  title: string;
  subtitle: string;
  cards: DashboardCard[];
  sections: DashboardSection[];
  refreshInterval: number; // en milisegundos
}

// ========================================
// RESTAURANT - SUPERVISOR DASHBOARD
// ========================================

export const restaurantSupervisorDashboard: DashboardConfig = {
  businessType: BusinessType.RESTAURANT,
  role: 'supervisor',
  title: 'Dashboard Supervisor',
  subtitle: 'Vista operativa en tiempo real - Modalidad Restaurante',
  refreshInterval: 30000,
  
  cards: [
    {
      id: 'active_orders',
      label: 'Órdenes Activas',
      icon: 'ShoppingCart',
      color: 'blue',
      dataKey: 'activeOrders',
      format: 'number',
      showTrend: true,
    },
    {
      id: 'kitchen_orders',
      label: 'En Cocina',
      icon: 'ChefHat',
      color: 'orange',
      dataKey: 'ordersInKitchen',
      format: 'number',
    },
    {
      id: 'deliveries_route',
      label: 'Entregas en Ruta',
      icon: 'Bike',
      color: 'green',
      dataKey: 'deliveriesInRoute',
      format: 'number',
    },
    {
      id: 'tables_occupied',
      label: 'Mesas Ocupadas',
      icon: 'Utensils',
      color: 'purple',
      dataKey: 'tablesOccupied',
      format: 'number',
    },
    {
      id: 'tables_free',
      label: 'Mesas Libres',
      icon: 'CheckCircle',
      color: 'cyan',
      dataKey: 'tablesFree',
      format: 'number',
    },
  ],
  
  sections: [
    {
      id: 'real_time_operations',
      title: 'Operación en Tiempo Real',
      icon: 'Activity',
      componentType: 'operations',
      order: 1,
    },
    {
      id: 'daily_performance',
      title: 'Rendimiento del Día',
      icon: 'TrendingUp',
      componentType: 'performance',
      order: 2,
    },
    {
      id: 'operational_alerts',
      title: 'Alertas Operativas',
      icon: 'AlertTriangle',
      componentType: 'alerts',
      order: 3,
    },
    {
      id: 'staff_status',
      title: 'Estado del Personal',
      icon: 'Users',
      componentType: 'staff',
      order: 4,
    },
  ],
};

// ========================================
// SPA - SUPERVISOR DASHBOARD
// ========================================

export const spaSupervisorDashboard: DashboardConfig = {
  businessType: BusinessType.SPA,
  role: 'supervisor',
  title: 'Dashboard Supervisor',
  subtitle: 'Vista operativa en tiempo real - Modalidad Spa/Salón',
  refreshInterval: 30000,
  
  cards: [
    {
      id: 'appointments_today',
      label: 'Citas de Hoy',
      icon: 'Calendar',
      color: 'purple',
      dataKey: 'appointmentsToday',
      format: 'number',
      showTrend: true,
    },
    {
      id: 'in_progress',
      label: 'En Curso',
      icon: 'Clock',
      color: 'blue',
      dataKey: 'appointmentsInProgress',
      format: 'number',
    },
    {
      id: 'upcoming_2h',
      label: 'Próximas 2 Horas',
      icon: 'CalendarClock',
      color: 'orange',
      dataKey: 'upcomingAppointments',
      format: 'number',
    },
    {
      id: 'cancelled_today',
      label: 'Canceladas Hoy',
      icon: 'XCircle',
      color: 'red',
      dataKey: 'cancelledToday',
      format: 'number',
    },
    {
      id: 'active_staff',
      label: 'Técnicos Activos',
      icon: 'Users',
      color: 'green',
      dataKey: 'activeStaff',
      format: 'number',
    },
    {
      id: 'schedule_occupation',
      label: 'Ocupación Agenda',
      icon: 'TrendingUp',
      color: 'cyan',
      dataKey: 'scheduleOccupation',
      format: 'percentage',
    },
  ],
  
  sections: [
    {
      id: 'daily_schedule',
      title: 'Agenda del Día',
      icon: 'CalendarDays',
      componentType: 'appointments',
      order: 1,
    },
    {
      id: 'top_services',
      title: 'Servicios Más Solicitados',
      icon: 'Star',
      componentType: 'services',
      order: 2,
    },
    {
      id: 'operational_alerts',
      title: 'Alertas Operativas',
      icon: 'AlertTriangle',
      componentType: 'alerts',
      order: 3,
    },
    {
      id: 'staff_status',
      title: 'Estado del Personal',
      icon: 'UserCheck',
      componentType: 'staff',
      order: 4,
    },
  ],
};

// ========================================
// HARDWARE - SUPERVISOR DASHBOARD
// ========================================

export const hardwareSupervisorDashboard: DashboardConfig = {
  businessType: BusinessType.HARDWARE,
  role: 'supervisor',
  title: 'Dashboard Supervisor',
  subtitle: 'Vista operativa en tiempo real - Modalidad Ferretería',
  refreshInterval: 60000,
  
  cards: [
    {
      id: 'sales_today',
      label: 'Ventas Hoy',
      icon: 'ShoppingCart',
      color: 'blue',
      dataKey: 'salesToday',
      format: 'number',
    },
    {
      id: 'customers_attended',
      label: 'Clientes Atendidos',
      icon: 'Users',
      color: 'green',
      dataKey: 'customersAttended',
      format: 'number',
    },
    {
      id: 'pending_quotes',
      label: 'Cotizaciones Pendientes',
      icon: 'FileText',
      color: 'orange',
      dataKey: 'pendingQuotes',
      format: 'number',
    },
    {
      id: 'low_stock_alerts',
      label: 'Alertas de Stock',
      icon: 'AlertCircle',
      color: 'red',
      dataKey: 'lowStockAlerts',
      format: 'number',
    },
    {
      id: 'active_staff',
      label: 'Personal Activo',
      icon: 'UserCheck',
      color: 'purple',
      dataKey: 'activeStaff',
      format: 'number',
    },
  ],
  
  sections: [
    {
      id: 'sales_overview',
      title: 'Resumen de Ventas',
      icon: 'TrendingUp',
      componentType: 'operations',
      order: 1,
    },
    {
      id: 'inventory_alerts',
      title: 'Alertas de Inventario',
      icon: 'Package',
      componentType: 'alerts',
      order: 2,
    },
    {
      id: 'staff_status',
      title: 'Estado del Personal',
      icon: 'Users',
      componentType: 'staff',
      order: 3,
    },
  ],
};

// ========================================
// SELECTOR DE CONFIGURACIÓN
// ========================================

export function getDashboardConfig(
  businessType: BusinessType,
  role: 'supervisor' | 'admin' | 'cashier' = 'supervisor'
): DashboardConfig {
  // Por ahora solo tenemos configs para supervisor
  // En el futuro se pueden agregar más roles
  
  switch (businessType) {
    case BusinessType.RESTAURANT:
    case BusinessType.BAR:
    case BusinessType.CAFE:
    case BusinessType.FAST_FOOD:
      return restaurantSupervisorDashboard;
    
    case BusinessType.SPA:
      return spaSupervisorDashboard;
    
    case BusinessType.HARDWARE:
    case BusinessType.RETAIL:
    case BusinessType.WHOLESALE:
      return hardwareSupervisorDashboard;
    
    default:
      return restaurantSupervisorDashboard;
  }
}

export function getDashboardTitle(businessType: BusinessType): string {
  const config = getDashboardConfig(businessType);
  return config.title;
}

export function getDashboardSubtitle(businessType: BusinessType): string {
  const config = getDashboardConfig(businessType);
  return config.subtitle;
}
