/**
 * ═══════════════════════════════════════════════════════════════
 * SORTABLE BLOCK ITEM - Item arrastrable con drag handle
 * ═══════════════════════════════════════════════════════════════
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2, Lock } from 'lucide-react';
import { BlockConfig } from '../../types/print-templates.types';
import { cn } from '../ui/utils';

interface SortableBlockItemProps {
  block: BlockConfig;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function SortableBlockItem({
  block,
  isSelected,
  onClick,
  onDelete,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBlockIcon = (type: string) => {
    const icons: Record<string, string> = {
      header: '📋',
      business_info: '🏢',
      customer_info: '👤',
      items: '📦',
      subtotals: '🧮',
      totals: '💰',
      payment_info: '💳',
      footer: '📄',
      custom_text: '📝',
      separator: '➖',
      qr_code: '📱',
      barcode: '📊',
      image: '🖼️',
    };
    return icons[type] || '📄';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-white dark:bg-slate-800 border rounded-lg p-3 transition-all',
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-lg'
          : 'border-slate-200 dark:border-slate-700 hover:border-purple-400',
        isDragging && 'opacity-50 scale-105',
        !block.visible && 'opacity-60'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Icon */}
        <span className="text-2xl">{getBlockIcon(block.type)}</span>

        {/* Content */}
        <button
          onClick={onClick}
          className="flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">
              {block.label}
            </span>
            {block.required && (
              <Lock className="w-3 h-3 text-orange-500" title="Bloque obligatorio" />
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {block.type} • Orden: {block.order}
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Visibility Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Esta acción se manejará desde el padre
              console.log('Toggle visibility for:', block.id);
            }}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            title={block.visible ? 'Ocultar' : 'Mostrar'}
          >
            {block.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Delete */}
          {!block.required && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400"
              title="Eliminar bloque"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual indicator for dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-purple-500/10 rounded-lg border-2 border-purple-500 border-dashed" />
      )}
    </div>
  );
}