'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Store, Utensils, Wrench, Sparkles } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { BusinessType } from '../types/config.types';
import { switchBusinessType } from '../services/configService';

/**
 * ODIN POS - Panel de Desarrollo
 * Permite cambiar el tipo de negocio para probar el renderizado dinámico
 * Solo para desarrollo - no incluir en producción
 */

interface BusinessTypeOption {
  type: BusinessType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const businessTypes: BusinessTypeOption[] = [
  {
    type: BusinessType.RESTAURANT,
    label: 'Restaurante / Bar',
    description: 'Con mesas, cocina y delivery',
    icon: Utensils,
    color: 'from-orange-500 to-red-500',
  },
  {
    type: BusinessType.SPA,
    label: 'Spa / Salón / Uñas',
    description: 'Citas, servicios y agenda',
    icon: Sparkles,
    color: 'from-pink-500 to-purple-500',
  },
  {
    type: BusinessType.HARDWARE,
    label: 'Ferretería',
    description: 'Inventario, compras y proveedores',
    icon: Wrench,
    color: 'from-gray-600 to-gray-800',
  },
  {
    type: BusinessType.RETAIL,
    label: 'Tienda Minorista',
    description: 'Venta al detalle sin mesas',
    icon: Store,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    type: BusinessType.TECH_SERVICE,
    label: 'Servicio Técnico',
    description: 'Órdenes técnicas y citas',
    icon: Wrench,
    color: 'from-purple-500 to-pink-500',
  },
];

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { config, refreshConfig } = useConfig();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleChangeBusinessType = async (type: BusinessType) => {
    try {
      setLoading(true);
      await switchBusinessType(type);
      await refreshConfig();
    } catch (error) {
      console.error('Error changing business type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-shadow"
        title="Panel de Desarrollo"
      >
        <Settings className="w-6 h-6 animate-spin-slow" />
      </motion.button>

      {/* Dev Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-purple-500/20">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        🛠️ Panel de Desarrollo
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Prueba el sistema con diferentes tipos de negocio
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Current Config */}
                <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-800">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Configuración Actual
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tipo de Negocio</p>
                      <p className="font-semibold text-slate-900 dark:text-white mt-1">
                        {config?.businessType || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Módulos Activos</p>
                      <p className="font-semibold text-slate-900 dark:text-white mt-1">
                        {config?.enabledModules.filter(m => m.enabled).length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Type Selector */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Cambiar Tipo de Negocio
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessTypes.map((option) => {
                      const Icon = option.icon;
                      const isCurrent = config?.businessType === option.type;

                      return (
                        <motion.button
                          key={option.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChangeBusinessType(option.type)}
                          disabled={loading || isCurrent}
                          className={`
                            relative overflow-hidden p-4 rounded-xl border-2 transition-all
                            ${isCurrent
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-slate-800'
                            }
                            ${loading && !isCurrent ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} bg-opacity-10`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {option.label}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {option.description}
                              </p>
                              {isCurrent && (
                                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded">
                                  Activo
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Warning */}
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-200 dark:border-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    ⚠️ Este panel es solo para desarrollo. Los cambios afectan la UI pero no persisten en la base de datos.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}