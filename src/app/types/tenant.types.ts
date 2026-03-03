/**
 * ═══════════════════════════════════════════════════════════════
 * MULTI-TENANT - TIPOS TYPESCRIPT
 * ═══════════════════════════════════════════════════════════════
 * Sistema preparado para DB-per-Tenant (PostgreSQL)
 * Estructura lista para backend ASP.NET Core
 */

import { BusinessType } from './config.types';

/**
 * Información del Tenant (reflejaría tabla: odin_master.tenants)
 */
export interface TenantInfo {
  id: string;                    // UUID del tenant en master
  tenantId: string;              // tenant_id único (ej: spa_001, rest_002)
  name: string;                  // Nombre del negocio
  businessType: BusinessType;    // Tipo de negocio (spa, restaurant, etc)
  
  // Configuración de BD (en producción viene del backend)
  dbName: string;                // ej: odin_spa_001
  dbHost: string;                // localhost, IP, etc
  dbPort: number;                // 5432
  
  // Estado y metadata
  status: TenantStatus;
  createdAt: string;             // ISO timestamp
  updatedAt?: string;
  
  // Información de contacto
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  
  // Configuración adicional
  config?: TenantConfig;
}

/**
 * Estado del Tenant
 */
export enum TenantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PROVISIONING = 'provisioning',  // Creando DB
  MIGRATING = 'migrating',        // Aplicando migraciones
  ERROR = 'error'
}

/**
 * Configuración específica del Tenant
 */
export interface TenantConfig {
  // Módulos habilitados para este tenant
  enabledModules: string[];
  
  // Configuración regional
  locale: string;              // es-DO, es-ES, en-US
  timezone: string;            // America/Santo_Domingo
  currency: string;            // DOP, USD
  
  // Límites y plan
  maxUsers?: number;
  maxProducts?: number;
  maxMonthlyOrders?: number;
  
  // Features específicas
  features: {
    multiCurrency?: boolean;
    advancedReports?: boolean;
    apiAccess?: boolean;
    eInvoicing?: boolean;       // Facturación electrónica DGII
  };
}

/**
 * Contexto del Tenant Actual (runtime)
 * Lo que vive en TenantContext durante la sesión
 */
export interface TenantContextData {
  tenant: TenantInfo | null;
  isLoading: boolean;
  error: string | null;
  
  // Métodos
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenant: () => Promise<void>;
  clearTenant: () => void;
}

/**
 * Request de Provisioning (crear nuevo tenant)
 * POST /api/tenants/provision
 */
export interface TenantProvisionRequest {
  tenantId: string;              // Identificador único
  name: string;
  businessType: BusinessType;
  contactEmail: string;
  
  // Opcionales (si no vienen, usar defaults del servidor)
  dbHost?: string;
  dbPort?: number;
  locale?: string;
  timezone?: string;
  
  // Usuario administrador inicial
  adminUser: {
    email: string;
    password: string;
    name: string;
  };
}

/**
 * Response de Provisioning
 */
export interface TenantProvisionResponse {
  success: boolean;
  tenant: TenantInfo;
  message: string;
  
  // Credenciales iniciales
  adminCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
}

/**
 * Lista de Tenants (para admin master)
 * GET /api/tenants
 */
export interface TenantsListResponse {
  tenants: TenantInfo[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Storage Key Strategy
 * Cómo se almacenan los datos por tenant en localStorage
 */
export interface TenantStorageKey {
  tenant: string;                // tenant_id
  module: string;                // 'products', 'sales', 'inventory'
  key: string;                   // identificador específico
}

/**
 * Helper para construir keys de localStorage por tenant
 */
export function buildTenantStorageKey(
  tenantId: string,
  module: string,
  key: string = 'data'
): string {
  return `odin_tenant_${tenantId}__${module}__${key}`;
}

/**
 * Helper para parsear tenant storage key
 */
export function parseTenantStorageKey(storageKey: string): TenantStorageKey | null {
  const match = storageKey.match(/^odin_tenant_(.+?)__(.+?)__(.+)$/);
  if (!match) return null;
  
  return {
    tenant: match[1],
    module: match[2],
    key: match[3],
  };
}

/**
 * Datos que NO se separan por tenant (viven en master)
 */
export const MASTER_STORAGE_KEYS = [
  'odin_auth_token',           // JWT
  'odin_current_tenant',       // tenant_id activo
  'odin_user_tenants',         // Lista de tenants del usuario
  'odin_theme',                // Preferencias UI
  'odin_language',             // Idioma
] as const;

/**
 * Datos que SÍ se separan por tenant (viven en DB del tenant)
 */
export const TENANT_MODULES = [
  'products',
  'sales',
  'inventory',
  'customers',
  'employees',
  'suppliers',
  'orders',
  'cash_register',
  'printers',
  'print_templates',
  'tables',
  'kitchen',
  'appointments',
  'services',
  'reports',
  'invoices',
  'e_invoicing',
] as const;

export type TenantModule = typeof TENANT_MODULES[number];
