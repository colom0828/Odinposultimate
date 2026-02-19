'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  KitchenOrder, 
  OrderStatus, 
  ORDER_STATUS_CONFIG, 
  ORDER_TYPE_CONFIG 
} from '../../types/cocina.types';
import { Button } from '../ui/button';

interface OrderCardProps {
  order: KitchenOrder;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onCancelOrder?: (orderId: string) => void;
}

export function OrderCard({ order, onStatusChange, onCancelOrder }: OrderCardProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const typeConfig = ORDER_TYPE_CONFIG[order.tipo];

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

  // Determinar si la orden es urgente (más de 15 minutos)
  const isUrgent = () => {
    const diff = new Date().getTime() - order.horaCreacion.getTime();
    return diff > 15 * 60 * 1000 && order.status !== OrderStatus.LISTA;
  };

  // Manejar cancelación con confirmación
  const handleCancelClick = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id);
    }
  };

  // Acciones disponibles según el estado
  const getActions = () => {
    switch (order.status) {
      case OrderStatus.NUEVA:
        return [
          {
            label: 'Iniciar',
            icon: LucideIcons.Play,
            onClick: () => onStatusChange(order.id, OrderStatus.EN_PREPARACION),
            variant: 'primary' as const,
          },
        ];
      case OrderStatus.EN_PREPARACION:
        return [
          {
            label: 'Volver',
            icon: LucideIcons.ArrowLeft,
            onClick: () => onStatusChange(order.id, OrderStatus.NUEVA),
            variant: 'secondary' as const,
          },
          {
            label: 'Listo',
            icon: LucideIcons.CheckCircle,
            onClick: () => onStatusChange(order.id, OrderStatus.LISTA),
            variant: 'primary' as const,
          },
        ];
      case OrderStatus.LISTA:
        return [
          {
            label: 'Volver',
            icon: LucideIcons.ArrowLeft,
            onClick: () => onStatusChange(order.id, OrderStatus.EN_PREPARACION),
            variant: 'secondary' as const,
          },
          {
            label: 'Entregar',
            icon: LucideIcons.Package,
            onClick: () => onStatusChange(order.id, OrderStatus.ENTREGADA),
            variant: 'primary' as const,
          },
        ];
      default:
        return [];
    }
  };

  const TypeIcon = (LucideIcons as any)[typeConfig.icon] || LucideIcons.Circle;
  const urgent = isUrgent();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 shadow-xl
        bg-white dark:bg-slate-900 transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
        ${statusConfig.borderColor}
        ${urgent ? 'ring-4 ring-red-500/50 animate-pulse' : ''}
      `}
    >
      {/* Badge de estado en esquina superior */}
      <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl ${statusConfig.color} shadow-lg`}>
        <p className="text-xs font-bold text-white uppercase tracking-wide">
          {statusConfig.label}
        </p>
      </div>

      {/* Badge de urgencia */}
      {urgent && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 px-3 py-1 bg-red-500 rounded-full shadow-lg"
        >
          <div className="flex items-center space-x-1">
            <LucideIcons.AlertCircle className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white">URGENTE</span>
          </div>
        </motion.div>
      )}

      {/* Contenido */}
      <div className="p-6 pt-14">
        {/* Header con número de orden */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {order.numero}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {order.tipo === 'mesa' && order.mesaNumero 
                  ? `Mesa ${order.mesaNumero}` 
                  : typeConfig.label}
              </p>
            </div>
          </div>
          
          {/* Tiempo transcurrido */}
          <div className={`text-right ${statusConfig.bgLight} px-3 py-2 rounded-xl`}>
            <LucideIcons.Clock className={`w-4 h-4 ${statusConfig.textColor} mx-auto mb-1`} />
            <p className={`text-xs font-bold ${statusConfig.textColor}`}>
              {getTimeElapsed()}
            </p>
          </div>
        </div>

        {/* Items de la orden */}
        <div className="mb-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
            Items
          </p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {item.cantidad}x
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.nombre}
                    </p>
                    {item.notas && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1">
                        "{item.notas}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas del cliente */}
        {order.notasCliente && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl">
            <div className="flex items-start space-x-2">
              <LucideIcons.MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                  Nota del cliente:
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {order.notasCliente}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-2">
          {/* Botones principales de acción */}
          <div className="flex gap-2">
            {getActions().map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                className={`
                  flex-1 flex items-center justify-center space-x-2
                  ${action.variant === 'primary'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }
                `}
              >
                <action.icon className="w-4 h-4" />
                <span className="font-semibold">{action.label}</span>
              </Button>
            ))}
          </div>
          
          {/* Botón de cancelar (sutil) */}
          {onCancelOrder && (
            <Button
              onClick={handleCancelClick}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30"
            >
              <LucideIcons.XCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Cancelar Orden</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}