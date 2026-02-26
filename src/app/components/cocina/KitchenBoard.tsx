import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { KitchenOrder, OrderStatus } from '../../types/cocina.types';
import { OrderCard } from './OrderCard';
import { KitchenFilters } from './KitchenFilters';

interface KitchenBoardProps {
  orders: KitchenOrder[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onCancelOrder?: (orderId: string) => void;
}

export function KitchenBoard({ orders, onStatusChange, onCancelOrder }: KitchenBoardProps) {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');

  // Filtrar y ordenar órdenes
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Aplicar filtro de estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    // Ordenar por antigüedad (más antiguas primero)
    return filtered.sort((a, b) => 
      a.horaCreacion.getTime() - b.horaCreacion.getTime()
    );
  }, [orders, activeFilter]);

  // Contar órdenes por estado
  const orderCounts = useMemo(() => {
    return {
      [OrderStatus.NUEVA]: orders.filter(o => o.status === OrderStatus.NUEVA).length,
      [OrderStatus.EN_PREPARACION]: orders.filter(o => o.status === OrderStatus.EN_PREPARACION).length,
      [OrderStatus.LISTA]: orders.filter(o => o.status === OrderStatus.LISTA).length,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <KitchenFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          orderCounts={orderCounts}
        />
      </motion.div>

      {/* Tablero de órdenes */}
      <AnimatePresence mode="popLayout">
        {filteredOrders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6">
              <LucideIcons.ChefHat className="w-16 h-16 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              No hay órdenes
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {activeFilter === 'all' 
                ? 'No hay órdenes pendientes en este momento'
                : `No hay órdenes ${activeFilter === OrderStatus.NUEVA ? 'nuevas' : activeFilter === OrderStatus.EN_PREPARACION ? 'en preparación' : 'listas'}`
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={onStatusChange}
                onCancelOrder={onCancelOrder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}