/**
 * ODIN POS - Configuración de Reportes por Vertical
 * Define qué reportes están disponibles para cada tipo de negocio
 */

import { ReportDefinition } from '../types/reports.types';
import { BusinessType } from '../types/config.types';

// ============================================
// REPORTES PARA RESTAURANTE
// ============================================
const restaurantReports: ReportDefinition[] = [
  // OPERACIONALES
  {
    id: 'rest_orders_status',
    type: 'ORDERS_BY_STATUS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'supervisor',
    name: 'Órdenes por Estado',
    description: 'Cantidad de órdenes en cada etapa del proceso',
    icon: 'ClipboardList',
    color: 'blue',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'shift'],
  },
  {
    id: 'rest_avg_times',
    type: 'AVERAGE_TIMES',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'supervisor',
    name: 'Tiempos Promedio',
    description: 'Preparación, entrega y rotación de mesa',
    icon: 'Clock',
    color: 'purple',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'shift'],
  },
  {
    id: 'rest_table_occupation',
    type: 'TABLE_OCCUPATION',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.RESTAURANT],
    minRole: 'supervisor',
    name: 'Ocupación de Mesas',
    description: 'Rotación y mesas más usadas',
    icon: 'Users',
    color: 'green',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'shift'],
  },
  {
    id: 'rest_kitchen_efficiency',
    type: 'KITCHEN_EFFICIENCY',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'supervisor',
    name: 'Eficiencia de Cocina',
    description: 'Productividad por turno, backlog y retrasos',
    icon: 'ChefHat',
    color: 'orange',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'shift', 'employeeId'],
  },
  {
    id: 'rest_delivery_performance',
    type: 'DELIVERY_PERFORMANCE',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'supervisor',
    name: 'Desempeño Delivery',
    description: 'Entregas por repartidor, tiempos y retrasos',
    icon: 'Bike',
    color: 'cyan',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'employeeId'],
  },
  {
    id: 'rest_top_products',
    type: 'TOP_PRODUCTS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'supervisor',
    name: 'Productos Más Vendidos',
    description: 'Top 20 productos por cantidad (sin montos)',
    icon: 'TrendingUp',
    color: 'yellow',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'categoryId'],
  },

  // FINANCIEROS
  {
    id: 'rest_sales_category',
    type: 'SALES_BY_CATEGORY',
    category: 'FINANCIAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'gerente',
    name: 'Ventas por Categoría',
    description: 'Ingresos y cantidades por categoría de productos',
    icon: 'DollarSign',
    color: 'green',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'branchId'],
  },
  {
    id: 'rest_daily_revenue',
    type: 'DAILY_REVENUE',
    category: 'FINANCIAL',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'gerente',
    name: 'Ingresos Diarios',
    description: 'Evolución de ingresos por día',
    icon: 'TrendingUp',
    color: 'emerald',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'branchId'],
  },
  {
    id: 'rest_waiter_performance',
    type: 'WAITER_PERFORMANCE',
    category: 'STAFF',
    businessTypes: [BusinessType.RESTAURANT, BusinessType.BAR, BusinessType.CAFE],
    minRole: 'encargado',
    name: 'Desempeño de Meseros',
    description: 'Órdenes atendidas, propinas y ventas por mesero',
    icon: 'UserCheck',
    color: 'indigo',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'employeeId'],
  },
];

