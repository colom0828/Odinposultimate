'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Order, ORDER_TYPE_CONFIG } from '../../types/orders.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface DeliveredOrdersPanelUnifiedProps {
  orders: Order[];
  onDeleteOrder: (orderId: string) => void;
}

export function DeliveredOrdersPanelUnified({ 
  orders, 
  onDeleteOrder
}: DeliveredOrdersPanelUnifiedProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      onDeleteOrder(orderToDelete);
      setOrderToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  // Formatear tiempo de entrega
  const getDeliveryTime = (order: Order) => {
    if (!order.kitchenReadyAt) return 'N/A';
    const time = new Date(order.kitchenReadyAt);
    return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Calcular tiempo total de preparación
  const getTotalTime = (order: Order) => {
    if (!order.kitchenReadyAt) return 'N/A';
    const created = new Date(order.createdAt);
    const ready = new Date(order.kitchenReadyAt);
    const diff = ready.getTime() - created.getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min`;
  };

  return (
    <div className="mt-12">
      {/* Header del panel */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between p-6 bg-secondary rounded-2xl border border-border cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <LucideIcons.Archive className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Historial de Entregadas
              </h2>
              <p className="text-sm text-muted-foreground">
                {orders.length} {orders.length === 1 ? 'orden entregada' : 'órdenes entregadas'}
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <LucideIcons.ChevronDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Lista de órdenes entregadas */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
                <LucideIcons.PackageCheck className="w-16 h-16 text-slate-400 mb-4" />
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  No hay órdenes entregadas
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orders.map((order) => {
                  const typeConfig = ORDER_TYPE_CONFIG[order.type];
                  const TypeIcon = LucideIcons[typeConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {order.orderNumber}
                          </h3>
                          <div className="flex items-center space-x-1.5 mt-1">
                            <TypeIcon className={`w-3.5 h-3.5 ${typeConfig.color}`} />
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {order.type === 'MESA' && order.tableNumber 
                                ? `Mesa ${order.tableNumber}` 
                                : typeConfig.label}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteClick(order.id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Info de tiempo */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Entregada:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {getDeliveryTime(order)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Tiempo total:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {getTotalTime(order)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                          Items:
                        </p>
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-semibold">{item.qty}x</span> {item.name}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                              +{order.items.length - 3} más...
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Badge de completado */}
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400">
                          <LucideIcons.CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Completada</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog de confirmación - Eliminar una orden */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">
              ¿Eliminar orden?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              Esta acción no se puede deshacer. La orden será eliminada permanentemente del historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}