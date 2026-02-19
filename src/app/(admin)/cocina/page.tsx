'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ChefHat,
  Utensils,
  Bike,
  Bell,
  CheckCircle,
  LayoutGrid,
  Flame,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { KitchenBoardUnified } from '../../components/cocina/KitchenBoardUnified';
import { DeliveredOrdersPanelUnified } from '../../components/cocina/DeliveredOrdersPanelUnified';
import { ConnectionStatus } from '../../components/cocina/ConnectionStatus';
import { useOrdersStore, createMockDeliveryOrder, createMockMesaOrder } from '../../store/ordersStore';
import { KitchenStatus, DeliveryStatus } from '../../types/orders.types';
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

// Filtros disponibles
type FilterType = 'TODAS' | 'NUEVA' | 'PREPARANDO';

export default function CocinaPage() {
  // ✅ FIX: Estado para hidratación del store
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);

  // ✅ FIX: Obtener el array completo, no llamar a funciones
  const allOrders = useOrdersStore((state) => state.orders);
  const setKitchenStatus = useOrdersStore((state) => state.setKitchenStatus);
  const markAsDelivered = useOrdersStore((state) => state.markAsDelivered);
  const sendToDelivery = useOrdersStore((state) => state.sendToDelivery);
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);
  const deleteOrder = useOrdersStore((state) => state.deleteOrder);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<{ id: string; orderNumber: string } | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('TODAS');

  // Debug: verificar que el componente se monte correctamente + hidratar store
  useEffect(() => {
    console.log('✅ CocinaPage mounted successfully');
    console.log('📊 Orders count:', allOrders?.length ?? 0);
    console.log('🌐 Current URL:', window.location.href);
    console.log('📍 Pathname:', window.location.pathname);
    
    // ✅ FIX: Hidratar store de localStorage manualmente en el cliente
    if (typeof window !== 'undefined') {
      // Forzar re-hidratación del store de Zustand
      const storedData = localStorage.getItem('odin-orders-storage');
      if (storedData) {
        console.log('💾 Hydrating orders from localStorage');
      }
      setIsStoreHydrated(true);
    }
    
    return () => {
      console.log('❌ CocinaPage unmounted');
    };
  }, []);

  // Filtrar órdenes para cocina (todas las órdenes activas excepto ENTREGADA y canceladas)
  const orders = useMemo(() => {
    return allOrders.filter((order) => {
      // No mostrar órdenes canceladas
      if (order.canceledAt) return false;
      
      // No mostrar órdenes entregadas
      if (order.kitchenStatus === KitchenStatus.ENTREGADA) return false;
      
      // Mostrar NUEVA, PREPARANDO y LISTA
      return true;
    });
  }, [allOrders]);

  // Órdenes entregadas (LISTA)
  const deliveredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      return order.kitchenStatus === KitchenStatus.LISTA && !order.canceledAt;
    });
  }, [allOrders]);

  // Aplicar filtro seleccionado
  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'TODAS') return orders;
    return orders.filter(o => o.kitchenStatus === selectedFilter);
  }, [orders, selectedFilter]);

  // Contar órdenes por estado
  const stats = useMemo(() => {
    return {
      total: orders.length,
      nuevas: orders.filter(o => o.kitchenStatus === KitchenStatus.NUEVA).length,
      preparando: orders.filter(o => o.kitchenStatus === KitchenStatus.PREPARANDO).length,
      completadas: deliveredOrders.length,
    };
  }, [orders, deliveredOrders]);

  // Manejar solicitud de cancelación
  const handleCancelOrderRequest = (orderId: string) => {
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
      setOrderToCancel({ id: order.id, orderNumber: order.orderNumber });
      setShowCancelDialog(true);
    }
  };

  // Confirmar cancelación
  const handleConfirmCancelOrder = () => {
    if (orderToCancel && cancelReason.trim()) {
      cancelOrder(orderToCancel.id, cancelReason);
      setOrderToCancel(null);
      setCancelReason('');
      setShowCancelDialog(false);
      toast.success(`Orden ${orderToCancel.orderNumber} cancelada con éxito.`);
    }
  };

  // Cerrar diálogo de cancelación
  const handleCloseCancelDialog = (isOpen: boolean) => {
    setShowCancelDialog(isOpen);
    if (!isOpen) {
      setCancelReason('');
      setOrderToCancel(null);
    }
  };

  // Eliminar una orden del historial
  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    toast.success(`Orden eliminada del historial.`);
  };

  // Wrapper para enviar a delivery con toast
  const handleSendToDelivery = (orderId: string) => {
    const order = allOrders.find(o => o.id === orderId);
    sendToDelivery(orderId);
    
    // Toast con feedback
    toast.success(
      <div className="flex items-center space-x-2">
        <Bike className="w-4 h-4" />
        <div>
          <p className="font-semibold">Orden {order?.orderNumber} enviada a Delivery</p>
          <p className="text-xs text-slate-400">Marcada como entregada y lista para repartidor</p>
        </div>
      </div>,
      {
        duration: 3000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto p-6 space-y-6">
        {/* Header con Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            {/* Logo de Cocina */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/50">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            
            {/* Título */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Cocina
              </h1>
              <p className="text-muted-foreground text-sm">
                Kitchen Display System - Órdenes en preparación
              </p>
            </div>
          </div>

          {/* Botones de Simulación y Estado de Conexión */}
          <div className="flex items-center space-x-3">
            {/* Indicador de Conexión */}
            <ConnectionStatus apiUrl={process.env.NEXT_PUBLIC_API_URL} />
            
            <button
              onClick={createMockMesaOrder}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50 font-semibold transition-all"
            >
              <Utensils className="w-5 h-5" />
              <span>Simular Mesa</span>
            </button>

            <button
              onClick={createMockDeliveryOrder}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:shadow-lg hover:shadow-orange-500/50 font-semibold transition-all"
            >
              <Bike className="w-5 h-5" />
              <span>Simular Delivery</span>
            </button>
          </div>
        </motion.div>

        {/* Estadísticas con Gradientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* Nuevas - Gradiente Morado */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-2">Nuevas</p>
                <p className="text-5xl font-bold text-white">{stats.nuevas}</p>
              </div>
              <Bell className="w-12 h-12 text-purple-200/50" />
            </div>
          </div>

          {/* En Preparación - Gradiente Naranja */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-2">En Preparación</p>
                <p className="text-5xl font-bold text-white">{stats.preparando}</p>
              </div>
              <Flame className="w-12 h-12 text-orange-200/50" />
            </div>
          </div>

          {/* Completadas Hoy - Gradiente Verde */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Completadas Hoy</p>
                <p className="text-5xl font-bold text-white">{stats.completadas}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200/50" />
            </div>
          </div>

          {/* Total Activas - Gradiente Gris */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-6 shadow-xl border border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-2">Total Activas</p>
                <p className="text-5xl font-bold text-white">{stats.total}</p>
              </div>
              <LayoutGrid className="w-12 h-12 text-slate-500/50" />
            </div>
          </div>
        </motion.div>

        {/* Filtros como Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center space-x-3"
        >
          <button
            onClick={() => setSelectedFilter('TODAS')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              selectedFilter === 'TODAS'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Todas</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-600 dark:bg-slate-600 text-white text-xs font-bold">
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('NUEVA')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              selectedFilter === 'NUEVA'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Nueva</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">
              {stats.nuevas}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('PREPARANDO')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              selectedFilter === 'PREPARANDO'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>En Preparación</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-600 text-white text-xs font-bold">
              {stats.preparando}
            </span>
          </button>
        </motion.div>

        {/* Tablero de Órdenes (incluye NUEVA, PREPARANDO y LISTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <KitchenBoardUnified
            orders={filteredOrders}
            onStatusChange={setKitchenStatus}
            onMarkAsDelivered={markAsDelivered}
            onSendToDelivery={handleSendToDelivery}
            onCancelOrder={handleCancelOrderRequest}
          />
        </motion.div>

        {/* Historial de Órdenes Entregadas (ENTREGADA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <DeliveredOrdersPanelUnified
            orders={allOrders.filter(o => o.kitchenStatus === KitchenStatus.ENTREGADA && !o.canceledAt)}
            onDeleteOrder={handleDeleteOrder}
          />
        </motion.div>
      </div>

      {/* Diálogo de Cancelación */}
      <AlertDialog open={showCancelDialog} onOpenChange={handleCloseCancelDialog}>
        <AlertDialogContent className="max-w-lg bg-slate-900 border border-slate-700">
          <AlertDialogHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <AlertDialogTitle className="text-xl text-white">
                Cancelar Orden #{orderToCancel?.orderNumber}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-400 mt-2">
              ¿Estás seguro de que deseas cancelar esta orden?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Información de la Orden */}
          {orderToCancel && (() => {
            const order = allOrders.find(o => o.id === orderToCancel.id);
            if (!order) return null;
            
            return (
              <div className="space-y-4 py-4">
                {/* Detalles de la orden */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Orden:</p>
                    <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tipo:</p>
                    <p className="text-sm font-semibold text-white">
                      {order.type === 'MESA' ? `Mesa ${order.tableNumber}` : 
                       order.type === 'DELIVERY' ? 'Delivery' : 
                       order.type === 'PARA_LLEVAR' ? 'Para Llevar' : order.type}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Ítems:</p>
                    <p className="text-sm font-semibold text-white">{order.items.length}</p>
                  </div>
                </div>

                {/* Razón de cancelación */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                    Razón de cancelación: 
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Ej: Cliente cambió de opinión, error en el pedido, etc."
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-24"
                    maxLength={200}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">
                      {cancelReason.length}/200 caracteres
                    </p>
                    {!cancelReason.trim() && (
                      <div className="flex items-center space-x-1 text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        <p className="text-xs font-medium">Esta acción no se puede deshacer.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700">
              No, mantener orden
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancelOrder}
              disabled={!cancelReason.trim()}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sí, cancelar orden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}