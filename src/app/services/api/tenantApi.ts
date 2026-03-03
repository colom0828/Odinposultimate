/**
 * ═══════════════════════════════════════════════════════════════
 * TENANT API SERVICE
 * ═══════════════════════════════════════════════════════════════
 * Endpoints para gestión de tenants (simula backend ASP.NET Core)
 * 
 * PRODUCCIÓN - Endpoints reales:
 * GET    /api/tenants              - Lista todos los tenants (admin master)
 * GET    /api/tenants/:id          - Obtiene info de un tenant
 * POST   /api/tenants/provision    - Crea nuevo tenant + DB
 * PUT    /api/tenants/:id          - Actualiza tenant
 * DELETE /api/tenants/:id          - Desactiva tenant
 * POST   /api/tenants/:id/migrate  - Aplica migraciones a tenant
 */

import {
  TenantInfo,
  TenantStatus,
  TenantProvisionRequest,
  TenantProvisionResponse,
  TenantsListResponse,
} from '../../types/tenant.types';
import { BusinessType } from '../../types/config.types';

/**
 * Storage para tenants (simula odin_master.tenants)
 */
const TENANTS_MASTER_KEY = 'odin_master_tenants';

/**
 * Obtiene todos los tenants del sistema
 * En producción: GET /api/tenants
 */
export async function getAllTenants(): Promise<TenantsListResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const tenantsJson = localStorage.getItem(TENANTS_MASTER_KEY);
  const tenants: TenantInfo[] = tenantsJson ? JSON.parse(tenantsJson) : getDefaultTenants();

  // Si no hay tenants, crear los por defecto
  if (!tenantsJson) {
    localStorage.setItem(TENANTS_MASTER_KEY, JSON.stringify(tenants));
  }

  return {
    tenants,
    total: tenants.length,
    page: 1,
    pageSize: 100,
  };
}

/**
 * Obtiene información de un tenant específico
 * En producción: GET /api/tenants/:tenantId
 */
export async function getTenantById(tenantId: string): Promise<TenantInfo | null> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const { tenants } = await getAllTenants();
  return tenants.find(t => t.tenantId === tenantId) || null;
}

/**
 * Obtiene los tenants asociados a un usuario
 * En producción: GET /api/users/:userId/tenants
 */
export async function getUserTenants(userId: string): Promise<TenantInfo[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Por ahora, devolver todos los tenants activos
  // En producción, esto vendría de la relación user_tenants en BD
  const { tenants } = await getAllTenants();
  return tenants.filter(t => t.status === TenantStatus.ACTIVE);
}

/**
 * Provisiona un nuevo tenant (crea DB + migra esquema)
 * En producción: POST /api/tenants/provision
 * 
 * Backend debe:
 * 1. Validar que tenant_id sea único
 * 2. INSERT en odin_master.tenants
 * 3. CREATE DATABASE odin_<tenant_id>
 * 4. Ejecutar migraciones en nueva DB
 * 5. Crear usuario admin inicial
 */
export async function provisionTenant(
  request: TenantProvisionRequest
): Promise<TenantProvisionResponse> {
  // Simular proceso de provisioning (tarda más)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Validar que no exista
  const existing = await getTenantById(request.tenantId);
  if (existing) {
    throw new Error(`El tenant '${request.tenantId}' ya existe`);
  }

  // Crear nuevo tenant
  const newTenant: TenantInfo = {
    id: crypto.randomUUID(),
    tenantId: request.tenantId,
    name: request.name,
    businessType: request.businessType,
    dbName: `odin_${request.tenantId}`,
    dbHost: request.dbHost || 'localhost',
    dbPort: request.dbPort || 5432,
    status: TenantStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    contactEmail: request.contactEmail,
    config: {
      enabledModules: [],
      locale: request.locale || 'es-DO',
      timezone: request.timezone || 'America/Santo_Domingo',
      currency: 'DOP',
      features: {
        multiCurrency: true,
        advancedReports: true,
        apiAccess: false,
        eInvoicing: true,
      },
    },
  };

  // Guardar en "master"
  const { tenants } = await getAllTenants();
  tenants.push(newTenant);
  localStorage.setItem(TENANTS_MASTER_KEY, JSON.stringify(tenants));

  console.log(`✅ Tenant provisionado: ${request.tenantId}`);
  console.log(`   DB: ${newTenant.dbName}`);
  console.log(`   Host: ${newTenant.dbHost}:${newTenant.dbPort}`);

  return {
    success: true,
    tenant: newTenant,
    message: `Tenant '${request.tenantId}' creado exitosamente`,
    adminCredentials: {
      email: request.adminUser.email,
      temporaryPassword: request.adminUser.password,
    },
  };
}

