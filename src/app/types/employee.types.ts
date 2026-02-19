/**
 * ODIN POS - Tipos de Empleados Multi-Vertical
 */

import { BusinessType } from './config.types';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string; // Dinámico según businessType
  status: 'active' | 'inactive' | 'vacation' | 'suspended';
  businessType: BusinessType;
  
  // Metadata
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  
  // Métricas - Restaurant
  ordenes_atendidas?: number;
  mesas_atendidas?: number;
  tiempo_promedio_servicio?: number;
  ventas_totales?: number;
  propinas?: number;
  entregas_completadas?: number;
  calificacion_promedio?: number;
  
  // Métricas - Spa
  citas_completadas?: number;
  servicios_realizados?: number;
  citas_canceladas?: number;
  ingresos_generados?: number;
  clientes_atendidos?: number;
  
  // Métricas - Hardware
  ventas_realizadas?: number;
  monto_vendido?: number;
  productos_vendidos?: number;
  cotizaciones?: number;
  
  // Métricas - Tech Service
  reparaciones_completadas?: number;
  diagnosticos_realizados?: number;
  tiempo_promedio?: number;
  ingresos?: number;
  
  // Campos personalizados
  customFields?: Record<string, any>;
}

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  businessType: BusinessType;
  customFields?: Record<string, any>;
}

export interface UpdateEmployeeDTO extends Partial<CreateEmployeeDTO> {
  id: string;
}

export interface EmployeeFilters {
  role?: string;
  status?: 'active' | 'inactive' | 'vacation' | 'suspended';
  searchTerm?: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  vacation: number;
  byRole: Record<string, number>;
}