// ============================================
// REPORTES PARA SPA/SALÓN
// ============================================
const spaReports: ReportDefinition[] = [
  // OPERACIONALES
  {
    id: 'spa_appointments_status',
    type: 'APPOINTMENTS_BY_STATUS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.SPA],
    minRole: 'supervisor',
    name: 'Citas por Estado',
    description: 'Confirmadas, en proceso, completadas y canceladas',
    icon: 'Calendar',
    color: 'blue',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },
  {
    id: 'spa_top_services',
    type: 'TOP_SERVICES',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.SPA],
    minRole: 'supervisor',
    name: 'Servicios Más Solicitados',
    description: 'Top servicios por cantidad de citas',
    icon: 'Sparkles',
    color: 'pink',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },
  {
    id: 'spa_technician_occupation',
    type: 'TECHNICIAN_OCCUPATION',
    category: 'STAFF',
    businessTypes: [BusinessType.SPA],
    minRole: 'supervisor',
    name: 'Ocupación por Técnico',
    description: 'Citas atendidas y disponibilidad',
    icon: 'UserCog',
    color: 'purple',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'employeeId'],
  },
  {
    id: 'spa_punctuality',
    type: 'PUNCTUALITY_ANALYSIS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.SPA],
    minRole: 'supervisor',
    name: 'Análisis de Puntualidad',
    description: 'Retrasos en citas y tiempos de servicio',
    icon: 'Clock',
    color: 'orange',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'employeeId'],
  },
  {
    id: 'spa_recurring_clients',
    type: 'RECURRING_CLIENTS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.SPA],
    minRole: 'encargado',
    name: 'Clientes Recurrentes',
    description: 'Clientes con más visitas y frecuencia',
    icon: 'UserPlus',
    color: 'green',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },

  // FINANCIEROS
  {
    id: 'spa_service_revenue',
    type: 'SERVICE_REVENUE',
    category: 'FINANCIAL',
    businessTypes: [BusinessType.SPA],
    minRole: 'gerente',
    name: 'Ingresos por Servicio',
    description: 'Ingresos generados por tipo de servicio',
    icon: 'DollarSign',
    color: 'emerald',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'branchId'],
  },
  {
    id: 'spa_daily_bookings',
    type: 'DAILY_BOOKINGS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.SPA],
    minRole: 'supervisor',
    name: 'Reservas Diarias',
    description: 'Evolución de reservas por día',
    icon: 'CalendarDays',
    color: 'blue',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },
];

// ============================================
// REPORTES PARA RETAIL/FERRETERÍA
// ============================================
const retailReports: ReportDefinition[] = [
  // OPERACIONALES
  {
    id: 'retail_sales_category',
    type: 'SALES_BY_CATEGORY',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'supervisor',
    name: 'Ventas por Categoría',
    description: 'Cantidad de productos vendidos por categoría',
    icon: 'BarChart3',
    color: 'blue',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'categoryId'],
  },
  {
    id: 'retail_top_products',
    type: 'TOP_PRODUCTS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'supervisor',
    name: 'Productos Más Vendidos',
    description: 'Top 50 productos por cantidad',
    icon: 'TrendingUp',
    color: 'green',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'categoryId'],
  },

  // INVENTARIO
  {
    id: 'retail_inventory_status',
    type: 'INVENTORY_STATUS',
    category: 'INVENTORY',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'encargado',
    name: 'Estado de Inventario',
    description: 'Stock actual por categoría y SKU',
    icon: 'Package',
    color: 'purple',
    hasMoneyData: false,
    availableFilters: ['categoryId'],
  },
  {
    id: 'retail_low_stock',
    type: 'LOW_STOCK',
    category: 'INVENTORY',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'encargado',
    name: 'Stock Bajo',
    description: 'Productos con stock por debajo del mínimo',
    icon: 'AlertTriangle',
    color: 'red',
    hasMoneyData: false,
    availableFilters: ['categoryId'],
  },
  {
    id: 'retail_inventory_rotation',
    type: 'INVENTORY_ROTATION',
    category: 'INVENTORY',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'encargado',
    name: 'Rotación de Inventario',
    description: 'Productos con mayor y menor rotación',
    icon: 'Repeat',
    color: 'cyan',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'categoryId'],
  },
  {
    id: 'retail_returns',
    type: 'RETURNS_ANALYSIS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'encargado',
    name: 'Análisis de Devoluciones',
    description: 'Productos devueltos y motivos',
    icon: 'Undo2',
    color: 'orange',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },

  // FINANCIEROS
  {
    id: 'retail_daily_sales',
    type: 'DAILY_SALES',
    category: 'FINANCIAL',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'gerente',
    name: 'Ventas Diarias',
    description: 'Ingresos por día y evolución',
    icon: 'DollarSign',
    color: 'emerald',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'branchId'],
  },
  {
    id: 'retail_supplier_purchases',
    type: 'SUPPLIER_PURCHASES',
    category: 'FINANCIAL',
    businessTypes: [BusinessType.HARDWARE, BusinessType.RETAIL],
    minRole: 'gerente',
    name: 'Compras a Proveedores',
    description: 'Gastos en compras por proveedor',
    icon: 'Truck',
    color: 'blue',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },
];

