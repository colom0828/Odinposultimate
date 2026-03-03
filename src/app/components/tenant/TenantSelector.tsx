/**
 * ═══════════════════════════════════════════════════════════════
 * TENANT SELECTOR - Componente para cambiar entre tenants
 * ═══════════════════════════════════════════════════════════════
 * Permite a usuarios con acceso a múltiples tenants cambiar entre ellos
 */

import React, { useState, useEffect } from 'react';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { getCurrentUser } from '../../utils/auth';
import { getUserTenants } from '../../services/api/tenantApi';
import { TenantInfo } from '../../types/tenant.types';
import { getBusinessTypeLabel } from '../../services/configService';

export function TenantSelector() {
  const { tenant: currentTenant, switchTenant } = useTenant();
  const [availableTenants, setAvailableTenants] = useState<TenantInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAvailableTenants();
  }, []);

  const loadAvailableTenants = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      const tenants = await getUserTenants(user.id);
      setAvailableTenants(tenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
    }
  };

  const handleSwitchTenant = async (tenantId: string) => {
    if (tenantId === currentTenant?.tenantId) {
      setIsOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      await switchTenant(tenantId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching tenant:', error);
      alert('Error cambiando de perfil. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // No mostrar selector si solo hay 1 tenant
  if (availableTenants.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      {/* Botón del selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm"
        disabled={isLoading}
      >
        <Building2 className="size-4 text-purple-400" />
        <div className="flex flex-col items-start">
          <span className="text-xs text-slate-400">Perfil actual</span>
          <span className="text-sm font-medium text-white">
            {currentTenant?.name || 'Cargando...'}
          </span>
        </div>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown de tenants */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Lista de tenants */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700">
              <p className="text-xs font-medium text-slate-400">
                Cambiar de perfil
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {availableTenants.map((tenant) => {
                const isActive = tenant.tenantId === currentTenant?.tenantId;

                return (
                  <button
                    key={tenant.id}
                    onClick={() => handleSwitchTenant(tenant.tenantId)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-700/50 transition-colors ${
                      isActive ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    {/* Icono */}
                    <div className={`mt-1 ${isActive ? 'text-purple-400' : 'text-slate-400'}`}>
                      <Building2 className="size-5" />
                    </div>

                    {/* Información */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {tenant.name}
                        </p>
                        {isActive && (
                          <Check className="size-4 text-purple-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {getBusinessTypeLabel(tenant.businessType)} • {tenant.tenantId}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        BD: {tenant.dbName}
                      </p>
                    </div>

                    {/* Badge de activo */}
                    {isActive && (
                      <div className="mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                          Activo
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Los datos están completamente aislados por perfil
              </p>
            </div>
          </div>
        </>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
          <div className="size-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * Versión compacta del selector (para header)
 */
export function TenantSelectorCompact() {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
      <Building2 className="size-3.5 text-purple-400" />
      <span className="text-xs text-slate-400">
        {tenant.name}
      </span>
    </div>
  );
}
