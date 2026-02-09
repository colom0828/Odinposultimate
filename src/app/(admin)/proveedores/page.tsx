'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, Mail, Phone, MapPin, X, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  products: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

const initialSuppliers: Supplier[] = [
  { 
    id: 1, 
    name: 'TechSupply Costa Rica', 
    contact: 'Juan Pérez',
    email: 'contacto@techsupply.cr', 
    phone: '+506 2222-3333',
    city: 'San José',
    products: 45,
    lastOrder: '2025-02-05',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'ElectroMax Distribuidores', 
    contact: 'María Rojas',
    email: 'ventas@electromax.com', 
    phone: '+506 2444-5555',
    city: 'Heredia',
    products: 32,
    lastOrder: '2025-02-08',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Componentes del Valle', 
    contact: 'Carlos Méndez',
    email: 'info@componentesvalle.cr', 
    phone: '+506 2666-7777',
    city: 'Alajuela',
    products: 28,
    lastOrder: '2025-01-28',
    status: 'active'
  },
  { 
    id: 4, 
    name: 'ImportTech SA', 
    contact: 'Ana Castro',
    email: 'contacto@importtech.com', 
    phone: '+506 2888-9999',
    city: 'Cartago',
    products: 67,
    lastOrder: '2025-02-09',
    status: 'active'
  },
];

export default function ProveedoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    email: '',
    phone: '',
    city: '',
    products: 0,
    lastOrder: '',
    status: 'active'
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        city: '',
        products: 0,
        lastOrder: new Date().toISOString().split('T')[0],
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setFormData({
      name: '',
      contact: '',
      email: '',
      phone: '',
      city: '',
      products: 0,
      lastOrder: '',
      status: 'active'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'products' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id ? { ...formData, id: s.id } as Supplier : s
      ));
    } else {
      const newSupplier: Supplier = {
        id: Math.max(...suppliers.map(s => s.id)) + 1,
        ...formData as Omit<Supplier, 'id'>
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Proveedores</h1>
          <p className="text-slate-400">Gestión de proveedores y contactos</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Total Proveedores</p>
          <p className="text-2xl font-bold text-white">{suppliers.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/20 border-green-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Proveedores Activos</p>
          <p className="text-2xl font-bold text-green-400">{suppliers.filter(s => s.status === 'active').length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/20 border-blue-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Total Productos</p>
          <p className="text-2xl font-bold text-blue-400">{suppliers.reduce((sum, s) => sum + s.products, 0)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/20 border-orange-500/20 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-400 mb-1">Órdenes Este Mes</p>
          <p className="text-2xl font-bold text-orange-400">12</p>
        </Card>
      </div>

      {/* Search bar */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>
          <Button variant="outline" className="border-purple-500/30 text-slate-300 hover:bg-purple-500/10">
            Filtros
          </Button>
        </div>
      </Card>

      {/* Suppliers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{supplier.name}</h3>
                  <p className="text-sm text-slate-400">{supplier.contact}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleOpenModal(supplier)}
                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(supplier.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{supplier.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{supplier.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{supplier.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Productos</p>
                <p className="font-semibold text-white">{supplier.products}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Última Orden</p>
                <p className="font-semibold text-white">{supplier.lastOrder}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal para agregar/editar proveedor */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
              Nombre del Proveedor
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Ej: TechSupply Costa Rica"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Persona de Contacto
            </label>
            <Input
              type="text"
              name="contact"
              value={formData.contact || ''}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="contacto@empresa.com"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Teléfono
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="+506 2222-3333"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ciudad
            </label>
            <Input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              placeholder="Ej: San José"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status || 'active'}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-purple-500/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}