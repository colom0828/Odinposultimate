/**
 * ═══════════════════════════════════════════════════════════════
 * TENANT STORAGE - Capa de Abstracción localStorage por Tenant
 * ═══════════════════════════════════════════════════════════════
 * Simula DB-per-Tenant usando localStorage
 * En producción, esto se reemplaza por llamadas API
 */

import { buildTenantStorageKey, TenantModule } from '../../types/tenant.types';

/**
 * Obtiene el tenant_id actual de la sesión
 */
function getCurrentTenantId(): string | null {
  return localStorage.getItem('odin_current_tenant');
}

/**
 * Clase para manejar storage por tenant
 * Simula que cada tenant tiene su propia base de datos
 */
export class TenantStorage {
  /**
   * Guarda datos en el storage del tenant actual
   * En producción: POST/PUT /api/{module}
   */
  static setItem<T>(module: TenantModule, key: string, value: T): void {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error('No hay tenant activo. Usuario debe estar autenticado.');
    }

    const storageKey = buildTenantStorageKey(tenantId, module, key);
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  /**
   * Obtiene datos del storage del tenant actual
   * En producción: GET /api/{module}
   */
  static getItem<T>(module: TenantModule, key: string): T | null {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      console.warn('No hay tenant activo');
      return null;
    }

    const storageKey = buildTenantStorageKey(tenantId, module, key);
    const data = localStorage.getItem(storageKey);
    
    if (!data) return null;
    
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error parsing tenant data for ${module}:`, error);
      return null;
    }
  }

  /**
   * Elimina datos del storage del tenant actual
   * En producción: DELETE /api/{module}/{id}
   */
  static removeItem(module: TenantModule, key: string): void {
    const tenantId = getCurrentTenantId();
    if (!tenantId) return;

    const storageKey = buildTenantStorageKey(tenantId, module, key);
    localStorage.removeItem(storageKey);
  }

  /**
   * Limpia TODOS los datos del tenant actual
   * ⚠️ PELIGROSO - solo para desarrollo/testing
   */
  static clearTenantData(): void {
    const tenantId = getCurrentTenantId();
    if (!tenantId) return;

    const prefix = `odin_tenant_${tenantId}__`;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Obtiene todas las keys de un módulo específico
   * Útil para listar datos
   */
  static getModuleKeys(module: TenantModule): string[] {
    const tenantId = getCurrentTenantId();
    if (!tenantId) return [];

    const prefix = buildTenantStorageKey(tenantId, module, '');
    
    return Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .map(key => key.replace(prefix, ''));
  }

  /**
   * Verifica si existe un item en el storage del tenant
   */
  static hasItem(module: TenantModule, key: string): boolean {
    const tenantId = getCurrentTenantId();
    if (!tenantId) return false;

    const storageKey = buildTenantStorageKey(tenantId, module, key);
    return localStorage.getItem(storageKey) !== null;
  }

  /**
   * Obtiene el tamaño aproximado de los datos del tenant (en bytes)
   * Útil para monitoreo
   */
  static getTenantDataSize(): number {
    const tenantId = getCurrentTenantId();
    if (!tenantId) return 0;

    const prefix = `odin_tenant_${tenantId}__`;
    let totalSize = 0;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    });

    return totalSize;
  }

  /**
   * Migra datos de localStorage antiguo (sin tenant) al nuevo formato
   * Útil para migración de versiones anteriores
   */
  static migrateFromLegacyStorage(tenantId: string): void {
    console.log(`Migrando datos legacy al tenant: ${tenantId}`);
    
    // Ejemplo: migrar productos antiguos
    const legacyProducts = localStorage.getItem('odin_products');
    if (legacyProducts) {
      const newKey = buildTenantStorageKey(tenantId, 'products', 'data');
      localStorage.setItem(newKey, legacyProducts);
      localStorage.removeItem('odin_products');
    }

    // Agregar más migraciones según sea necesario
    const modulesToMigrate = [
      { old: 'odin_sales', module: 'sales' as TenantModule },
      { old: 'odin_inventory', module: 'inventory' as TenantModule },
      { old: 'odin_customers', module: 'customers' as TenantModule },
      { old: 'odin_employees', module: 'employees' as TenantModule },
      { old: 'odin_cash_register', module: 'cash_register' as TenantModule },
      { old: 'odin_printers', module: 'printers' as TenantModule },
      { old: 'odin_print_templates', module: 'print_templates' as TenantModule },
    ];

    modulesToMigrate.forEach(({ old, module }) => {
      const legacyData = localStorage.getItem(old);
      if (legacyData) {
        const newKey = buildTenantStorageKey(tenantId, module, 'data');
        localStorage.setItem(newKey, legacyData);
        localStorage.removeItem(old);
        console.log(`  ✓ Migrado: ${old} → ${newKey}`);
      }
    });

    console.log('✅ Migración completada');
  }
}

/**
 * Hook helper para obtener/guardar datos del tenant
 * Versión simplificada para usar en componentes
 */
export const useTenantStorage = <T,>(module: TenantModule, key: string = 'data') => {
  const get = (): T | null => TenantStorage.getItem<T>(module, key);
  
  const set = (value: T): void => TenantStorage.setItem(module, key, value);
  
  const remove = (): void => TenantStorage.removeItem(module, key);
  
  const exists = (): boolean => TenantStorage.hasItem(module, key);

  return { get, set, remove, exists };
};
