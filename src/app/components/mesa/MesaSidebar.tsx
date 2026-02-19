'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Area, AreaType } from '@/app/types/mesa.types';
import { Button } from '../ui/button';

interface MesaSidebarProps {
  areas: Area[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
  onCreateArea: () => void;
  onDeleteArea: (areaId: string) => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
}

export function MesaSidebar({
  areas,
  selectedAreaId,
  onSelectArea,
  onCreateArea,
  onDeleteArea,
  snapToGrid,
  onToggleSnap,
}: MesaSidebarProps) {
  // Estado para posición draggable
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return { x: window.innerWidth - 320, y: 96 };
    }
    return { x: 0, y: 96 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      e.preventDefault();
    }
  };

  // Usar useEffect para manejar los event listeners
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      // Limites de la pantalla
      const maxX = window.innerWidth - 288; // 288 = width del sidebar
      const maxY = window.innerHeight - 200;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position.x, position.y]);

  const getAreaIcon = (tipo: AreaType) => {
    switch (tipo) {
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
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      className="w-72 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-purple-500/20 rounded-2xl shadow-2xl p-6 z-50 max-h-[calc(100vh-120px)] flex flex-col"
    >
      {/* Header con drag handle */}
      <div className="flex items-center justify-between mb-6 drag-handle cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <LucideIcons.LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Áreas
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {areas.length} activas
            </p>
          </div>
        </div>
        <LucideIcons.Move className="w-5 h-5 text-slate-400 drag-handle" />
      </div>

      {/* Nuevo Área */}
      <Button
        onClick={onCreateArea}
        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white mb-4 hover:shadow-lg hover:shadow-purple-500/50"
      >
        <LucideIcons.Plus className="w-4 h-4 mr-2" />
        Nueva Área
      </Button>

      {/* Snap to Grid Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-4">
        <div className="flex items-center space-x-2">
          <LucideIcons.Grid3x3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Ajustar a cuadrícula
          </span>
        </div>
        <button
          onClick={onToggleSnap}
          className={`
            relative w-11 h-6 rounded-full transition-colors duration-200
            ${snapToGrid ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}
          `}
        >
          <motion.div
            animate={{ x: snapToGrid ? 20 : 2 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          />
        </button>
      </div>

      {/* Lista de Áreas */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {areas.map((area, index) => {
          const Icon = getAreaIcon(area.tipo);
          const isSelected = area.id === selectedAreaId;

          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelectArea(area.id)}
              className={`
                p-3 rounded-xl cursor-pointer
                transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-2 border-purple-500/50'
                  : 'bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 hover:border-purple-500/30'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${area.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {area.nombre}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {area.tipo}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                {!isSelected && areas.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArea(area.id);
                    }}
                    className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-lg"
                  >
                    <LucideIcons.Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}

                {/* Selected Indicator */}
                {isSelected && (
                  <LucideIcons.Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-purple-500/20 grid grid-cols-2 gap-3">
        <div className="text-center p-2 bg-slate-100 dark:bg-slate-800/30 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">Áreas</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {areas.length}
          </p>
        </div>
        <div className="text-center p-2 bg-slate-100 dark:bg-slate-800/30 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">Grid</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {snapToGrid ? 'ON' : 'OFF'}
          </p>
        </div>
      </div>
    </div>
  );
}