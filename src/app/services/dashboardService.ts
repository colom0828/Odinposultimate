/**
 * ODIN POS - Dashboard Service
 * Servicio para obtener datos de dashboard según businessType
 */

import { BusinessType } from '../types/config.types';
import { SupervisorDashboardData, SpaSupervisorDashboardData } from '../types/dashboard.types';
import { mockDashboardData } from '../data/mockDashboardData';
import { mockSpaDashboardData } from '../data/mockSpaMetrics';

// ========================================
// TIPOS DE DATOS DE DASHBOARD
// ========================================

export type DashboardData = SupervisorDashboardData | SpaSupervisorDashboardData;

// ========================================
// OBTENER DATOS DE DASHBOARD
// ========================================

export function getSupervisorDashboardData(
  businessType: BusinessType
): DashboardData {
  switch (businessType) {
    case BusinessType.RESTAURANT:
    case BusinessType.BAR:
    case BusinessType.CAFE:
    case BusinessType.FAST_FOOD:
      return mockDashboardData;
    
    case BusinessType.SPA:
      return mockSpaDashboardData;
    
    case BusinessType.HARDWARE:
    case BusinessType.RETAIL:
    case BusinessType.WHOLESALE:
      // Por ahora retorna datos de restaurant, se puede crear mockHardwareData después
      return mockDashboardData;
    
    default:
      return mockDashboardData;
  }
}

// ========================================
// TYPE GUARDS
// ========================================

export function isRestaurantDashboard(
  data: DashboardData
): data is SupervisorDashboardData {
  return 'realTimeMetrics' in data && 'activeOrders' in (data as SupervisorDashboardData).realTimeMetrics;
}

export function isSpaDashboard(
  data: DashboardData
): data is SpaSupervisorDashboardData {
  return 'realTimeMetrics' in data && 'appointmentsToday' in (data as SpaSupervisorDashboardData).realTimeMetrics;
}

// ========================================
// API INTEGRATION (PREPARADO PARA FUTURO)
// ========================================

/**
 * Función preparada para integración con API real
 */
export async function fetchDashboardData(
  businessType: BusinessType,
  role: string = 'supervisor'
): Promise<DashboardData> {
  try {
    // TODO: Reemplazar con llamada real a API
    // const response = await fetch(`/api/dashboard?businessType=${businessType}&role=${role}`);
    // const data = await response.json();
    // return data;
    
    // Por ahora retorna datos mock
    return getSupervisorDashboardData(businessType);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Fallback a datos mock en caso de error
    return getSupervisorDashboardData(businessType);
  }
}
