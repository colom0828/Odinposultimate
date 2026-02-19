/**
 * ODIN POS - Configuración Multi-Vertical de Empleados
 * Configuración dinámica de roles, métricas y columnas según tipo de negocio
 */

import { BusinessType } from '../types/config.types';
import type { LucideIcon } from 'lucide-react';

// ========================================
// TIPOS DE EMPLEADOS
// ========================================

export interface EmployeeRole {
  id: string;
  label: string;
  color: string;
  icon?: string;
  permissions?: string[];
  description?: string;
}

export interface EmployeeMetric {
  id: string;
  label: string;
  icon: string;
  color: string;
  format: 'number' | 'currency' | 'time' | 'percentage';
  showInTable: boolean;
  showInCard: boolean;
}

export interface EmployeeTableColumn {
  key: string;
  label: string;
  align: 'left' | 'center' | 'right';
  sortable: boolean;
  width?: string;
  format?: 'text' | 'badge' | 'currency' | 'date' | 'number';
  hideOnMobile?: boolean;
}

export interface EmployeeKPI {
  id: string;
  label: string;
  icon: string;
  color: string;
  calculateFrom: (employees: any[]) => number | string;
}

export interface EmployeesVerticalConfig {
  businessType: BusinessType;
  roles: EmployeeRole[];
  metrics: EmployeeMetric[];
  tableColumns: EmployeeTableColumn[];
  kpis: EmployeeKPI[];
  allowedStatuses: Array<'active' | 'inactive' | 'vacation' | 'suspended'>;
  defaultRole: string;
  customFields?: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date';
    required: boolean;
    options?: string[];
  }[];
}

// ========================================
// CONFIGURACIÓN POR VERTICAL
// ========================================