// ============================================
// REPORTES PARA SERVICIO TÉCNICO
// ============================================
const techServiceReports: ReportDefinition[] = [
  // OPERACIONALES
  {
    id: 'tech_orders_status',
    type: 'ORDERS_BY_STATUS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.TECH_SERVICE],
    minRole: 'supervisor',
    name: 'Órdenes por Estado',
    description: 'Abiertas, en proceso y cerradas',
    icon: 'Wrench',
    color: 'blue',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },
  {
    id: 'tech_avg_repair_time',
    type: 'AVERAGE_REPAIR_TIME',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.TECH_SERVICE],
    minRole: 'supervisor',
    name: 'Tiempo Promedio de Reparación',
    description: 'Tiempo de atención por tipo de servicio',
    icon: 'Clock',
    color: 'purple',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },
  {
    id: 'tech_technician_productivity',
    type: 'TECHNICIAN_PRODUCTIVITY',
    category: 'STAFF',
    businessTypes: [BusinessType.TECH_SERVICE],
    minRole: 'supervisor',
    name: 'Productividad de Técnicos',
    description: 'Órdenes completadas por técnico',
    icon: 'UserCog',
    color: 'green',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'employeeId'],
  },
  {
    id: 'tech_parts_usage',
    type: 'PARTS_USAGE',
    category: 'INVENTORY',
    businessTypes: [BusinessType.TECH_SERVICE],
    minRole: 'encargado',
    name: 'Uso de Repuestos',
    description: 'Repuestos más utilizados',
    icon: 'Settings',
    color: 'orange',
    hasMoneyData: false,
    availableFilters: ['dateRange', 'startDate', 'endDate'],
  },

  // FINANCIEROS
  {
    id: 'tech_service_revenue',
    type: 'SERVICE_REVENUE',
    category: 'FINANCIAL',
    businessTypes: [BusinessType.TECH_SERVICE],
    minRole: 'gerente',
    name: 'Ingresos por Servicio',
    description: 'Ingresos generados por tipo de reparación',
    icon: 'DollarSign',
    color: 'emerald',
    hasMoneyData: true,
    availableFilters: ['dateRange', 'startDate', 'endDate', 'branchId'],
  },
  {
    id: 'tech_pending_orders',
    type: 'PENDING_ORDERS',
    category: 'OPERATIONAL',
    businessTypes: [BusinessType.TECH_SERVICE],
    minRole: 'supervisor',
    name: 'Órdenes Pendientes',
    description: 'Órdenes sin completar y antigüedad',
    icon: 'AlertCircle',
    color: 'red',
    hasMoneyData: false,
    availableFilters: ['employeeId'],
  },
];

// ============================================
// EXPORTAR TODOS LOS REPORTES
// ============================================
export const ALL_REPORTS: ReportDefinition[] = [
  ...restaurantReports,
  ...spaReports,
  ...retailReports,
  ...techServiceReports,
];

// Función helper para obtener reportes por tipo de negocio
export function getReportsByBusinessType(businessType: string): ReportDefinition[] {
  return ALL_REPORTS.filter(report => 
    report.businessTypes.includes(businessType as any)
  );
}

// Función helper para obtener reportes por categoría
export function getReportsByCategory(businessType: string, category: string): ReportDefinition[] {
  return getReportsByBusinessType(businessType).filter(
    report => report.category === category
  );
}