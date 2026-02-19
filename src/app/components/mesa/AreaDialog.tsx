'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AreaType, AREA_COLORS } from '@/app/types/mesa.types';
import { Button } from '../ui/button';

interface AreaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nombre: string, tipo: AreaType, color: string) => void;
}

export function AreaDialog({ isOpen, onClose, onConfirm }: AreaDialogProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<AreaType>(AreaType.SALON);
  const [selectedColor, setSelectedColor] = useState(AREA_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      onConfirm(nombre.trim(), tipo, selectedColor);
      // Reset
      setNombre('');
      setTipo(AreaType.SALON);
      setSelectedColor(AREA_COLORS[0]);
    }
  };

  const handleClose = () => {
    setNombre('');
    setTipo(AreaType.SALON);
    setSelectedColor(AREA_COLORS[0]);
    onClose();
  };

  const getAreaIcon = (areaType: AreaType) => {
    switch (areaType) {
      case AreaType.SALON:
        return LucideIcons.Home;
      case AreaType.TERRAZA:
        return LucideIcons.Trees;
      case AreaType.VIP:
        return LucideIcons.Crown;
      case AreaType.BAR:
        return LucideIcons.Wine;
      case AreaType.EXTERIOR:
        return LucideIcons.Sun;
      default:
        return LucideIcons.MapPin;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-2xl shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <LucideIcons.Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Nueva Área
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Personaliza tu nueva área
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LucideIcons.X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nombre del Área
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Terraza Principal"
                    autoFocus
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Tipo de Área
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(AreaType).map((areaType) => {
                      const Icon = getAreaIcon(areaType);
                      const isSelected = tipo === areaType;

                      return (
                        <button
                          key={areaType}
                          type="button"
                          onClick={() => setTipo(areaType)}
                          className={`
                            p-3 rounded-xl border-2 transition-all duration-200
                            ${isSelected
                              ? 'bg-purple-500/20 border-purple-500'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-500/30'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`} />
                          <p className={`text-xs font-medium capitalize ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {areaType}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AREA_COLORS.map((color, index) => {
                      const isSelected = selectedColor === color;
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`
                            relative w-full aspect-square ${color} rounded-xl
                            transition-all duration-200
                            ${isSelected ? 'ring-4 ring-purple-500/50 scale-110' : 'hover:scale-105'}
                          `}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LucideIcons.Check className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Vista previa:</p>
                  <div className={`p-3 ${selectedColor} rounded-xl flex items-center space-x-3`}>
                    {(() => {
                      const Icon = getAreaIcon(tipo);
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                    <div>
                      <p className="text-sm font-bold text-white">
                        {nombre || 'Nueva Área'}
                      </p>
                      <p className="text-xs text-white/80 capitalize">
                        {tipo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1 border-slate-300 dark:border-slate-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!nombre.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LucideIcons.Check className="w-4 h-4 mr-2" />
                    Crear Área
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
