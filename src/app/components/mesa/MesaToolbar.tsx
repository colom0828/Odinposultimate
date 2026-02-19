'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { MESA_TEMPLATES, MesaTemplate } from '@/app/types/mesa.types';

interface MesaToolbarProps {
  onSelectTemplate: (template: MesaTemplate) => void;
  onDeleteAllMesas?: () => void;
  mesasCount?: number;
}

export function MesaToolbar({ onSelectTemplate, onDeleteAllMesas, mesasCount = 0 }: MesaToolbarProps) {
  const handleDragStart = (e: React.DragEvent, template: MesaTemplate) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('template', JSON.stringify(template));
  };

  const handleDeleteAll = () => {
    if (mesasCount === 0) return;
    
    if (window.confirm(`¿Estás seguro de eliminar todas las ${mesasCount} mesas del área actual?`)) {
      onDeleteAllMesas?.();
    }
  };

  return (
    <div className="fixed left-72 top-24 w-20 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-purple-500/20 rounded-2xl shadow-2xl p-3 space-y-3 z-50">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center w-full h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg mb-2">
          <LucideIcons.Grid3x3 className="w-4 h-4 text-white" />
        </div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Tipos de Mesa
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-2">
        {MESA_TEMPLATES.map((template, index) => {
          const Icon = (LucideIcons as any)[template.icon] || LucideIcons.Square;

          return (
            <motion.div
              key={template.shape}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              onClick={() => onSelectTemplate(template)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-full aspect-square
                bg-gradient-to-br ${template.color}
                rounded-xl
                flex items-center justify-center
                cursor-grab
                active:cursor-grabbing
                hover:shadow-lg hover:shadow-purple-500/20
                transition-all duration-200
                border border-white/20
                group
              `}
              title={template.label}
            >
              <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </motion.div>
          );
        })}
      </div>

      {/* Hint */}
      <div className="pt-3 border-t border-slate-200 dark:border-purple-500/20">
        <p className="text-[10px] text-slate-500 dark:text-slate-500 text-center leading-tight">
          Arrastra al plano
        </p>
      </div>

      {/* Botón Borrar Todas las Mesas */}
      {onDeleteAllMesas && (
        <div className="pt-3 border-t border-slate-200 dark:border-purple-500/20">
          <motion.button
            onClick={handleDeleteAll}
            disabled={mesasCount === 0}
            whileHover={mesasCount > 0 ? { scale: 1.05 } : {}}
            whileTap={mesasCount > 0 ? { scale: 0.95 } : {}}
            className={`
              w-full aspect-square
              rounded-xl
              flex flex-col items-center justify-center
              transition-all duration-200
              border-2
              ${mesasCount > 0
                ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20 hover:border-red-500 cursor-pointer'
                : 'bg-slate-200/50 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-50'
              }
            `}
            title="Borrar todas las mesas del área actual"
          >
            <LucideIcons.Trash2 className={`w-6 h-6 mb-1 ${mesasCount > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-medium ${mesasCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
              Borrar
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}