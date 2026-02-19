'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  DeliveryOrder, 
  DeliveryStatus, 
  DELIVERY_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  DeliveryPriority,
} from '../../types/delivery.types';
import { useState } from 'react';

interface DeliveryOrderCardProps {
  order: DeliveryOrder;
  onStatusChange: (orderId: string, newStatus: DeliveryStatus) => void;
  onAssignCourier: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

export function DeliveryOrderCard({
  order,
  onStatusChange,
  onAssignCourier,
  onCancelOrder,
}: DeliveryOrderCardProps) {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const statusConfig = DELIVERY_STATUS_CONFIG[order.status];
  const paymentConfig = PAYMENT_METHOD_CONFIG[order.metodoPago];

  // Calcular tiempo transcurrido
  const getTimeElapsed = () => {
    const now = new Date();
    const diff = now.getTime() - order.horaCreacion.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes === 1) return 'Hace 1 min';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `Hace ${hours}h ${remainingMins}m`;
  };

  // Determinar si el pedido es urgente (más de 20 minutos)
  const isUrgent = () => {
    const diff = new Date().getTime() - order.horaCreacion.getTime();
    return diff > 20 * 60 * 1000 && order.status !== DeliveryStatus.ENTREGADO && order.status !== DeliveryStatus.CANCELADO;
  };

  // Obtener dirección resumida
  const getShortAddress = () => {
    return `${order.direccion.calle} ${order.direccion.numero}`;
  };

  // Obtener dirección completa
  const getFullAddress = () => {
    const parts = [
      `${order.direccion.calle} ${order.direccion.numero}`,
      order.direccion.colonia,
      order.direccion.ciudad,
      order.direccion.codigoPostal,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Obtener acciones según el estado
  const getActions = () => {
    const actions = [];

    switch (order.status) {
      case DeliveryStatus.NUEVO:
        actions.push({
          label: 'Aceptar',
          icon: LucideIcons.Check,
          onClick: () => onStatusChange(order.id, DeliveryStatus.PREPARANDO),
          variant: 'primary' as const,
        });
        break;

      case DeliveryStatus.PREPARANDO:
        if (order.repartidor) {
          actions.push({
            label: 'En Ruta',
            icon: LucideIcons.Bike,
            onClick: () => onStatusChange(order.id, DeliveryStatus.EN_RUTA),
            variant: 'primary' as const,
          });
        } else {
          actions.push({
            label: 'Asignar Repartidor',
            icon: LucideIcons.UserPlus,
            onClick: () => onAssignCourier(order.id),
            variant: 'primary' as const,
          });
        }
        break;

      case DeliveryStatus.EN_RUTA:
        actions.push({
          label: 'Entregado',
          icon: LucideIcons.CheckCircle2,
          onClick: () => onStatusChange(order.id, DeliveryStatus.ENTREGADO),
          variant: 'primary' as const,
        });
        break;
    }

    return actions;
  };

  const StatusIcon = LucideIcons[statusConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  const PaymentIcon = LucideIcons[paymentConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Header con estado y urgencia */}
      <div className={`${statusConfig.color} p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-5 h-5 text-white" />
            <span className="font-bold text-white">{statusConfig.label}</span>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="text-white/90 font-bold text-lg">{order.numero}</span>
            {isUrgent() && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded-lg"
              >
                <LucideIcons.AlertTriangle className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">URGENTE</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Cliente */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <LucideIcons.User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {order.cliente.nombre}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <LucideIcons.Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              {order.cliente.telefono}
            </span>
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <LucideIcons.MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-slate-900 dark:text-white">
                {showFullAddress ? getFullAddress() : getShortAddress()}
              </p>
              {order.direccion.referencia && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Ref: {order.direccion.referencia}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowFullAddress(!showFullAddress)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline whitespace-nowrap"
            >
              {showFullAddress ? 'Menos' : 'Ver más'}
            </button>
          </div>
        </div>

        {/* Items del pedido */}
        <div>
          <button
            onClick={() => setShowItems(!showItems)}
            className="flex items-center justify-between w-full p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <LucideIcons.ShoppingBag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            <LucideIcons.ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${showItems ? 'rotate-180' : ''}`} />
          </button>

          {showItems && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2"
            >
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.cantidad}x {item.nombre}
                    </p>
                    {item.notas && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {item.notas}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white ml-2">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Repartidor asignado */}
        {order.repartidor && (
          <div className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/30">
            <LucideIcons.Bike className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
              {order.repartidor.nombre}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              ({order.repartidor.telefono})
            </span>
          </div>
        )}

        {/* Notas */}
        {order.notas && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-start space-x-2">
              <LucideIcons.MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <p className="text-sm text-yellow-900 dark:text-yellow-300">
                {order.notas}
              </p>
            </div>
          </div>
        )}

        {/* Footer con información */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <LucideIcons.Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {getTimeElapsed()}
            </span>
          </div>
          <div className={`flex items-center justify-end space-x-2 ${paymentConfig.color}`}>
            <PaymentIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {paymentConfig.label}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Total</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            ${order.total.toFixed(2)}
          </span>
        </div>

        {/* Acciones */}
        <div className="space-y-2">
          {/* Botones principales de acción */}
          <div className="flex gap-2">
            {getActions().map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all
                  ${action.variant === 'primary'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }
                `}
              >
                <action.icon className="w-4 h-4" />
                <span className="font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
          
          {/* Botón de cancelar (sutil) */}
          {onCancelOrder && order.status !== DeliveryStatus.ENTREGADO && order.status !== DeliveryStatus.CANCELADO && (
            <button
              onClick={() => onCancelOrder(order.id)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 transition-all"
            >
              <LucideIcons.XCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Cancelar Pedido</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}