'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Home } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { SystemModule } from '../types/config.types';
import { Button } from './ui/button';

/**
 * ODIN POS - Route Guard
 * Protege rutas según módulos habilitados y permisos
 */

interface RouteGuardProps {
  requiredModule?: SystemModule;
  requiredPermission?: string;
  children: React.ReactNode;
}

export function RouteGuard({ requiredModule, requiredPermission, children }: RouteGuardProps) {
  const { config, loading, isModuleEnabled, hasPermission } = useConfig();

  // Mostrar loading mientras carga
  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Verificar módulo requerido
  const hasModuleAccess = requiredModule ? isModuleEnabled(requiredModule) : true;
  
  // Verificar permiso requerido
  const hasRequiredPermission = requiredPermission ? hasPermission(requiredPermission) : true;

  // Si no tiene acceso, mostrar pantalla de acceso denegado
  if (!hasModuleAccess || !hasRequiredPermission) {
    return <AccessDenied module={requiredModule} permission={requiredPermission} />;
  }

  // Si tiene acceso, renderizar children
  return <>{children}</>;
}

/**
 * Pantalla de acceso denegado
 */
interface AccessDeniedProps {
  module?: SystemModule;
  permission?: string;
}

function AccessDenied({ module, permission }: AccessDeniedProps) {
  const { config } = useConfig();

  const handleGoHome = () => {
    window.history.pushState({}, '', '/admin/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Obtener nombre del módulo
  const getModuleName = () => {
    if (!module) return 'este módulo';
    const moduleConfig = config?.enabledModules.find(m => m.id === module);
    return moduleConfig?.label || module;
  };

  // Obtener razón del bloqueo
  const getReason = () => {
    if (!hasModuleAccess(module)) {
      return `El módulo "${getModuleName()}" no está disponible para tu tipo de negocio (${getBusinessTypeLabel()}).`;
    }
    if (permission) {
      return `No tienes el permiso "${permission}" necesario para acceder a esta sección.`;
    }
    return 'No tienes acceso a este módulo.';
  };

  // Helper para verificar acceso al módulo
  const hasModuleAccess = (mod?: SystemModule) => {
    if (!mod || !config) return true;
    return config.enabledModules.some(m => m.id === mod && m.enabled);
  };

  // Helper para obtener tipo de negocio
  const getBusinessTypeLabel = () => {
    const labels: Record<string, string> = {
      restaurant: 'Restaurante',
      spa: 'Spa/Salón',
      hardware: 'Ferretería',
      retail: 'Tienda',
      tech_service: 'Servicio Técnico',
    };
    return labels[config?.businessType || ''] || 'tu tipo de negocio';
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-purple-500/20 p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Módulo No Disponible
          </h1>

          {/* Message */}
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {getReason()}
          </p>

          {/* Info Box */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              💡 Si necesitas acceso a este módulo, contacta al administrador o verifica la configuración de tu tipo de negocio.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Button>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border-slate-300 dark:border-purple-500/30"
            >
              Volver atrás
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-purple-500/20">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Tipo de negocio actual: <span className="font-semibold">{getBusinessTypeLabel()}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * HOC para proteger páginas completas
 */
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredModule?: SystemModule,
  requiredPermission?: string
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard requiredModule={requiredModule} requiredPermission={requiredPermission}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
