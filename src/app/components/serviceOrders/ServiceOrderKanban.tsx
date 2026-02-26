import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import {
  ServiceOrder,
  ServiceOrderStatus,
  SERVICE_ORDER_STATUS_CONFIG,
} from '../../types/serviceOrders.types';
import { ServiceOrderCard } from './ServiceOrderCard';

interface ServiceOrderKanbanProps {
  orders: ServiceOrder[];
  onViewDetails: (order: ServiceOrder) => void;
  onChangeStatus: (orderId: string, newStatus: ServiceOrderStatus) => void;
  onAssignTechnician: (orderId: string) => void;
}

export function ServiceOrderKanban({
  orders,
  onViewDetails,
  onChangeStatus,
  onAssignTechnician,
}: ServiceOrderKanbanProps) {
  // Agrupar órdenes por estado
  const ordersByStatus = useMemo(() => {
    const grouped: Record<ServiceOrderStatus, ServiceOrder[]> = {
      [ServiceOrderStatus.RECIBIDA]: [],
      [ServiceOrderStatus.DIAGNOSTICO]: [],
      [ServiceOrderStatus.APROBACION]: [],
      [ServiceOrderStatus.REPARACION]: [],
      [ServiceOrderStatus.LISTO]: [],
      [ServiceOrderStatus.ENTREGADO]: [],
      [ServiceOrderStatus.CANCELADO]: [],
    };

    orders.forEach(order => {
      if (grouped[order.status]) {
        grouped[order.status].push(order);
      }
    });

    return grouped;
  }, [orders]);

  // Definir columnas visibles (excluir entregado y cancelado del kanban principal)
  const mainColumns = [
    ServiceOrderStatus.RECIBIDA,
    ServiceOrderStatus.DIAGNOSTICO,
    ServiceOrderStatus.APROBACION,
    ServiceOrderStatus.REPARACION,
    ServiceOrderStatus.LISTO,
  ];

  return (
    <div className="space-y-6">
      {/* Vista Desktop: 5 columnas */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-5 gap-4">
          {mainColumns.map((status) => {
            const config = SERVICE_ORDER_STATUS_CONFIG[status];
            const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Circle;
            const columnOrders = ordersByStatus[status] || [];

            return (
              <div key={status} className="flex flex-col">
                {/* Header de columna */}
                <div className={`${config.color} rounded-2xl p-4 mb-4 shadow-lg border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                      <h3 className="font-bold text-sm">{config.label}</h3>
                    </div>
                    <span className="bg-slate-900/30 px-3 py-1 rounded-full text-sm font-bold">
                      {columnOrders.length}
                    </span>
                  </div>
                  <p className="text-xs opacity-70 mt-1">{config.description}</p>
                </div>

                {/* Órdenes */}
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {columnOrders.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center p-8 bg-slate-900/30 rounded-2xl border-2 border-dashed border-[var(--odin-border-accent)]"
                      >
                        {IconComponent && <IconComponent className="w-12 h-12 text-[var(--odin-text-secondary)] opacity-30 mb-3" />}
                        <p className="text-sm text-[var(--odin-text-secondary)] text-center">
                          No hay órdenes
                        </p>
                      </motion.div>
                    ) : (
                      columnOrders.map((order) => (
                        <ServiceOrderCard
                          key={order.id}
                          order={order}
                          onViewDetails={onViewDetails}
                          onChangeStatus={onChangeStatus}
                          onAssignTechnician={onAssignTechnician}
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

      {/* Vista Mobile/Tablet: Secciones apiladas */}
      <div className="lg:hidden space-y-6">
        {mainColumns.map((status) => {
          const config = SERVICE_ORDER_STATUS_CONFIG[status];
          const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Circle;
          const columnOrders = ordersByStatus[status] || [];

          return (
            <div key={status} className="space-y-4">
              {/* Header de sección móvil */}
              <div className={`${config.color} rounded-2xl p-4 shadow-lg border`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <div>
                      <h3 className="font-bold text-sm">{config.label}</h3>
                      <p className="text-xs opacity-70">{config.description}</p>
                    </div>
                  </div>
                  <span className="bg-slate-900/30 px-3 py-1.5 rounded-full text-sm font-bold">
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Órdenes */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {columnOrders.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-8 bg-slate-900/30 rounded-2xl border-2 border-dashed border-[var(--odin-border-accent)]"
                    >
                      {IconComponent && <IconComponent className="w-12 h-12 text-[var(--odin-text-secondary)] opacity-30 mb-3" />}
                      <p className="text-sm text-[var(--odin-text-secondary)] text-center">
                        No hay órdenes
                      </p>
                    </motion.div>
                  ) : (
                    columnOrders.map((order) => (
                      <ServiceOrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={onViewDetails}
                        onChangeStatus={onChangeStatus}
                        onAssignTechnician={onAssignTechnician}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección separada para Entregados y Cancelados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--odin-border-accent)]">
        {[ServiceOrderStatus.ENTREGADO, ServiceOrderStatus.CANCELADO].map((status) => {
          const config = SERVICE_ORDER_STATUS_CONFIG[status];
          const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Circle;
          const columnOrders = ordersByStatus[status] || [];

          return (
            <div key={status} className="space-y-4">
              {/* Header */}
              <div className={`${config.color} rounded-2xl p-4 shadow-lg border`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <h3 className="font-bold text-sm">{config.label}</h3>
                  </div>
                  <span className="bg-slate-900/30 px-3 py-1.5 rounded-full text-sm font-bold">
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Lista compacta */}
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {columnOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-900/30 rounded-xl border border-dashed border-[var(--odin-border-accent)]">
                    <p className="text-xs text-[var(--odin-text-secondary)]">
                      No hay órdenes {config.label.toLowerCase()}
                    </p>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-xl p-3 hover:border-purple-500/30 transition-all cursor-pointer"
                      onClick={() => onViewDetails(order)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-purple-400 text-xs">{order.orderNumber}</p>
                          <p className="text-[var(--odin-text-primary)] text-sm">{order.customer.name}</p>
                        </div>
                        <LucideIcons.Eye className="w-4 h-4 text-[var(--odin-text-secondary)]" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}