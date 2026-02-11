'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Download, Filter, X, Save, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { formatCurrency } from '../../utils/formatters';

interface Order {
  id: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  delivery: string;
  description?: string;
}

const initialOrders: Order[] = [
  { 
    id: 'OC-001', 
    supplier: 'TechSupply Costa Rica', 
    date: '2025-02-09',
    items: 15,
    total: 12500,
    status: 'pending',
    delivery: '2025-02-15',
    description: 'Componentes electrónicos varios'
  },
  { 
    id: 'OC-002', 
    supplier: 'ElectroMax Distribuidores', 
    date: '2025-02-08',
    items: 8,
    total: 5600,
    status: 'approved',
    delivery: '2025-02-12',
    description: 'Laptops y accesorios'
  },
  { 
    id: 'OC-003', 
    supplier: 'Componentes del Valle', 
    date: '2025-02-07',
    items: 22,
    total: 18900,
    status: 'delivered',
    delivery: '2025-02-09',
    description: 'Stock mensual de periféricos'
  },
  { 
    id: 'OC-004', 
    supplier: 'ImportTech SA', 
    date: '2025-02-05',
    items: 10,
    total: 8200,
    status: 'cancelled',
    delivery: '-',
    description: 'Orden cancelada por el proveedor'
  },
];

export default function OrdenesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Partial<Order>>({
    supplier: '',
    date: '',
    items: 0,
    total: 0,
    status: 'pending',
    delivery: '',
    description: ''
  });

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setFormData(order);
    } else {
      setEditingOrder(null);
      const nextId = `OC-${String(orders.length + 1).padStart(3, '0')}`;
      setFormData({
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        items: 0,
        total: 0,
        status: 'pending',
        delivery: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({
      supplier: '',
      date: '',
      items: 0,
      total: 0,
      status: 'pending',
      delivery: '',
      description: ''
    });
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingOrder(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'items' || name === 'total' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    if (editingOrder) {
      // Editar orden existente
      setOrders(orders.map(o => 
        o.id === editingOrder.id ? { ...formData, id: o.id } as Order : o
      ));
    } else {
      // Agregar nueva orden
      const nextId = `OC-${String(orders.length + 1).padStart(3, '0')}`;
      const newOrder: Order = {
        id: nextId,
        ...formData as Omit<Order, 'id'>
      };
      setOrders([...orders, newOrder]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta orden de compra?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exportando órdenes a CSV/PDF...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'approved':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Entregada';
      case 'approved':
        return 'Aprobada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Órdenes de Compra</h1>
          <p className="text-[var(--odin-text-secondary)]">Gestión de órdenes a proveedores</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Orden
        </Button>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total Órdenes</p>
          <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{orders.length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-yellow-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{orders.filter(o => o.status === 'pending').length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-blue-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Aprobadas</p>
          <p className="text-2xl font-bold text-blue-400">{orders.filter(o => o.status === 'approved').length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-green-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Entregadas</p>
          <p className="text-2xl font-bold text-green-400">{orders.filter(o => o.status === 'delivered').length}</p>
        </Card>
      </motion.div>

      {/* Search and filters */}
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
              placeholder="Buscar por ID o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
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
        </div>
      </Card>
      </motion.div>

      {/* Orders table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--odin-border-accent)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">ID Orden</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Proveedor</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Fecha</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Items</th>
                <th className="text-right p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Total</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Entrega</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Estado</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--odin-border-accent)] hover:bg-purple-500/5 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-medium text-purple-400">{order.id}</span>
                  </td>
                  <td className="p-4 text-[var(--odin-text-primary)] font-medium">{order.supplier}</td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{order.date}</td>
                  <td className="p-4 text-center text-[var(--odin-text-primary)]">{order.items}</td>
                  <td className="p-4 text-right font-semibold text-[var(--odin-text-primary)]">{formatCurrency(order.total)}</td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{order.delivery}</td>
                  <td className="p-4 text-center">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(order)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--odin-border-accent)] flex items-center justify-between">
          <p className="text-sm text-[var(--odin-text-secondary)]">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </p>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
            >
              Anterior
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
      </motion.div>

      {/* Modal para agregar/editar orden */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOrder ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
        footer={
          <>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-slate-700/50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Proveedor
            </label>
            <Input
              type="text"
              name="supplier"
              value={formData.supplier || ''}
              onChange={handleInputChange}
              placeholder="Ej: TechSupply Costa Rica"
              className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
                Fecha de Orden
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date || ''}
                onChange={handleInputChange}
                className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
                Fecha de Entrega
              </label>
              <Input
                type="date"
                name="delivery"
                value={formData.delivery || ''}
                onChange={handleInputChange}
                className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
                Cantidad de Items
              </label>
              <Input
                type="number"
                name="items"
                value={formData.items || ''}
                onChange={handleInputChange}
                placeholder="0"
                className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
                Total (₡)
              </label>
              <Input
                type="number"
                name="total"
                value={formData.total || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status || 'pending'}
              onChange={handleInputChange}
              className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="delivered">Entregada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Descripción de la orden de compra..."
              rows={3}
              className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-[var(--odin-text-secondary)]"
            />
          </div>
        </div>
      </Modal>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Detalles de Orden de Compra"
        footer={
          <Button
            variant="outline"
            onClick={handleCloseViewModal}
            className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10"
          >
            Cerrar
          </Button>
        }
      >
        {viewingOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">ID de Orden</p>
                <p className="text-[var(--odin-text-primary)] font-mono font-semibold">{viewingOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Estado</p>
                <Badge className={getStatusColor(viewingOrder.status)}>
                  {getStatusText(viewingOrder.status)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Proveedor</p>
              <p className="text-[var(--odin-text-primary)] font-medium">{viewingOrder.supplier}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Fecha de Orden</p>
                <p className="text-[var(--odin-text-primary)]">{viewingOrder.date}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Fecha de Entrega</p>
                <p className="text-[var(--odin-text-primary)]">{viewingOrder.delivery}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Cantidad de Items</p>
                <p className="text-[var(--odin-text-primary)] font-semibold">{viewingOrder.items}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total</p>
                <p className="text-[var(--odin-text-primary)] font-bold text-lg">{formatCurrency(viewingOrder.total)}</p>
              </div>
            </div>

            {viewingOrder.description && (
              <div>
                <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Descripción</p>
                <p className="text-[var(--odin-text-primary)] bg-[var(--odin-input-bg)] p-3 rounded-lg border border-[var(--odin-border-accent)]">
                  {viewingOrder.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}