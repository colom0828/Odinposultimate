'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Order, OrderType, ORDER_TYPE_CONFIG } from '../../types/orders.types';

interface KitchenListSectionProps {
  orders: Order[];
  onMarkAsDelivered: (orderId: string) => void;
  onSendToDelivery: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export function KitchenListSection({
  orders,
  onMarkAsDelivered,
  onSendToDelivery,
  onCancelOrder,
}: KitchenListSectionProps) {
  // Formatear tiempo desde creación
  const getElapsedTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now.getTime() - created.getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min`;
  };

  return (
    <div className="space-y-4">
      {/* Header de la sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <LucideIcons.CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Listas para entrega / envío
            </h2>
            <p className="text-sm text-slate-400">
              {orders.length} {orders.length === 1 ? 'orden lista' : 'órdenes listas'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de órdenes listas */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
          <LucideIcons.PackageCheck className="w-16 h-16 text-slate-600 mb-4" />
          <p className="text-lg text-slate-400">
            No hay órdenes listas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order, index) => {
            const typeConfig = ORDER_TYPE_CONFIG[order.type];
            const TypeIcon = LucideIcons[typeConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-green-500/30 p-5 shadow-xl hover:shadow-green-500/20 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {order.orderNumber}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                      <p className="text-sm font-medium text-slate-300">
                        {order.type === OrderType.MESA && order.tableNumber
                          ? `Mesa ${order.tableNumber}`
                          : order.type === OrderType.DELIVERY && order.customer
                          ? order.customer.name
                          : typeConfig.label}
                      </p>
                    </div>
                  </div>

                  {/* Badge de tiempo */}
                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                    <LucideIcons.Clock className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs font-bold text-green-400">
                      {getElapsedTime(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Información adicional para Delivery */}
                {order.type === OrderType.DELIVERY && order.delivery && (
                  <div className="mb-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-start space-x-2">
                      <LucideIcons.MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-slate-300">
                        <p className="font-semibold">{order.delivery.address} #{order.delivery.addressNumber}</p>
                        {order.delivery.reference && (
                          <p className="text-slate-400 mt-0.5">{order.delivery.reference}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="text-sm text-slate-300">
                        <span className="font-bold text-white">{item.qty}x</span> {item.name}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-slate-500 italic">
                        +{order.items.length - 2} más...
                      </p>
                    )}
                  </div>
                </div>

                {/* Botón de acción según tipo */}
                <div className="space-y-2">
                  {order.type === OrderType.MESA || order.type === OrderType.PARA_LLEVAR ? (
                    <button
                      onClick={() => onMarkAsDelivered(order.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                    >
                      <LucideIcons.Check className="w-4 h-4" />
                      <span>Marcar como Entregada</span>
                    </button>
                  ) : order.type === OrderType.DELIVERY ? (
                    <button
                      onClick={() => onSendToDelivery(order.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                    >
                      <LucideIcons.Bike className="w-4 h-4" />
                      <span>Enviar a Delivery</span>
                    </button>
                  ) : null}

                  {/* Botón cancelar */}
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-400 hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    <LucideIcons.X className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">Cancelar</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