export const employeesConfig: Record<string, EmployeesVerticalConfig> = {
  
  // ========================================
  // RESTAURANTE
  // ========================================
  [BusinessType.RESTAURANT]: {
    businessType: BusinessType.RESTAURANT,
    
    roles: [
      {
        id: 'admin',
        label: 'Administrador',
        color: 'purple',
        icon: 'Shield',
        description: 'Control total del sistema',
      },
      {
        id: 'gerente',
        label: 'Gerente',
        color: 'indigo',
        icon: 'UserCog',
        description: 'Gestión operativa completa',
      },
      {
        id: 'supervisor',
        label: 'Supervisor',
        color: 'blue',
        icon: 'Eye',
        description: 'Supervisión de operaciones',
      },
      {
        id: 'cajero',
        label: 'Cajero',
        color: 'green',
        icon: 'DollarSign',
        description: 'Gestión de ventas y caja',
      },
      {
        id: 'mesero',
        label: 'Mesero',
        color: 'cyan',
        icon: 'Utensils',
        description: 'Atención en mesas',
      },
      {
        id: 'cocinero',
        label: 'Cocinero',
        color: 'orange',
        icon: 'ChefHat',
        description: 'Preparación de alimentos',
      },
      {
        id: 'repartidor',
        label: 'Repartidor',
        color: 'yellow',
        icon: 'Bike',
        description: 'Entregas a domicilio',
      },
      {
        id: 'bartender',
        label: 'Bartender',
        color: 'pink',
        icon: 'Wine',
        description: 'Preparación de bebidas',
      },
    ],
    
    metrics: [
      {
        id: 'ordenes_atendidas',
        label: 'Órdenes Atendidas',
        icon: 'ShoppingCart',
        color: 'blue',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'mesas_atendidas',
        label: 'Mesas Atendidas',
        icon: 'Utensils',
        color: 'cyan',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'tiempo_promedio_servicio',
        label: 'Tiempo Prom. Servicio',
        icon: 'Clock',
        color: 'orange',
        format: 'time',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'ventas_totales',
        label: 'Ventas Totales',
        icon: 'DollarSign',
        color: 'green',
        format: 'currency',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'propinas',
        label: 'Propinas',
        icon: 'Coins',
        color: 'yellow',
        format: 'currency',
        showInTable: false,
        showInCard: true,
      },
      {
        id: 'entregas_completadas',
        label: 'Entregas Completadas',
        icon: 'PackageCheck',
        color: 'emerald',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'calificacion_promedio',
        label: 'Calificación',
        icon: 'Star',
        color: 'amber',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
    ],
    
    tableColumns: [
      { key: 'name', label: 'Empleado', align: 'left', sortable: true, format: 'text' },
      { key: 'role', label: 'Rol', align: 'center', sortable: true, format: 'badge' },
      { key: 'email', label: 'Email', align: 'left', sortable: true, format: 'text', hideOnMobile: true },
      { key: 'phone', label: 'Teléfono', align: 'left', sortable: false, format: 'text', hideOnMobile: true },
      { key: 'ordenes_atendidas', label: 'Órdenes', align: 'center', sortable: true, format: 'number' },
      { key: 'ventas_totales', label: 'Ventas', align: 'right', sortable: true, format: 'currency', hideOnMobile: true },
      { key: 'calificacion_promedio', label: 'Rating', align: 'center', sortable: true, format: 'number' },
      { key: 'status', label: 'Estado', align: 'center', sortable: true, format: 'badge' },
      { key: 'actions', label: 'Acciones', align: 'center', sortable: false, format: 'text' },
    ],
    
    kpis: [
      {
        id: 'total_empleados',
        label: 'Total Empleados',
        icon: 'Users',
        color: 'blue',
        calculateFrom: (employees) => employees.length,
      },
      {
        id: 'activos',
        label: 'Activos',
        icon: 'UserCheck',
        color: 'green',
        calculateFrom: (employees) => employees.filter(e => e.status === 'active').length,
      },
      {
        id: 'meseros',
        label: 'Meseros',
        icon: 'Utensils',
        color: 'cyan',
        calculateFrom: (employees) => employees.filter(e => e.role === 'mesero').length,
      },
      {
        id: 'repartidores',
        label: 'Repartidores',
        icon: 'Bike',
        color: 'yellow',
        calculateFrom: (employees) => employees.filter(e => e.role === 'repartidor').length,
      },
    ],
    
    allowedStatuses: ['active', 'inactive', 'vacation'],
    defaultRole: 'mesero',
  },

  // ========================================
  // SPA / SALÓN DE BELLEZA
  // ========================================
  [BusinessType.SPA]: {
    businessType: BusinessType.SPA,
    
    roles: [
      {
        id: 'admin',
        label: 'Administrador',
        color: 'purple',
        icon: 'Shield',
        description: 'Control total del sistema',
      },
      {
        id: 'gerente',
        label: 'Gerente',
        color: 'indigo',
        icon: 'UserCog',
        description: 'Gestión del salón',
      },
      {
        id: 'supervisor',
        label: 'Supervisor',
        color: 'blue',
        icon: 'Eye',
        description: 'Supervisión de servicios',
      },
      {
        id: 'recepcionista',
        label: 'Recepcionista',
        color: 'green',
        icon: 'Phone',
        description: 'Atención y citas',
      },
      {
        id: 'estilista',
        label: 'Estilista',
        color: 'pink',
        icon: 'Scissors',
        description: 'Servicios de cabello',
      },
      {
        id: 'manicurista',
        label: 'Manicurista',
        color: 'rose',
        icon: 'Sparkles',
        description: 'Servicios de uñas',
      },
      {
        id: 'masajista',
        label: 'Masajista',
        color: 'cyan',
        icon: 'Hand',
        description: 'Masajes y terapias',
      },
      {
        id: 'cosmetologo',
        label: 'Cosmetólogo',
        color: 'amber',
        icon: 'Palette',
        description: 'Tratamientos faciales',
      },
      {
        id: 'barbero',
        label: 'Barbero',
        color: 'slate',
        icon: 'Users',
        description: 'Servicios de barbería',
      },
    ],
    
    metrics: [
      {
        id: 'citas_completadas',
        label: 'Citas Completadas',
        icon: 'CheckCircle',
        color: 'green',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'servicios_realizados',
        label: 'Servicios Realizados',
        icon: 'Briefcase',
        color: 'blue',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'citas_canceladas',
        label: 'Cancelaciones',
        icon: 'XCircle',
        color: 'red',
        format: 'number',
        showInTable: false,
        showInCard: true,
      },
      {
        id: 'tiempo_promedio_servicio',
        label: 'Tiempo Prom.',
        icon: 'Clock',
        color: 'orange',
        format: 'time',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'ingresos_generados',
        label: 'Ingresos',
        icon: 'DollarSign',
        color: 'emerald',
        format: 'currency',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'clientes_atendidos',
        label: 'Clientes',
        icon: 'Users',
        color: 'cyan',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'calificacion_promedio',
        label: 'Rating',
        icon: 'Star',
        color: 'yellow',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
    ],
    
    tableColumns: [
      { key: 'name', label: 'Empleado', align: 'left', sortable: true, format: 'text' },
      { key: 'role', label: 'Especialidad', align: 'center', sortable: true, format: 'badge' },
      { key: 'email', label: 'Email', align: 'left', sortable: true, format: 'text', hideOnMobile: true },
      { key: 'phone', label: 'Teléfono', align: 'left', sortable: false, format: 'text', hideOnMobile: true },
      { key: 'citas_completadas', label: 'Citas', align: 'center', sortable: true, format: 'number' },
      { key: 'servicios_realizados', label: 'Servicios', align: 'center', sortable: true, format: 'number' },
      { key: 'ingresos_generados', label: 'Ingresos', align: 'right', sortable: true, format: 'currency', hideOnMobile: true },
      { key: 'calificacion_promedio', label: 'Rating', align: 'center', sortable: true, format: 'number' },
      { key: 'status', label: 'Estado', align: 'center', sortable: true, format: 'badge' },
      { key: 'actions', label: 'Acciones', align: 'center', sortable: false, format: 'text' },
    ],
    
    kpis: [
      {
        id: 'total_empleados',
        label: 'Total Empleados',
        icon: 'Users',
        color: 'blue',
        calculateFrom: (employees) => employees.length,
      },
      {
        id: 'activos',
        label: 'Activos Hoy',
        icon: 'UserCheck',
        color: 'green',
        calculateFrom: (employees) => employees.filter(e => e.status === 'active').length,
      },
      {
        id: 'estilistas',
        label: 'Estilistas',
        icon: 'Scissors',
        color: 'pink',
        calculateFrom: (employees) => employees.filter(e => e.role === 'estilista').length,
      },
      {
        id: 'servicios_hoy',
        label: 'Servicios Hoy',
        icon: 'Briefcase',
        color: 'purple',
        calculateFrom: (employees) => employees.reduce((sum, e) => sum + (e.servicios_realizados || 0), 0),
      },
    ],
    
    allowedStatuses: ['active', 'inactive', 'vacation'],
    defaultRole: 'estilista',
    
    customFields: [
      {
        key: 'especialidad',
        label: 'Especialidad',
        type: 'select',
        required: true,
        options: ['Corte', 'Color', 'Peinado', 'Uñas', 'Pestañas', 'Maquillaje', 'Masajes'],
      },
      {
        key: 'certificaciones',
        label: 'Certificaciones',
        type: 'text',
        required: false,
      },
    ],
  },

  // ========================================
  // FERRETERÍA / HARDWARE
  // ========================================
  [BusinessType.HARDWARE]: {
    businessType: BusinessType.HARDWARE,
    
    roles: [
      {
        id: 'admin',
        label: 'Administrador',
        color: 'purple',
        icon: 'Shield',
        description: 'Control total',
      },
      {
        id: 'gerente',
        label: 'Gerente',
        color: 'indigo',
        icon: 'UserCog',
        description: 'Gestión de tienda',
      },
      {
        id: 'supervisor',
        label: 'Supervisor',
        color: 'blue',
        icon: 'Eye',
        description: 'Supervisión',
      },
      {
        id: 'vendedor',
        label: 'Vendedor',
        color: 'green',
        icon: 'ShoppingCart',
        description: 'Ventas al público',
      },
      {
        id: 'cajero',
        label: 'Cajero',
        color: 'emerald',
        icon: 'DollarSign',
        description: 'Gestión de caja',
      },
      {
        id: 'bodeguero',
        label: 'Bodeguero',
        color: 'orange',
        icon: 'Package',
        description: 'Control de inventario',
      },
      {
        id: 'especialista',
        label: 'Especialista Técnico',
        color: 'cyan',
        icon: 'Wrench',
        description: 'Asesoría técnica',
      },
    ],
    
    metrics: [
      {
        id: 'ventas_realizadas',
        label: 'Ventas',
        icon: 'ShoppingCart',
        color: 'blue',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'monto_vendido',
        label: 'Monto Total',
        icon: 'DollarSign',
        color: 'green',
        format: 'currency',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'clientes_atendidos',
        label: 'Clientes',
        icon: 'Users',
        color: 'cyan',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'productos_vendidos',
        label: 'Productos',
        icon: 'Package',
        color: 'orange',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'cotizaciones',
        label: 'Cotizaciones',
        icon: 'FileText',
        color: 'purple',
        format: 'number',
        showInTable: false,
        showInCard: true,
      },
    ],
    
    tableColumns: [
      { key: 'name', label: 'Empleado', align: 'left', sortable: true, format: 'text' },
      { key: 'role', label: 'Cargo', align: 'center', sortable: true, format: 'badge' },
      { key: 'email', label: 'Email', align: 'left', sortable: true, format: 'text', hideOnMobile: true },
      { key: 'phone', label: 'Teléfono', align: 'left', sortable: false, format: 'text', hideOnMobile: true },
      { key: 'ventas_realizadas', label: 'Ventas', align: 'center', sortable: true, format: 'number' },
      { key: 'monto_vendido', label: 'Monto', align: 'right', sortable: true, format: 'currency' },
      { key: 'clientes_atendidos', label: 'Clientes', align: 'center', sortable: true, format: 'number', hideOnMobile: true },
      { key: 'status', label: 'Estado', align: 'center', sortable: true, format: 'badge' },
      { key: 'actions', label: 'Acciones', align: 'center', sortable: false, format: 'text' },
    ],
    
    kpis: [
      {
        id: 'total_empleados',
        label: 'Total Empleados',
        icon: 'Users',
        color: 'blue',
        calculateFrom: (employees) => employees.length,
      },
      {
        id: 'activos',
        label: 'Activos',
        icon: 'UserCheck',
        color: 'green',
        calculateFrom: (employees) => employees.filter(e => e.status === 'active').length,
      },
      {
        id: 'vendedores',
        label: 'Vendedores',
        icon: 'ShoppingCart',
        color: 'purple',
        calculateFrom: (employees) => employees.filter(e => e.role === 'vendedor').length,
      },
      {
        id: 'bodegueros',
        label: 'Bodegueros',
        icon: 'Package',
        color: 'orange',
        calculateFrom: (employees) => employees.filter(e => e.role === 'bodeguero').length,
      },
    ],
    
    allowedStatuses: ['active', 'inactive', 'vacation', 'suspended'],
    defaultRole: 'vendedor',
  },

  // ========================================
  // SERVICIO TÉCNICO
  // ========================================
  [BusinessType.TECH_SERVICE]: {
    businessType: BusinessType.TECH_SERVICE,
    
    roles: [
      {
        id: 'admin',
        label: 'Administrador',
        color: 'purple',
        icon: 'Shield',
        description: 'Control total',
      },
      {
        id: 'gerente',
        label: 'Gerente',
        color: 'indigo',
        icon: 'UserCog',
        description: 'Gestión operativa',
      },
      {
        id: 'recepcionista',
        label: 'Recepcionista',
        color: 'green',
        icon: 'Phone',
        description: 'Atención al cliente',
      },
      {
        id: 'tecnico_senior',
        label: 'Técnico Senior',
        color: 'blue',
        icon: 'Wrench',
        description: 'Reparaciones avanzadas',
      },
      {
        id: 'tecnico',
        label: 'Técnico',
        color: 'cyan',
        icon: 'Wrench',
        description: 'Reparaciones generales',
      },
      {
        id: 'diagnostico',
        label: 'Diagnóstico',
        color: 'orange',
        icon: 'Search',
        description: 'Evaluación de equipos',
      },
    ],
    
    metrics: [
      {
        id: 'reparaciones_completadas',
        label: 'Reparaciones',
        icon: 'CheckCircle',
        color: 'green',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'diagnosticos_realizados',
        label: 'Diagnósticos',
        icon: 'Search',
        color: 'orange',
        format: 'number',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'tiempo_promedio',
        label: 'Tiempo Prom.',
        icon: 'Clock',
        color: 'blue',
        format: 'time',
        showInTable: true,
        showInCard: true,
      },
      {
        id: 'ingresos',
        label: 'Ingresos',
        icon: 'DollarSign',
        color: 'emerald',
        format: 'currency',
        showInTable: true,
        showInCard: true,
      },
    ],
    
    tableColumns: [
      { key: 'name', label: 'Empleado', align: 'left', sortable: true, format: 'text' },
      { key: 'role', label: 'Cargo', align: 'center', sortable: true, format: 'badge' },
      { key: 'email', label: 'Email', align: 'left', sortable: true, format: 'text', hideOnMobile: true },
      { key: 'reparaciones_completadas', label: 'Reparaciones', align: 'center', sortable: true, format: 'number' },
      { key: 'diagnosticos_realizados', label: 'Diagnósticos', align: 'center', sortable: true, format: 'number' },
      { key: 'ingresos', label: 'Ingresos', align: 'right', sortable: true, format: 'currency', hideOnMobile: true },
      { key: 'status', label: 'Estado', align: 'center', sortable: true, format: 'badge' },
      { key: 'actions', label: 'Acciones', align: 'center', sortable: false, format: 'text' },
    ],
    
    kpis: [
      {
        id: 'total_empleados',
        label: 'Total Empleados',
        icon: 'Users',
        color: 'blue',
        calculateFrom: (employees) => employees.length,
      },
      {
        id: 'activos',
        label: 'Activos',
        icon: 'UserCheck',
        color: 'green',
        calculateFrom: (employees) => employees.filter(e => e.status === 'active').length,
      },
      {
        id: 'tecnicos',
        label: 'Técnicos',
        icon: 'Wrench',
        color: 'cyan',
        calculateFrom: (employees) => employees.filter(e => e.role === 'tecnico' || e.role === 'tecnico_senior').length,
      },
      {
        id: 'reparaciones_hoy',
        label: 'Reparaciones Hoy',
        icon: 'Tool',
        color: 'orange',
        calculateFrom: (employees) => employees.reduce((sum, e) => sum + (e.reparaciones_completadas || 0), 0),
      },
    ],
    
    allowedStatuses: ['active', 'inactive', 'vacation'],
    defaultRole: 'tecnico',
  },
};

// ========================================
// HELPERS
// ========================================

export function getEmployeesConfig(businessType: BusinessType): EmployeesVerticalConfig {
  return employeesConfig[businessType] || employeesConfig[BusinessType.RESTAURANT];
}

export function getRoleConfig(businessType: BusinessType, roleId: string): EmployeeRole | undefined {
  const config = getEmployeesConfig(businessType);
  if (!config) return undefined;
  return config.roles.find(r => r.id === roleId);
}

export function getMetricConfig(businessType: BusinessType, metricId: string): EmployeeMetric | undefined {
  const config = getEmployeesConfig(businessType);
  if (!config) return undefined;
  return config.metrics.find(m => m.id === metricId);
}

export function getAvailableRoles(businessType: BusinessType): EmployeeRole[] {
  const config = getEmployeesConfig(businessType);
  if (!config) return [];
  return config.roles;
}

export function formatMetricValue(
  value: number | string,
  format: 'number' | 'currency' | 'time' | 'percentage'
): string {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'time':
      return `${value} min`;
    case 'percentage':
      return `${value}%`;
    case 'number':
    default:
      return value.toLocaleString('es-MX');
  }
}