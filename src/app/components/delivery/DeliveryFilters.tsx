import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { DeliveryStatus, DELIVERY_STATUS_CONFIG } from '../../types/delivery.types';

interface DeliveryFiltersProps {
  activeFilter: DeliveryStatus | 'all';
  onFilterChange: (filter: DeliveryStatus | 'all') => void;
  orderCounts: Record<DeliveryStatus, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DeliveryFilters({
  activeFilter,
  onFilterChange,
  orderCounts,
  searchQuery,
  onSearchChange,
}: DeliveryFiltersProps) {
  const filters = [
    { id: 'all' as const, label: 'Todos', count: Object.values(orderCounts).reduce((a, b) => a + b, 0) },
    { id: DeliveryStatus.NUEVO, ...DELIVERY_STATUS_CONFIG[DeliveryStatus.NUEVO], count: orderCounts[DeliveryStatus.NUEVO] },
    { id: DeliveryStatus.PREPARANDO, ...DELIVERY_STATUS_CONFIG[DeliveryStatus.PREPARANDO], count: orderCounts[DeliveryStatus.PREPARANDO] },
    { id: DeliveryStatus.EN_RUTA, ...DELIVERY_STATUS_CONFIG[DeliveryStatus.EN_RUTA], count: orderCounts[DeliveryStatus.EN_RUTA] },
    { id: DeliveryStatus.ENTREGADO, ...DELIVERY_STATUS_CONFIG[DeliveryStatus.ENTREGADO], count: orderCounts[DeliveryStatus.ENTREGADO] },
    { id: DeliveryStatus.CANCELADO, ...DELIVERY_STATUS_CONFIG[DeliveryStatus.CANCELADO], count: orderCounts[DeliveryStatus.CANCELADO] },
  ];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por #orden, cliente o teléfono..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Chips de filtros */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const Icon = filter.id === 'all' 
            ? LucideIcons.List 
            : LucideIcons[filter.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

          return (
            <motion.button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2
                ${isActive
                  ? filter.id === 'all'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : `${filter.color} text-white shadow-lg`
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }
              `}>
                {filter.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}