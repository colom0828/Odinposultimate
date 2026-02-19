/**
 * ODIN POS - Control de Permisos por Rol
 * Define qué puede ver cada rol de usuario
 */

import { ReportCategory } from '../types/reports.types';

// Roles del sistema
export type UserRole = 'supervisor' | 'encargado' | 'gerente' | 'superadmin';

// Jerarquía de roles (de menor a mayor privilegio)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  supervisor: 1,
  encargado: 2,
  gerente: 3,
  superadmin: 4,
};

// ============================================
// PERMISOS POR ROL
// ============================================
export interface RolePermissions {
  role: UserRole;
  canViewCategories: ReportCategory[];
  canViewMoneyData: boolean;
  canViewMultiBranch: boolean;
  canExportReports: boolean;
  canViewEmployeeData: boolean;
  canViewDetailedMetrics: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  supervisor: {
    role: 'supervisor',
    canViewCategories: ['OPERATIONAL'],
    canViewMoneyData: false,
    canViewMultiBranch: false,
    canExportReports: true,
    canViewEmployeeData: false,
    canViewDetailedMetrics: true,
  },
  encargado: {
    role: 'encargado',
    canViewCategories: ['OPERATIONAL', 'INVENTORY', 'STAFF'],
    canViewMoneyData: false,
    canViewMultiBranch: false,
    canExportReports: true,
    canViewEmployeeData: true,
    canViewDetailedMetrics: true,
  },
  gerente: {
    role: 'gerente',
    canViewCategories: ['OPERATIONAL', 'INVENTORY', 'STAFF', 'FINANCIAL'],
    canViewMoneyData: true,
    canViewMultiBranch: false,
    canExportReports: true,
    canViewEmployeeData: true,
    canViewDetailedMetrics: true,
  },
  superadmin: {
    role: 'superadmin',
    canViewCategories: ['OPERATIONAL', 'INVENTORY', 'STAFF', 'FINANCIAL'],
    canViewMoneyData: true,
    canViewMultiBranch: true,
    canExportReports: true,
    canViewEmployeeData: true,
    canViewDetailedMetrics: true,
  },
};

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Verifica si un rol puede acceder a una categoría
 */
export function canAccessCategory(userRole: UserRole, category: ReportCategory): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.canViewCategories.includes(category);
}

/**
 * Verifica si un rol puede acceder a un reporte específico
 */
export function canAccessReport(userRole: UserRole, minRequiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRequiredRole];
}

/**
 * Verifica si un rol puede ver datos monetarios
 */
export function canViewMoneyData(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canViewMoneyData;
}

/**
 * Verifica si un rol puede ver datos multi-sucursal
 */
export function canViewMultiBranch(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canViewMultiBranch;
}

/**
 * Verifica si un rol puede exportar reportes
 */
export function canExportReports(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canExportReports;
}

/**
 * Filtra las categorías disponibles según el rol
 */
export function getAvailableCategories(userRole: UserRole): ReportCategory[] {
  return ROLE_PERMISSIONS[userRole].canViewCategories;
}

/**
 * Obtiene el nombre display del rol
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    supervisor: 'Supervisor',
    encargado: 'Encargado',
    gerente: 'Gerente',
    superadmin: 'Super Admin',
  };
  return names[role];
}

/**
 * Obtiene el badge de color del rol
 */
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    supervisor: 'blue',
    encargado: 'purple',
    gerente: 'green',
    superadmin: 'red',
  };
  return colors[role];
}
