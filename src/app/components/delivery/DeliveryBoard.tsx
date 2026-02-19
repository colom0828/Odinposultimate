'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { DeliveryOrder, DeliveryStatus, DELIVERY_STATUS_CONFIG } from '../../types/delivery.types';
import { DeliveryOrderCard } from './DeliveryOrderCard';

interface DeliveryBoardProps {
  orders: DeliveryOrder[];
  onStatusChange: (orderId: string, newStatus: DeliveryStatus) => void;
  onAssignCourier: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

export function DeliveryBoard({
  orders,
  onStatusChange,
  onAssignCourier,
  onCancelOrder,
}: DeliveryBoardProps) {
  // Agrupar órdenes por estado
  const ordersByStatus = useMemo(() => {
    return {
      [DeliveryStatus.NUEVO]: orders.filter(o => o.status === DeliveryStatus.NUEVO),
      [DeliveryStatus.PREPARANDO]: orders.filter(o => o.status === DeliveryStatus.PREPARANDO),
      [DeliveryStatus.EN_RUTA]: orders.filter(o => o.status === DeliveryStatus.EN_RUTA),
      [DeliveryStatus.ENTREGADO]: orders.filter(o => o.status === DeliveryStatus.ENTREGADO),
      [DeliveryStatus.CANCELADO]: orders.filter(o => o.status === DeliveryStatus.CANCELADO),
    };
  }, [orders]);

  // Definir columnas del tablero Kanban
  const columns = [
    { status: DeliveryStatus.NUEVO, orders: ordersByStatus[DeliveryStatus.NUEVO] },
    { status: DeliveryStatus.PREPARANDO, orders: ordersByStatus[DeliveryStatus.PREPARANDO] },
    { status: DeliveryStatus.EN_RUTA, orders: ordersByStatus[DeliveryStatus.EN_RUTA] },
    { status: DeliveryStatus.ENTREGADO, orders: ordersByStatus[DeliveryStatus.ENTREGADO] },
    { status: DeliveryStatus.CANCELADO, orders: ordersByStatus[DeliveryStatus.CANCELADO] },
  ];

  return (
    <div className="space-y-6">
      {/* Vista Desktop: Kanban */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-5 gap-4">
          {columns.map(({ status, orders: columnOrders }) => {
            const config = DELIVERY_STATUS_CONFIG[status];
            const Icon = LucideIcons[config.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

            return (
              <div key={status} className="flex flex-col">
                {/* Header de columna */}
                <div className={`${config.color} rounded-2xl p-4 mb-4 shadow-lg`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <h3 className="font-bold">{config.label}</h3>
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                      {columnOrders.length}
                    </span>
                  </div>
                </div>

                {/* Órdenes */}
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {columnOrders.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700"
                      >
                        <Icon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                          No hay pedidos
                        </p>
                      </motion.div>
                    ) : (
                      columnOrders.map((order) => (
                        <DeliveryOrderCard
                          key={order.id}
                          order={order}
                          onStatusChange={onStatusChange}
                          onAssignCourier={onAssignCourier}
                          onCancelOrder={onCancelOrder}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vista Mobile/Tablet: Lista agrupada */}
      <div className="lg:hidden space-y-6">
        {columns.map(({ status, orders: columnOrders }) => {
          const config = DELIVERY_STATUS_CONFIG[status];
          const Icon = LucideIcons[config.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

          if (columnOrders.length === 0) return null;

          return (
            <div key={status}>
              {/* Header de sección */}
              <div className={`${config.color} rounded-2xl p-4 mb-4 shadow-lg`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{config.label}</h3>
                  </div>
                  <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-bold">
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Órdenes */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {columnOrders.map((order) => (
                    <DeliveryOrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={onStatusChange}
                      onAssignCourier={onAssignCourier}
                      onCancelOrder={onCancelOrder}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6">
              <LucideIcons.Package className="w-16 h-16 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              No hay pedidos
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No hay pedidos de delivery en este momento
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
