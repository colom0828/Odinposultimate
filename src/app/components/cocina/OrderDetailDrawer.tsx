import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Bell,
  ChefHat,
  CheckCircle,
  Utensils,
  ShoppingBag,
  Bike,
  ShoppingCart,
  AlertCircle,
  MessageSquare,
  Network,
  RotateCw
} from 'lucide-react';
import { Order, ORDER_TYPE_CONFIG, KITCHEN_STATUS_CONFIG } from '../../types/orders.types';
import { ChannelBadge } from './ChannelBadge';

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

interface OrderDetailDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailDrawer({ order, isOpen, onClose }: OrderDetailDrawerProps) {
  if (!order) return null;

  const typeConfig = ORDER_TYPE_CONFIG[order.type];
  const statusConfig = KITCHEN_STATUS_CONFIG[order.kitchenStatus];
  const TypeIcon = ICON_MAP[typeConfig.icon] || Utensils;
  const StatusIcon = ICON_MAP[statusConfig.icon] || Bell;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getSyncStatusBadge = () => {
    if (!order.integration?.syncStatus) return null;

    const config = {
      SYNCED: {
        icon: CheckCircle2,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        label: 'Sincronizado',
      },
      PENDING: {
        icon: Clock,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        label: 'Pendiente de sync',
      },
      FAILED: {
        icon: AlertTriangle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        label: 'Falló sincronización',
      },
    };

    const statusConfig = config[order.integration.syncStatus];
    const Icon = statusConfig.icon;

    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}>
        <Icon className={`w-4 h-4 ${statusConfig.color}`} />
        <span className={`text-sm font-semibold ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-secondary border-b border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{order.orderNumber}</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-lg ${statusConfig.bgLight} border ${statusConfig.borderColor}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.textColor}`} />
                      <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    {order.integration && (
                      <ChannelBadge channel={order.integration.channel} size="md" />
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Información del Pedido */}
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                  <h3 className="text-sm font-semibold text-foreground">{typeConfig.label}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {order.type === 'MESA' && order.tableNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mesa:</span>
                      <span className="text-foreground font-medium">#{order.tableNumber}</span>
                    </div>
                  )}
                  {order.customer && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cliente:</span>
                        <span className="text-foreground font-medium">{order.customer.name}</span>
                      </div>
                      {order.customer.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Teléfono:</span>
                          <span className="text-foreground font-medium">{order.customer.phone}</span>
                        </div>
                      )}
                    </>
                  )}
                  {order.delivery && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dirección:</span>
                      <span className="text-foreground font-medium text-right">
                        {order.delivery.address} #{order.delivery.addressNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <ShoppingCart className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-semibold text-foreground">Productos</h3>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-secondary/50 rounded-lg p-3 border border-border"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-foreground">x{item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas Generales */}
              {order.notes && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">Notas:</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">{order.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Integración con Sistema Externo */}
              {order.integration && (
                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center space-x-2 mb-3">
                    <Network className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-foreground">Datos de Integración</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Estado de Sincronización */}
                    {getSyncStatusBadge()}

                    {/* ID Externo */}
                    {order.integration.externalOrderId && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">ID Sistema Externo:</p>
                        <p className="text-sm font-mono text-foreground bg-secondary px-3 py-2 rounded-lg border border-border">
                          {order.integration.externalOrderId}
                        </p>
                      </div>
                    )}

                    {/* Canal */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Canal de Origen:</p>
                      <ChannelBadge channel={order.integration.channel} size="md" />
                    </div>

                    {/* Timestamp Recibido */}
                    {order.integration.receivedAt && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Recibido:</p>
                        <p className="text-sm text-foreground">{formatFullDate(order.integration.receivedAt)}</p>
                      </div>
                    )}

                    {/* Última Sincronización */}
                    {order.integration.lastSyncAt && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Última Sincronización:</p>
                        <p className="text-sm text-foreground">{formatFullDate(order.integration.lastSyncAt)}</p>
                      </div>
                    )}

                    {/* Razón de Fallo */}
                    {order.integration.syncStatus === 'FAILED' && order.integration.failedReason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-xs text-red-600 dark:text-red-400 mb-1">Error:</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{order.integration.failedReason}</p>
                        <button className="mt-2 flex items-center space-x-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                          <RotateCw className="w-3 h-3" />
                          <span>Reintentar sincronización</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-foreground">Historial</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creada:</span>
                    <span className="text-foreground font-medium">{formatFullDate(order.createdAt)}</span>
                  </div>
                  {order.kitchenStartedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Iniciada:</span>
                      <span className="text-foreground font-medium">{formatFullDate(order.kitchenStartedAt)}</span>
                    </div>
                  )}
                  {order.kitchenReadyAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lista:</span>
                      <span className="text-foreground font-medium">{formatFullDate(order.kitchenReadyAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-secondary/95 backdrop-blur-sm border-t border-border p-6">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent/80 text-foreground font-semibold transition-all"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}