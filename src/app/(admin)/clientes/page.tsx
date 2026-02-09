'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, X, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { formatCurrency } from '../../utils/formatters';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalPurchases: number;
  visits: number;
  status: 'active' | 'vip' | 'inactive';
}

const initialClients: Client[] = [
  { 
    id: 1, 
    name: 'María González', 
    email: 'maria.gonzalez@email.com', 
    phone: '+506 8888-8888',
    city: 'San José',
    totalPurchases: 12450,
    visits: 24,
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Carlos Ruiz', 
    email: 'carlos.ruiz@email.com', 
    phone: '+506 8777-7777',
    city: 'Heredia',
    totalPurchases: 8900,
    visits: 18,
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Ana Martínez', 
    email: 'ana.martinez@email.com', 
    phone: '+506 8666-6666',
    city: 'Alajuela',
    totalPurchases: 15200,
    visits: 32,
    status: 'vip'
  },
  { 
    id: 4, 
    name: 'Luis Fernández', 
    email: 'luis.fernandez@email.com', 
    phone: '+506 8555-5555',
    city: 'Cartago',
    totalPurchases: 5600,
    visits: 12,
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Sofia López', 
    email: 'sofia.lopez@email.com', 
    phone: '+506 8444-4444',
    city: 'San José',
    totalPurchases: 22800,
    visits: 45,
    status: 'vip'
  },
  { 
    id: 6, 
    name: 'Diego Ramírez', 
    email: 'diego.ramirez@email.com', 
    phone: '+506 8333-3333',
    city: 'Guanacaste',
    totalPurchases: 980,
    visits: 3,
    status: 'inactive'
  },
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    city: '',
    totalPurchases: 0,
    visits: 0,
    status: 'active',
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active' || c.status === 'vip').length;
  const vipClients = clients.filter(c => c.status === 'vip').length;

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

  const handleOpenModal = (client?: Client) => {
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
        totalPurchases: 0,
        visits: 0,
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
      totalPurchases: 0,
      visits: 0,
      status: 'active',
    });
  };

  const handleSave = () => {
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id ? { ...formData, id: c.id } as Client : c
      ));
    } else {
      const newClient: Client = {
        ...formData,
        id: Math.max(...clients.map(c => c.id)) + 1,
      } as Client;
      setClients([...clients, newClient]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const handleInputChange = (field: keyof Client, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-slate-400">Gestión de clientes y contactos</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Total Clientes</p>
          <p className="text-2xl font-bold text-white">{totalClients}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/20 border-green-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Clientes Activos</p>
          <p className="text-2xl font-bold text-green-400">{activeClients}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Clientes VIP</p>
          <p className="text-2xl font-bold text-purple-400">{vipClients}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/20 border-blue-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Nuevos Este Mes</p>
          <p className="text-2xl font-bold text-blue-400">8</p>
        </Card>
      </div>

      {/* Search bar */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Clients grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{client.name}</h3>
                  <Badge className={getStatusColor(client.status)}>
                    {getStatusText(client.status)}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleOpenModal(client)}
                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{client.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{client.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{client.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Compras</p>
                <p className="font-semibold text-white">{formatCurrency(client.totalPurchases)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Visitas</p>
                <p className="font-semibold text-white">{client.visits}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Mostrando {filteredClients.length} de {clients.length} clientes
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
    </div>
  );
}