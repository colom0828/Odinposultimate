/**
 * ═══════════════════════════════════════════════════════════════
 * TENANT CONTEXT - Context API para Multi-Tenancy
 * ═══════════════════════════════════════════════════════════════
 * Maneja el tenant activo en toda la aplicación
 * Similar a TenantContext.cs del backend ASP.NET Core
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TenantInfo, TenantContextData } from '../types/tenant.types';
import { getTenantById } from '../services/api/tenantApi';
import { getCurrentTenantId, switchTenant as authSwitchTenant } from '../utils/auth';

/**
 * Context para el tenant actual
 */
const TenantContext = createContext<TenantContextData | null>(null);

/**
 * Props del Provider
 */
interface TenantProviderProps {
  children: ReactNode;
}

/**
 * Provider del Tenant Context
 * Debe envolver toda la aplicación (después del AuthProvider)
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar tenant inicial al montar
   */
  useEffect(() => {
    loadCurrentTenant();
  }, []);

  /**
   * Carga el tenant actual basado en el tenantId del usuario
   */
  const loadCurrentTenant = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tenantId = getCurrentTenantId();
      
      if (!tenantId) {
        // No hay tenant (probablemente no está autenticado)
        setTenant(null);
        setIsLoading(false);
        return;
      }

      // Obtener información del tenant
      const tenantData = await getTenantById(tenantId);
      
      if (!tenantData) {
        throw new Error(`Tenant '${tenantId}' no encontrado`);
      }

      setTenant(tenantData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error cargando tenant';
      setError(message);
      console.error('Error loading tenant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cambiar de tenant
   * En producción: POST /api/auth/switch-tenant
   */
  const switchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Cambiar tenant en autenticación (obtiene nuevo JWT)
      const result = await authSwitchTenant(tenantId);
      
      if (!result.success) {
        throw new Error(result.message || 'Error cambiando de tenant');
      }

      // Recargar información del nuevo tenant
      await loadCurrentTenant();

      // Recargar la página para limpiar estados del tenant anterior
      window.location.reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error cambiando de tenant';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refrescar información del tenant actual
   */
  const refreshTenant = async () => {
    await loadCurrentTenant();
  };

  /**
   * Limpiar tenant (al hacer logout)
   */
  const clearTenant = () => {
    setTenant(null);
    setError(null);
  };

  const value: TenantContextData = {
    tenant,
    isLoading,
    error,
    switchTenant,
    refreshTenant,
    clearTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook para acceder al tenant context
 * Uso: const { tenant, switchTenant } = useTenant();
 */
export function useTenant(): TenantContextData {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant debe usarse dentro de un TenantProvider');
  }
  
  return context;
}

/**
 * Hook helper para obtener solo el tenant actual
 */
export function useCurrentTenant(): TenantInfo | null {
  const { tenant } = useTenant();
  return tenant;
}

/**
 * Hook helper para verificar si hay tenant cargado
 */
export function useHasTenant(): boolean {
  const { tenant } = useTenant();
  return tenant !== null;
}

/**
 * Hook helper para obtener el tenant_id actual
 */
export function useTenantId(): string | null {
  const { tenant } = useTenant();
  return tenant?.tenantId || null;
}
