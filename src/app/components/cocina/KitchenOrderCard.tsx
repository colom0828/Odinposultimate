'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle,
  MessageSquare,
  Clock,
  Info,
  XCircle,
  Play,
  Check,
  CheckCircle2,
  Bike,
  Bell,
  ChefHat,
  CheckCircle,
  Utensils,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Order,
  KitchenStatus,
  OrderType,
  KITCHEN_STATUS_CONFIG,
  ORDER_TYPE_CONFIG,
  Priority,
} from '../../types/orders.types';
import { ChannelBadge } from './ChannelBadge';
import { OrderDetailDrawer } from './OrderDetailDrawer';

// Mapa de iconos para renderizado dinámico
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bell,
  ChefHat,
  CheckCircle,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  Bike,
};

interface KitchenOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: KitchenStatus) => void;
  onMarkAsDelivered?: (orderId: string) => void;
  onSendToDelivery?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

export function KitchenOrderCard({ order, onStatusChange, onMarkAsDelivered, onSendToDelivery, onCancelOrder }: KitchenOrderCardProps) {
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const statusConfig = KITCHEN_STATUS_CONFIG[order.kitchenStatus];
  const typeConfig = ORDER_TYPE_CONFIG[order.type];
  const StatusIcon = ICON_MAP[statusConfig.icon] || Bell;
  const TypeIcon = ICON_MAP[typeConfig.icon] || Utensils;

  // Calcular tiempo transcurrido
  const getTimeElapsed = () => {
    const now = new Date();
    const created = new Date(order.createdAt);
    const diff = now.getTime() - created.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes === 1) return 'Hace 1 min';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `Hace ${hours}h ${remainingMins}m`;
  };

  // Determinar si es urgente (más de 15 minutos)
  const isUrgent = () => {
    const diff = new Date().getTime() - new Date(order.createdAt).getTime();
    return diff > 15 * 60 * 1000 || order.priority === Priority.URGENTE;
  };

  // Obtener acciones según el estado
  const getActions = () => {
    const actions = [];

    switch (order.kitchenStatus) {
      case KitchenStatus.NUEVA:
        actions.push({
          label: 'Iniciar',
          icon: Play,
          onClick: () => onStatusChange(order.id, KitchenStatus.PREPARANDO),
          color: 'bg-yellow-600 hover:bg-yellow-700',
        });
        break;

      case KitchenStatus.PREPARANDO:
        actions.push({
          label: 'Marcar Lista',
          icon: Check,
          onClick: () => onStatusChange(order.id, KitchenStatus.LISTA),
          color: 'bg-green-600 hover:bg-green-700',
        });
        break;
    }

    return actions;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Header con estado */}
      <div className={`${statusConfig.color} p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-5 h-5 text-white" />
            <span className="font-bold text-white">{statusConfig.label}</span>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="text-white/90 font-bold text-lg">{order.orderNumber}</span>
            {isUrgent() && (
              <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded-lg animate-pulse">
                <AlertTriangle className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">URGENTE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Tipo de orden */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${typeConfig.color}`}>
            <TypeIcon className="w-4 h-4" />
            <span className="font-semibold text-sm">{typeConfig.label}</span>
          </div>
          {order.type === OrderType.MESA && order.tableNumber && (
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Mesa {order.tableNumber}
            </span>
          )}
          {order.type === OrderType.DELIVERY && order.customer && (
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {order.customer.name}
            </span>
          )}
        </div>

        {/* Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.qty}x {item.name}
                </p>
                {item.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Notas */}
        {order.notes && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <p className="text-sm text-yellow-900 dark:text-yellow-300">
                {order.notes}
              </p>
            </div>
          </div>
        )}

        {/* Footer con tiempo y badges */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            {/* Badge de canal/fuente */}
            {order.integration && (
              <ChannelBadge channel={order.integration.channel} size="sm" />
            )}
            
            {/* Indicador de sync fallido */}
            {order.integration?.syncStatus === 'FAILED' && (
              <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                <span className="text-[10px] font-bold text-red-400">SYNC</span>
              </div>
            )}
            
            {/* Indicador de pendiente de sync */}
            {order.integration?.syncStatus === 'PENDING' && (
              <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30">
                <Clock className="w-2.5 h-2.5 text-yellow-400 animate-pulse" />
                <span className="text-[10px] font-bold text-yellow-400">SYNC</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{getTimeElapsed()}</span>
          </div>
        </div>

        {/* Acciones de NUEVA/PREPARANDO */}
        {getActions().length > 0 && (
          <div className="space-y-2">
            {getActions().map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl ${action.color} text-white font-semibold transition-all shadow-lg`}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Acciones contextuales para columna LISTA */}
        {order.kitchenStatus === KitchenStatus.LISTA && (
          <div className="space-y-2">
            {/* Si es MESA o PARA_LLEVAR → Marcar como Entregada */}
            {(order.type === OrderType.MESA || order.type === OrderType.PARA_LLEVAR) && onMarkAsDelivered && (
              <button
                onClick={() => onMarkAsDelivered(order.id)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 text-white font-semibold transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar como Entregada</span>
              </button>
            )}
            
            {/* Si es DELIVERY → Enviar a Delivery */}
            {order.type === OrderType.DELIVERY && onSendToDelivery && (
              <button
                onClick={() => onSendToDelivery(order.id)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:shadow-lg hover:shadow-orange-500/50 text-white font-semibold transition-all"
              >
                <Bike className="w-4 h-4" />
                <span>Enviar a Delivery</span>
              </button>
            )}
          </div>
        )}
        
        {/* Botón de ver detalle (para todas las órdenes) */}
        <button
          onClick={() => setShowDetailDrawer(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-all"
        >
          <Info className="w-4 h-4" />
          <span className="font-medium text-sm">Ver Detalles</span>
        </button>

        {/* Botón de cancelar (sutil) */}
        {onCancelOrder && order.kitchenStatus !== KitchenStatus.ENTREGADA && (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span className="font-medium text-sm">Cancelar Orden</span>
          </button>
        )}
      </div>
      
      {/* Drawer de Detalles */}
      <OrderDetailDrawer
        order={order}
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
      />
    </motion.div>
  );
}