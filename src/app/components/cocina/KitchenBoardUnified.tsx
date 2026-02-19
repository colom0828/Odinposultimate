'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChefHat, CheckCircle } from 'lucide-react';
import { Order, KitchenStatus, KITCHEN_STATUS_CONFIG } from '../../types/orders.types';
import { KitchenOrderCard } from './KitchenOrderCard';

// Mapa de iconos para renderizado dinámico
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bell,
  ChefHat,
  CheckCircle,
};

interface KitchenBoardUnifiedProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: KitchenStatus) => void;
  onMarkAsDelivered?: (orderId: string) => void;
  onSendToDelivery?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

export function KitchenBoardUnified({ orders, onStatusChange, onMarkAsDelivered, onSendToDelivery, onCancelOrder }: KitchenBoardUnifiedProps) {
  // Agrupar órdenes por estado de cocina
  const ordersByStatus = useMemo(() => {
    return {
      [KitchenStatus.NUEVA]: orders.filter(o => o.kitchenStatus === KitchenStatus.NUEVA),
      [KitchenStatus.PREPARANDO]: orders.filter(o => o.kitchenStatus === KitchenStatus.PREPARANDO),
      [KitchenStatus.LISTA]: orders.filter(o => o.kitchenStatus === KitchenStatus.LISTA),
    };
  }, [orders]);

  // Definir columnas
  const columns = [
    { status: KitchenStatus.NUEVA, orders: ordersByStatus[KitchenStatus.NUEVA] },
    { status: KitchenStatus.PREPARANDO, orders: ordersByStatus[KitchenStatus.PREPARANDO] },
    { status: KitchenStatus.LISTA, orders: ordersByStatus[KitchenStatus.LISTA] },
  ];

  return (
    <div className="space-y-6">
      {/* Vista Desktop: 3 columnas */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-4">
          {columns.map(({ status, orders: columnOrders }) => {
            const config = KITCHEN_STATUS_CONFIG[status];
            const Icon = ICON_MAP[config.icon] || Bell;

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
                  <AnimatePresence initial={false}>
                    {columnOrders.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700"
                      >
                        <Icon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                          No hay órdenes
                        </p>
                      </motion.div>
                    ) : (
                      columnOrders.map((order) => (
                        <KitchenOrderCard
                          key={order.id}
                          order={order}
                          onStatusChange={onStatusChange}
                          onMarkAsDelivered={onMarkAsDelivered}
                          onSendToDelivery={onSendToDelivery}
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

      {/* Vista Mobile/Tablet: Secciones */}
      <div className="lg:hidden space-y-6">
        {columns.map(({ status, orders: columnOrders }) => {
          const config = KITCHEN_STATUS_CONFIG[status];
          const Icon = ICON_MAP[config.icon] || Bell;

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
                <AnimatePresence initial={false}>
                  {columnOrders.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700"
                    >
                      <Icon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        No hay órdenes
                      </p>
                    </motion.div>
                  ) : (
                    columnOrders.map((order) => (
                      <KitchenOrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={onStatusChange}
                        onMarkAsDelivered={onMarkAsDelivered}
                        onSendToDelivery={onSendToDelivery}
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
  );
}