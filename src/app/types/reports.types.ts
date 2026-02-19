/**
 * ODIN POS - Tipos de Reportes
 * Sistema multi-vertical con control de roles
 */

import { BusinessType } from './config.types';

// ============================================
// CATEGORÍAS DE REPORTES
// ============================================
export type ReportCategory = 
  | 'OPERATIONAL'    // Reportes operativos (supervisor+)
  | 'INVENTORY'      // Inventario (encargado+)
  | 'STAFF'          // Personal (encargado+)
  | 'FINANCIAL';     // Financieros (gerente/superadmin)

// ============================================
// TIPOS DE REPORTES POR VERTICAL
// ============================================

// RESTAURANTE
export type RestaurantReportType =
  | 'ORDERS_BY_STATUS'
  | 'AVERAGE_TIMES'
  | 'TABLE_OCCUPATION'
  | 'KITCHEN_EFFICIENCY'
  | 'DELIVERY_PERFORMANCE'
  | 'TOP_PRODUCTS'
  | 'SALES_BY_CATEGORY'
  | 'DAILY_REVENUE'
  | 'WAITER_PERFORMANCE';

// SPA/SALÓN
export type SpaReportType =
  | 'APPOINTMENTS_BY_STATUS'
  | 'TOP_SERVICES'
  | 'TECHNICIAN_OCCUPATION'
  | 'PUNCTUALITY_ANALYSIS'
  | 'RECURRING_CLIENTS'
  | 'SERVICE_REVENUE'
  | 'DAILY_BOOKINGS';

// FERRETERÍA/RETAIL
export type RetailReportType =
  | 'SALES_BY_CATEGORY'
  | 'TOP_PRODUCTS'
  | 'INVENTORY_STATUS'
  | 'LOW_STOCK'
  | 'INVENTORY_ROTATION'
  | 'RETURNS_ANALYSIS'
  | 'DAILY_SALES'
  | 'SUPPLIER_PURCHASES';

// SERVICIO TÉCNICO
export type TechServiceReportType =
  | 'ORDERS_BY_STATUS'
  | 'AVERAGE_REPAIR_TIME'
  | 'TECHNICIAN_PRODUCTIVITY'
  | 'PARTS_USAGE'
  | 'SERVICE_REVENUE'
  | 'PENDING_ORDERS';

export type ReportType = 
  | RestaurantReportType 
  | SpaReportType 
  | RetailReportType 
  | TechServiceReportType;

// ============================================
// FILTROS DE REPORTES
// ============================================
export type DateRangePreset = 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH' | 'CUSTOM';

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ALL';

export interface ReportFilters {
  dateRange: DateRangePreset;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  shift?: ShiftType;
  employeeId?: string;
  categoryId?: string;
}

// ============================================
// DEFINICIÓN DE REPORTE
// ============================================
export interface ReportDefinition {
  id: string;
  type: ReportType;
  category: ReportCategory;
  businessTypes: BusinessType[]; // Verticales donde aplica
  minRole: 'supervisor' | 'encargado' | 'gerente' | 'superadmin';
  name: string;
  description: string;
  icon: string; // Nombre del ícono de lucide-react
  color: string; // Color temático
  hasMoneyData: boolean; // Si incluye montos ($)
  availableFilters: (keyof ReportFilters)[];
}

// ============================================
// KPIs Y MÉTRICAS
// ============================================
export interface ReportKPI {
  id: string;
  label: string;
  value: string | number;
  change?: number; // % de cambio vs periodo anterior
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  color?: string;
  isMoney?: boolean; // Si es dato monetario (ocultar según rol)
}

// ============================================
// DATOS DE REPORTE
// ============================================
export interface ReportData {
  reportId: string;
  type: ReportType;
  generatedAt: string;
  filters: ReportFilters;
  kpis: ReportKPI[];
  tableData?: ReportTableData;
  chartData?: ReportChartData;
}

// Tabla de datos
export interface ReportTableData {
  headers: ReportTableHeader[];
  rows: ReportTableRow[];
  totalRows: number;
}

export interface ReportTableHeader {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  isMoney?: boolean;
  sortable?: boolean;
}

export interface ReportTableRow {
  id: string;
  cells: Record<string, string | number>;
}

// Datos para gráficas
export interface ReportChartData {
  type: 'line' | 'bar' | 'pie' | 'donut';
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
}

// ============================================
// EXPORTACIÓN
// ============================================
export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV';

export interface ExportRequest {
  reportId: string;
  format: ExportFormat;
  filters: ReportFilters;
  includeCharts?: boolean;
}