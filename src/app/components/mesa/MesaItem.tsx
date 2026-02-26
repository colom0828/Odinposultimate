import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Mesa, MesaStatus, MESA_STATUS_CONFIG } from '@/app/types/mesa.types';

interface MesaItemProps {
  mesa: Mesa;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onDelete?: (mesaId: string) => void;
}

export function MesaItem({
  mesa,
  isSelected,
  isDragging,
  onMouseDown,
  onClick,
  onDelete,
}: MesaItemProps) {
  const statusConfig = MESA_STATUS_CONFIG[mesa.status];
  const StatusIcon = (LucideIcons as any)[statusConfig.icon] || LucideIcons.Circle;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar Mesa ${mesa.numero}?`)) {
      onDelete?.(mesa.id);
    }
  };

  // Forma de la mesa
  const getShape = () => {
    switch (mesa.shape) {
      case 'cuadrada':
        return 'rounded-xl';
      case 'redonda':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-2xl';
      case 'grande':
        return 'rounded-3xl';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        scale: isDragging ? 1.05 : 1,
        rotate: mesa.rotation,
      }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      style={{
        position: 'absolute',
        left: mesa.position.x,
        top: mesa.position.y,
        width: mesa.size.width,
        height: mesa.size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : isSelected ? 100 : 10,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`
        ${getShape()}
        ${statusConfig.color}
        ${statusConfig.hoverColor}
        border-2
        backdrop-blur-sm
        transition-all duration-200
        flex flex-col items-center justify-center
        group
        ${isSelected ? 'ring-4 ring-purple-500/50' : ''}
        shadow-lg
      `}
    >
      {/* Número de Mesa */}
      <div className="text-2xl font-bold mb-1">
        {mesa.numero}
      </div>

      {/* Capacidad */}
      <div className="flex items-center space-x-1 text-xs opacity-75">
        <LucideIcons.Users className="w-3 h-3" />
        <span>{mesa.capacidad}</span>
      </div>

      {/* Status Icon */}
      <StatusIcon className="w-4 h-4 mt-1 opacity-60" />

      {/* Resize handles (solo cuando está seleccionada) */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}

      {/* Botón de eliminar (visible al seleccionar) */}
      {isSelected && onDelete && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white dark:border-slate-900"
          title={`Eliminar Mesa ${mesa.numero}`}
        >
          <LucideIcons.X className="w-4 h-4 text-white" />
        </motion.button>
      )}

      {/* Indicador de arrastre */}
      {!isDragging && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-inherit">
          <LucideIcons.Move className="w-6 h-6 text-white/80" />
        </div>
      )}
    </motion.div>
  );
}