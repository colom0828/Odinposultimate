'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { DeliveryBoardUnified } from '../../components/delivery/DeliveryBoardUnified';
import { AssignCourierModalSimple } from '../../components/delivery/AssignCourierModalSimple';
import { useOrdersStore } from '../../store/ordersStore';
import { DeliveryStatus, OrderType, KitchenStatus } from '../../types/orders.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export default function DeliveryPage() {
  // ✅ FIX: Obtener el array completo, no llamar a funciones
  const allOrders = useOrdersStore((state) => state.orders);
  const setDeliveryStatus = useOrdersStore((state) => state.setDeliveryStatus);
  const assignCourier = useOrdersStore((state) => state.assignCourier);
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);

  // Filtrar órdenes para delivery (solo DELIVERY con kitchenStatus === LISTA)
  const orders = useMemo(() => {
    return allOrders.filter(
      (order) =>
        order.type === OrderType.DELIVERY &&
        order.kitchenStatus === KitchenStatus.LISTA
    );
  }, [allOrders]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<{ id: string; orderNumber: string } | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Actualizar cada minuto para refrescar los tiempos
  useEffect(() => {
    const interval = setInterval(() => {
      // Forzar re-render
      window.dispatchEvent(new Event('storage'));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Contar órdenes por estado
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pendientes: orders.filter(o => o.deliveryStatus === DeliveryStatus.PENDIENTE_ASIGNAR).length,
      enRuta: orders.filter(o => o.deliveryStatus === DeliveryStatus.EN_RUTA).length,
      entregados: orders.filter(o => o.deliveryStatus === DeliveryStatus.ENTREGADO).length,
      revenue: orders
        .filter(o => o.deliveryStatus === DeliveryStatus.ENTREGADO)
        .reduce((sum, o) => sum + o.total, 0),
    };
  }, [orders]);

  // Abrir modal de asignar repartidor
  const handleAssignCourier = (orderId: string) => {
    setOrderToAssign(orderId);
    setShowAssignModal(true);
  };

  // Confirmar asignación de repartidor
  const handleConfirmAssign = (courierId: string, courierName: string) => {
    if (orderToAssign) {
      assignCourier(orderToAssign, courierId, courierName);
      
      // Cambiar a EN_RUTA automáticamente después de asignar
      setDeliveryStatus(orderToAssign, DeliveryStatus.EN_RUTA);
    }
    setOrderToAssign(null);
  };

  // Cancelar orden (mostrar diálogo)
  const handleCancelOrderRequest = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setOrderToCancel({ id: order.id, orderNumber: order.orderNumber });
      setShowCancelDialog(true);
    }
  };

  // Confirmar cancelación de orden
  const handleConfirmCancelOrder = () => {
    if (orderToCancel) {
      cancelOrder(orderToCancel.id, cancelReason || 'No especificada');
      setOrderToCancel(null);
      setCancelReason('');
    }
    setShowCancelDialog(false);
  };

  // Cerrar diálogo de cancelación
  const handleCloseCancelDialog = (isOpen: boolean) => {
    setShowCancelDialog(isOpen);
    if (!isOpen) {
      setCancelReason('');
      setOrderToCancel(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-[1920px] mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Delivery
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Gestión de pedidos a domicilio
            </p>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <LucideIcons.Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.pendientes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <LucideIcons.Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">En Ruta</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.enRuta}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <LucideIcons.Bike className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ingresos</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${stats.revenue.toFixed(0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <LucideIcons.DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tablero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DeliveryBoardUnified
            orders={orders}
            onStatusChange={setDeliveryStatus}
            onAssignCourier={handleAssignCourier}
            onCancelOrder={handleCancelOrderRequest}
          />
        </motion.div>
      </div>

      {/* Modal de asignar repartidor */}
      <AssignCourierModalSimple
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setOrderToAssign(null);
        }}
        onAssign={handleConfirmAssign}
        orderNumber={orders.find(o => o.id === orderToAssign)?.orderNumber || ''}
      />

      {/* Diálogo de cancelación de orden */}
      <AlertDialog open={showCancelDialog} onOpenChange={handleCloseCancelDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
              <LucideIcons.AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Cancelar Pedido {orderToCancel?.orderNumber}</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-slate-600 dark:text-slate-400">
                <p className="mb-4">¿Estás seguro de que deseas cancelar este pedido?</p>

                {/* Campo de texto para la razón de cancelación */}
                <div className="mt-4">
                  <label 
                    htmlFor="cancel-reason" 
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Razón de cancelación: <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="cancel-reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value.slice(0, 200))}
                    placeholder="Ej: Cliente canceló, error en el pedido, etc."
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {cancelReason.length}/200 caracteres
                  </p>
                </div>
                
                <p className="mt-4 font-semibold text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <LucideIcons.AlertCircle className="w-4 h-4" />
                  <span>Esta acción no se puede deshacer.</span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700">
              No, mantener pedido
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancelOrder}
              disabled={!cancelReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
            >
              Sí, cancelar pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}