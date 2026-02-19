'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Plus, Search, Filter, Download, RefreshCw, Loader } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useConfig } from '../../contexts/ConfigContext';
import { getCurrentUser } from '../../utils/auth';
import {
  ServiceOrder,
  ServiceOrderStatus,
  ServicePriority,
  ApprovalStatus,
  SyncStatus,
} from '../../types/serviceOrders.types';
import { serviceOrdersService } from '../../services/serviceOrdersService';
import { ServiceOrderKanban } from '../../components/serviceOrders/ServiceOrderKanban';
import { ServiceOrderDetailDrawer } from '../../components/serviceOrders/ServiceOrderDetailDrawer';
import { NewServiceOrderModal } from '../../components/serviceOrders/NewServiceOrderModal';
import { EditServiceOrderModal } from '../../components/serviceOrders/EditServiceOrderModal';
import { AssignTechnicianModal } from '../../components/serviceOrders/AssignTechnicianModal';
import { toast } from 'sonner';

export default function OrdenesServicioPage() {
  const { config } = useConfig();
  const currentUser = getCurrentUser();
  const businessType = config?.businessType || 'tech_service';

  // Estado
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [technicians, setTechnicians] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAssignTechnicianModalOpen, setIsAssignTechnicianModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [orderToAssign, setOrderToAssign] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, techniciansData] = await Promise.all([
        serviceOrdersService.getAll(),
        serviceOrdersService.getTechnicians(),
      ]);
      setOrders(ordersData);
      setTechnicians(techniciansData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    const term = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.phone.toLowerCase().includes(term) ||
        order.equipment.brand.toLowerCase().includes(term) ||
        order.equipment.model.toLowerCase().includes(term) ||
        (order.equipment.serial && order.equipment.serial.toLowerCase().includes(term))
    );
  }, [orders, searchTerm]);

  // KPIs calculados
  const kpis = useMemo(() => {
    return {
      abiertas: orders.filter(
        (o) => ![ServiceOrderStatus.ENTREGADO, ServiceOrderStatus.CANCELADO].includes(o.status)
      ).length,
      diagnostico: orders.filter((o) => o.status === ServiceOrderStatus.DIAGNOSTICO).length,
      reparacion: orders.filter((o) => o.status === ServiceOrderStatus.REPARACION).length,
      listas: orders.filter((o) => o.status === ServiceOrderStatus.LISTO).length,
      atrasadas: orders.filter((o) => o.isOverdue).length,
      tecnicosActivos: new Set(
        orders
          .filter((o) => o.assignedTechnician)
          .map((o) => o.assignedTechnician!.id)
      ).size,
    };
  }, [orders]);

  // Handlers
  const handleViewDetails = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsDetailDrawerOpen(true);
  };

  const handleChangeStatus = async (orderId: string, newStatus: ServiceOrderStatus) => {
    try {
      const userName = currentUser?.nombre || 'Usuario';
      const updatedOrder = await serviceOrdersService.changeStatus(orderId, newStatus, userName);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      toast.success(`Estado actualizado a ${newStatus}`);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Error al cambiar el estado');
    }
  };

  const handleAssignTechnician = (orderId: string) => {
    setOrderToAssign(orderId);
    setIsAssignTechnicianModalOpen(true);
  };

  const handleConfirmAssignTechnician = async (technicianId: string, technicianName: string) => {
    if (!orderToAssign) return;

    try {
      const userName = currentUser?.nombre || 'Admin';
      const updatedOrder = await serviceOrdersService.assignTechnician(
        orderToAssign,
        technicianId,
        technicianName,
        userName
      );
      setOrders(orders.map((o) => (o.id === orderToAssign ? updatedOrder : o)));
      toast.success(`Técnico ${technicianName} asignado correctamente`);
      setOrderToAssign(null);
    } catch (error) {
      console.error('Error assigning technician:', error);
      toast.error('Error al asignar técnico');
    }
  };

  const handleCreateOrder = async (orderData: Partial<ServiceOrder>) => {
    try {
      const newOrder = await serviceOrdersService.create(orderData);
      setOrders([newOrder, ...orders]);
      toast.success(`Orden ${newOrder.orderNumber} creada exitosamente`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al crear la orden');
    }
  };

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
    setIsDetailDrawerOpen(false);
  };

  const handleSaveEditOrder = async (orderId: string, orderData: Partial<ServiceOrder>) => {
    try {
      const updatedOrder = await serviceOrdersService.update(orderId, orderData);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      
      // Actualizar selectedOrder si está abierto el drawer
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      
      toast.success('Orden actualizada exitosamente');
      setIsEditOrderModalOpen(false);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar la orden');
    }
  };

  const handleUpdateApproval = async (
    orderId: string,
    status: ApprovalStatus,
    note: string
  ) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const updatedOrder = await serviceOrdersService.update(orderId, {
        approval: {
          status,
          note: note || undefined,
          approvedAt: status !== ApprovalStatus.PENDIENTE ? new Date().toISOString() : undefined,
        },
      });

      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      toast.success(
        status === ApprovalStatus.APROBADO
          ? 'Orden aprobada'
          : status === ApprovalStatus.RECHAZADO
          ? 'Orden rechazada'
          : 'Estado de aprobación actualizado'
      );
    } catch (error) {
      console.error('Error updating approval:', error);
      toast.error('Error al actualizar aprobación');
    }
  };

  const handleCompleteTask = async (orderId: string, taskId: string) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const updatedTasks = order.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedBy: !task.completed ? currentUser?.nombre || 'Usuario' : undefined,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      );

      const updatedOrder = await serviceOrdersService.update(orderId, {
        tasks: updatedTasks,
      });

      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Error al actualizar tarea');
    }
  };

  const handleCloseOrder = async (orderId: string) => {
    try {
      const updatedOrder = await serviceOrdersService.update(orderId, {
        status: ServiceOrderStatus.ENTREGADO,
        deliveredAt: new Date().toISOString(),
      });

      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      toast.success('Orden marcada como entregada');
      setIsDetailDrawerOpen(false);
    } catch (error) {
      console.error('Error closing order:', error);
      toast.error('Error al cerrar la orden');
    }
  };

  const handleExport = () => {
    toast.info('Exportación en desarrollo');
  };

  // Indicador de conexión
  const connectionStatus = 'synced'; // Mock - en producción viene de API

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-[var(--odin-text-secondary)]">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header del módulo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">
            Órdenes de Servicio
          </h1>
          <p className="text-[var(--odin-text-secondary)]">
            Seguimiento y control de trabajos técnicos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Indicador de conexión discreto */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'synced' ? 'bg-green-400' : 'bg-orange-400'
              } animate-pulse`}
            />
            <span className="text-xs text-[var(--odin-text-secondary)]">
              {connectionStatus === 'synced' ? 'Conectado' : 'Sincronizando'}
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Orden
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <Card className="bg-[var(--odin-bg-card)] border-blue-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--odin-text-secondary)]">Abiertas</p>
            <LucideIcons.FolderOpen className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400">{kpis.abiertas}</p>
        </Card>

        <Card className="bg-[var(--odin-bg-card)] border-purple-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--odin-text-secondary)]">Diagnóstico</p>
            <LucideIcons.Search className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-400">{kpis.diagnostico}</p>
        </Card>

        <Card className="bg-[var(--odin-bg-card)] border-orange-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--odin-text-secondary)]">Reparacin</p>
            <LucideIcons.Wrench className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-orange-400">{kpis.reparacion}</p>
        </Card>

        <Card className="bg-[var(--odin-bg-card)] border-green-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--odin-text-secondary)]">Listas</p>
            <LucideIcons.CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{kpis.listas}</p>
        </Card>

        <Card className="bg-[var(--odin-bg-card)] border-red-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--odin-text-secondary)]">Atrasadas</p>
            <LucideIcons.AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{kpis.atrasadas}</p>
        </Card>

        <Card className="bg-[var(--odin-bg-card)] border-cyan-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--odin-text-secondary)]">Técnicos</p>
            <LucideIcons.Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-cyan-400">{kpis.tecnicosActivos}</p>
        </Card>
      </motion.div>

      {/* Buscador y filtros */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--odin-text-secondary)]" />
              <Input
                type="text"
                placeholder="Buscar por #orden, cliente, equipo, serial, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
              />
            </div>
            <Button
              variant="outline"
              className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
              onClick={() => toast.info('Filtros avanzados en desarrollo')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={loadData}
              variant="outline"
              size="icon"
              className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tablero Kanban */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <ServiceOrderKanban
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          onChangeStatus={handleChangeStatus}
          onAssignTechnician={handleAssignTechnician}
        />
      </motion.div>

      {/* Drawer de detalle */}
      <ServiceOrderDetailDrawer
        order={selectedOrder}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleChangeStatus}
        onUpdateApproval={handleUpdateApproval}
        onCompleteTask={handleCompleteTask}
        onCloseOrder={handleCloseOrder}
        onEdit={handleEditOrder}
      />

      {/* Modal nueva orden */}
      <NewServiceOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSave={handleCreateOrder}
        technicians={technicians}
      />

      {/* Modal asignar técnico */}
      <AssignTechnicianModal
        isOpen={isAssignTechnicianModalOpen}
        onClose={() => {
          setIsAssignTechnicianModalOpen(false);
          setOrderToAssign(null);
        }}
        technicians={technicians}
        onAssign={handleConfirmAssignTechnician}
        currentOrder={
          orderToAssign
            ? (() => {
                const order = orders.find((o) => o.id === orderToAssign);
                return order
                  ? {
                      orderNumber: order.orderNumber,
                      customerName: order.customer.name,
                      equipmentInfo: `${order.equipment.brand} ${order.equipment.model}`,
                    }
                  : undefined;
              })()
            : undefined
        }
      />

      {/* Modal editar orden */}
      <EditServiceOrderModal
        isOpen={isEditOrderModalOpen}
        onClose={() => setIsEditOrderModalOpen(false)}
        onSave={handleSaveEditOrder}
        order={selectedOrder}
        technicians={technicians}
      />
    </motion.div>
  );
}