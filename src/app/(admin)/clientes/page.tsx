import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, X, Save, ShoppingBag, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { formatCurrency } from '../../utils/formatters';
import { useCustomers, Customer } from '../../hooks/useCustomers';

export default function ClientesPage() {
  const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    city: '',
    status: 'active',
  });

  // Escuchar actualizaciones de ventas para recalcular estadísticas
  useEffect(() => {
    const handleSalesUpdate = () => {
      // El hook useCustomers automáticamente recalculará las estadísticas
    };
    window.addEventListener('sales-updated', handleSalesUpdate);
    return () => window.removeEventListener('sales-updated', handleSalesUpdate);
  }, []);

  const filteredClients = customers.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClients = customers.length;
  const activeClients = customers.filter(c => c.status === 'active' || c.status === 'vip').length;
  const vipClients = customers.filter(c => c.status === 'vip').length;
  
  // Calcular nuevos clientes este mes (clientes sin compras o con primera compra este mes)
  const getNewCustomersThisMonth = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return customers.filter(c => {
      if (!c.lastPurchase) return true; // Sin compras = nuevo
      const lastPurchaseDate = new Date(c.lastPurchase);
      return lastPurchaseDate >= firstDayOfMonth;
    }).length;
  };
  const newCustomersThisMonth = getNewCustomersThisMonth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'vip':
        return 'VIP';
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return status;
    }
  };

  const handleOpenModal = (client?: Customer) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      status: 'active',
    });
  };

  const handleSave = () => {
    if (editingClient) {
      updateCustomer(editingClient.id, formData as Customer);
    } else {
      addCustomer(formData as Customer);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      deleteCustomer(id);
    }
  };

  const handleInputChange = (field: keyof Customer, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--odin-text-secondary)]">Cargando clientes...</p>
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
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Clientes</h1>
          <p className="text-[var(--odin-text-secondary)]">Gestión de base de datos de clientes</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </Button>
        </motion.div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total Clientes</p>
          <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{totalClients}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Clientes Activos</p>
          <p className="text-2xl font-bold text-green-400">{activeClients}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Clientes VIP</p>
          <p className="text-2xl font-bold text-purple-400">{vipClients}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Nuevos Este Mes</p>
          <p className="text-2xl font-bold text-blue-400">{newCustomersThisMonth}</p>
        </Card>
      </div>

      {/* Search bar */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-all duration-300 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--odin-text-secondary)]" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Clients grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all shadow-lg hover:shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--odin-text-primary)]">{client.name}</h3>
                  <Badge className={getStatusColor(client.status)}>
                    {getStatusText(client.status)}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleOpenModal(client)}
                  className="p-2 text-[var(--odin-text-secondary)] hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="p-2 text-[var(--odin-text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-[var(--odin-text-secondary)]" />
                <span className="text-[var(--odin-text-secondary)]">{client.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-[var(--odin-text-secondary)]" />
                <span className="text-[var(--odin-text-secondary)]">{client.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-[var(--odin-text-secondary)]" />
                <span className="text-[var(--odin-text-secondary)]">{client.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Total Compras</p>
                <p className="font-semibold text-[var(--odin-text-primary)]">{formatCurrency(client.totalPurchases)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Visitas</p>
                <p className="font-semibold text-[var(--odin-text-primary)]">{client.visits}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--odin-text-secondary)]">
          Mostrando {filteredClients.length} de {customers.length} clientes
        </p>
      </div>

      {/* Modal para agregar/editar cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: María González"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="cliente@email.com"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+506 8888-8888"
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ciudad</label>
              <Input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="San José"
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="active">Activo</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}