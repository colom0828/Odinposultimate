'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Download, Filter, X, Save, Eye } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Órdenes de Compra</h1>
          <p className="text-slate-400">Gestión de órdenes a proveedores</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Total Órdenes</p>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-yellow-900/20 border-yellow-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{orders.filter(o => o.status === 'pending').length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/20 border-blue-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Aprobadas</p>
          <p className="text-2xl font-bold text-blue-400">{orders.filter(o => o.status === 'approved').length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/20 border-green-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Entregadas</p>
          <p className="text-2xl font-bold text-green-400">{orders.filter(o => o.status === 'delivered').length}</p>
        </Card>
      </div>

      {/* Search and filters */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por ID o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>
          <Button variant="outline" className="border-purple-500/30 text-slate-300 hover:bg-purple-500/10">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="border-purple-500/30 text-slate-300 hover:bg-purple-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Orders table */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="text-left p-4 text-sm font-semibold text-slate-300">ID Orden</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Proveedor</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Fecha</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Items</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-300">Total</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Entrega</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Estado</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-medium text-purple-400">{order.id}</span>
                  </td>
                  <td className="p-4 text-white font-medium">{order.supplier}</td>
                  <td className="p-4 text-slate-400">{order.date}</td>
                  <td className="p-4 text-center text-slate-300">{order.items}</td>
                  <td className="p-4 text-right font-semibold text-white">{formatCurrency(order.total)}</td>
                  <td className="p-4 text-slate-400">{order.delivery}</td>
                  <td className="p-4 text-center">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(order)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
        <div className="p-4 border-t border-purple-500/20 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-purple-500/30 text-slate-300">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="border-purple-500/30 text-slate-300">
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

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
              className="border-purple-500/30 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
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
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Proveedor
            </label>
            <Input
              type="text"
              name="supplier"
              value={formData.supplier || ''}
              onChange={handleInputChange}
              placeholder="Ej: TechSupply Costa Rica"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fecha de Orden
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date || ''}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fecha de Entrega
              </label>
              <Input
                type="date"
                name="delivery"
                value={formData.delivery || ''}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cantidad de Items
              </label>
              <Input
                type="number"
                name="items"
                value={formData.items || ''}
                onChange={handleInputChange}
                placeholder="0"
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total (₡)
              </label>
              <Input
                type="number"
                name="total"
                value={formData.total || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status || 'pending'}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-purple-500/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="delivered">Entregada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Descripción de la orden de compra..."
              rows={3}
              className="w-full bg-slate-800/50 border border-purple-500/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500"
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
            className="border-purple-500/30 text-slate-300 hover:bg-purple-500/10"
          >
            Cerrar
          </Button>
        }
      >
        {viewingOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">ID de Orden</p>
                <p className="text-white font-mono font-semibold">{viewingOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Estado</p>
                <Badge className={getStatusColor(viewingOrder.status)}>
                  {getStatusText(viewingOrder.status)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Proveedor</p>
              <p className="text-white font-medium">{viewingOrder.supplier}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Fecha de Orden</p>
                <p className="text-white">{viewingOrder.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Fecha de Entrega</p>
                <p className="text-white">{viewingOrder.delivery}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Cantidad de Items</p>
                <p className="text-white font-semibold">{viewingOrder.items}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Total</p>
                <p className="text-white font-bold text-lg">{formatCurrency(viewingOrder.total)}</p>
              </div>
            </div>

            {viewingOrder.description && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Descripción</p>
                <p className="text-white bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
                  {viewingOrder.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}