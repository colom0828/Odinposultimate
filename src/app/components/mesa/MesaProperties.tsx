'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Mesa, MesaStatus, MESA_STATUS_CONFIG } from '@/app/types/mesa.types';
import { Button } from '../ui/button';

interface MesaPropertiesProps {
  mesa: Mesa | null;
  position: { x: number; y: number };
  onClose: () => void;
  onUpdate: (mesaId: string, updates: Partial<Mesa>) => void;
  onDelete: (mesaId: string) => void;
}

export function MesaProperties({
  mesa,
  position,
  onClose,
  onUpdate,
  onDelete,
}: MesaPropertiesProps) {
  const [numero, setNumero] = useState(mesa?.numero || 1);
  const [capacidad, setCapacidad] = useState(mesa?.capacidad || 4);
  const [status, setStatus] = useState(mesa?.status || MesaStatus.LIBRE);

  if (!mesa) return null;

  const handleSave = () => {
    onUpdate(mesa.id, {
      numero,
      capacidad,
      status,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta mesa?')) {
      onDelete(mesa.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.min(position.y, window.innerHeight - 400),
          zIndex: 9999,
        }}
        className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-2xl shadow-2xl p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <LucideIcons.Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Editar Mesa
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ID: {mesa.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LucideIcons.X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Número de Mesa */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Número de Mesa
            </label>
            <input
              type="number"
              min="1"
              value={numero}
              onChange={(e) => setNumero(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Capacidad (personas)
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCapacidad(Math.max(1, capacidad - 1))}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LucideIcons.Minus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={capacidad}
                onChange={(e) => setCapacidad(parseInt(e.target.value) || 1)}
                className="flex-1 text-center px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                onClick={() => setCapacidad(Math.min(20, capacidad + 1))}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LucideIcons.Plus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Estado
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(MesaStatus).map((statusOption) => {
                const config = MESA_STATUS_CONFIG[statusOption];
                const StatusIcon = (LucideIcons as any)[config.icon];
                const isSelected = status === statusOption;

                return (
                  <button
                    key={statusOption}
                    onClick={() => setStatus(statusOption)}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-200
                      ${isSelected
                        ? config.color + ' ' + config.hoverColor
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-500/30'
                      }
                    `}
                  >
                    <StatusIcon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? '' : 'text-slate-600 dark:text-slate-400'}`} />
                    <p className={`text-xs font-medium ${isSelected ? '' : 'text-slate-700 dark:text-slate-300'}`}>
                      {config.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl">
            <div className="flex items-start space-x-2">
              <LucideIcons.Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-800 dark:text-blue-400">
                  <strong>Forma:</strong> {mesa.shape}
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                  <strong>Posición:</strong> x:{Math.round(mesa.position.x)}, y:{Math.round(mesa.position.y)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
            >
              <LucideIcons.Check className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="px-6 border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:border-red-600"
            >
              <LucideIcons.Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}