/**
 * Actualiza información del tenant
 * En producción: PUT /api/tenants/:id
 */
export async function updateTenant(
  tenantId: string,
  updates: Partial<TenantInfo>
): Promise<TenantInfo> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const { tenants } = await getAllTenants();
  const index = tenants.findIndex(t => t.tenantId === tenantId);

  if (index === -1) {
    throw new Error(`Tenant '${tenantId}' no encontrado`);
  }

  tenants[index] = {
    ...tenants[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(TENANTS_MASTER_KEY, JSON.stringify(tenants));
  return tenants[index];
}

/**
 * Desactiva un tenant
 * En producción: DELETE /api/tenants/:id
 * (NO borra la DB, solo marca como inactive)
 */
export async function deactivateTenant(tenantId: string): Promise<void> {
  await updateTenant(tenantId, { status: TenantStatus.INACTIVE });
}

/**
 * Aplica migraciones a un tenant específico
 * En producción: POST /api/tenants/:id/migrate
 */
export async function migrateTenant(tenantId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  await updateTenant(tenantId, { status: TenantStatus.MIGRATING });
  
  // Simular aplicación de migraciones
  console.log(`🔄 Aplicando migraciones a ${tenantId}...`);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await updateTenant(tenantId, { status: TenantStatus.ACTIVE });
  
  console.log(`✅ Migraciones aplicadas a ${tenantId}`);
}

/**
 * Aplica migraciones a TODOS los tenants
 * En producción: POST /api/tenants/migrate-all
 * (Solo para admin master)
 */
export async function migrateAllTenants(): Promise<void> {
  const { tenants } = await getAllTenants();
  
  for (const tenant of tenants) {
    if (tenant.status === TenantStatus.ACTIVE) {
      await migrateTenant(tenant.tenantId);
    }
  }
}

/**
 * Tenants por defecto para desarrollo
 */
function getDefaultTenants(): TenantInfo[] {
  return [
    {
      id: '1',
      tenantId: 'spa_001',
      name: 'Spa Relax & Beauty',
      businessType: BusinessType.SPA,
      dbName: 'odin_spa_001',
      dbHost: 'localhost',
      dbPort: 5432,
      status: TenantStatus.ACTIVE,
      createdAt: '2025-01-01T00:00:00Z',
      contactEmail: 'admin@sparelax.com',
      contactPhone: '+1 809-555-0101',
      config: {
        enabledModules: ['appointments', 'customers', 'services', 'cash_register'],
        locale: 'es-DO',
        timezone: 'America/Santo_Domingo',
        currency: 'DOP',
        features: {
          multiCurrency: false,
          advancedReports: true,
          apiAccess: false,
          eInvoicing: true,
        },
      },
    },
    {
      id: '2',
      tenantId: 'rest_002',
      name: 'Restaurante El Buen Sabor',
      businessType: BusinessType.RESTAURANT,
      dbName: 'odin_rest_002',
      dbHost: 'localhost',
      dbPort: 5432,
      status: TenantStatus.ACTIVE,
      createdAt: '2025-01-15T00:00:00Z',
      contactEmail: 'admin@buensabor.com',
      contactPhone: '+1 809-555-0202',
      config: {
        enabledModules: ['tables', 'kitchen', 'sales', 'inventory', 'cash_register'],
        locale: 'es-DO',
        timezone: 'America/Santo_Domingo',
        currency: 'DOP',
        features: {
          multiCurrency: false,
          advancedReports: true,
          apiAccess: false,
          eInvoicing: true,
        },
      },
    },
    {
      id: '3',
      tenantId: 'ferre_003',
      name: 'Ferretería Construcción Total',
      businessType: BusinessType.HARDWARE,
      dbName: 'odin_ferre_003',
      dbHost: 'localhost',
      dbPort: 5432,
      status: TenantStatus.ACTIVE,
      createdAt: '2025-02-01T00:00:00Z',
      contactEmail: 'admin@ferretotal.com',
      contactPhone: '+1 809-555-0303',
      config: {
        enabledModules: ['sales', 'inventory', 'suppliers', 'cash_register'],
        locale: 'es-DO',
        timezone: 'America/Santo_Domingo',
        currency: 'DOP',
        features: {
          multiCurrency: true,
          advancedReports: true,
          apiAccess: true,
          eInvoicing: true,
        },
      },
    },
  ];
}
