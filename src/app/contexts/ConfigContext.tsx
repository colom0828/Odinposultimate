'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SystemConfig, SystemModule, LicenseStatus } from '../types/config.types';
import { getSystemConfig } from '../services/configService';

/**
 * ODIN POS - Context de Configuración Dinámica
 * Provee la configuración del sistema a toda la aplicación
 */

interface ConfigContextType {
  config: SystemConfig | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  isModuleEnabled: (module: SystemModule) => boolean;
  hasPermission: (permission: string) => boolean;
  isLicenseValid: () => boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración al montar
  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getSystemConfig();
      
      if (response.success) {
        setConfig(response.data);
      } else {
        setError(response.message || 'Error al cargar configuración');
      }
    } catch (err) {
      console.error('Error loading system config:', err);
      setError('Error de conexión al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Refrescar configuración manualmente
  const refreshConfig = async () => {
    await loadConfig();
  };

  // Verificar si un módulo está habilitado
  const isModuleEnabled = (module: SystemModule): boolean => {
    if (!config) return false;
    return config.enabledModules.some(m => m.id === module && m.enabled);
  };

  // Verificar si el usuario tiene un permiso
  const hasPermission = (permission: string): boolean => {
    if (!config) return false;
    return config.user.permissions.includes(permission);
  };

  // Verificar si la licencia es válida
  const isLicenseValid = (): boolean => {
    if (!config) return false;
    return config.license.status === LicenseStatus.ACTIVE || 
           config.license.status === LicenseStatus.TRIAL;
  };

  const value: ConfigContextType = {
    config,
    loading,
    error,
    refreshConfig,
    isModuleEnabled,
    hasPermission,
    isLicenseValid,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);
  
  if (context === undefined) {
    throw new Error('useConfig debe usarse dentro de ConfigProvider');
  }
  
  return context;
}

// Hook de conveniencia para verificar módulos
export function useModule(module: SystemModule): boolean {
  const { isModuleEnabled } = useConfig();
  return isModuleEnabled(module);
}

// Hook de conveniencia para verificar permisos
export function usePermission(permission: string): boolean {
  const { hasPermission } = useConfig();
  return hasPermission(permission);
}
