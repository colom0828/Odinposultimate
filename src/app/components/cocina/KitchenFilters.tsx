'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { OrderStatus, ORDER_STATUS_CONFIG } from '../../types/cocina.types';

interface KitchenFiltersProps {
  activeFilter: OrderStatus | 'all';
  onFilterChange: (filter: OrderStatus | 'all') => void;
  orderCounts: Record<string, number>;
}

export function KitchenFilters({ activeFilter, onFilterChange, orderCounts }: KitchenFiltersProps) {
  const filters = [
    {
      id: 'all' as const,
      label: 'Todas',
      icon: LucideIcons.LayoutGrid,
      color: 'from-slate-600 to-slate-700',
    },
    {
      id: OrderStatus.NUEVA,
      label: ORDER_STATUS_CONFIG[OrderStatus.NUEVA].label,
      icon: (LucideIcons as any)[ORDER_STATUS_CONFIG[OrderStatus.NUEVA].icon],
      color: 'from-blue-600 to-purple-600',
    },
    {
      id: OrderStatus.EN_PREPARACION,
      label: ORDER_STATUS_CONFIG[OrderStatus.EN_PREPARACION].label,
      icon: (LucideIcons as any)[ORDER_STATUS_CONFIG[OrderStatus.EN_PREPARACION].icon],
      color: 'from-yellow-600 to-orange-600',
    },
    {
      id: OrderStatus.LISTA,
      label: ORDER_STATUS_CONFIG[OrderStatus.LISTA].label,
      icon: (LucideIcons as any)[ORDER_STATUS_CONFIG[OrderStatus.LISTA].icon],
      color: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter, index) => {
        const isActive = activeFilter === filter.id;
        const count = filter.id === 'all' 
          ? Object.values(orderCounts).reduce((sum, val) => sum + val, 0)
          : orderCounts[filter.id] || 0;

        return (
          <motion.button
            key={filter.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id)}
            className={`
              relative flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm
              transition-all duration-200 shadow-lg
              ${isActive
                ? `bg-gradient-to-r ${filter.color} text-white shadow-${filter.color.split('-')[1]}-500/30`
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }
            `}
          >
            <filter.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            <span>{filter.label}</span>
            
            {/* Badge de contador */}
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  min-w-[24px] h-6 px-2 rounded-full text-xs font-bold flex items-center justify-center
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white'
                  }
                `}
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}