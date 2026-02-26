import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Mail, Phone, X, Save, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'cashier' | 'supervisor' | 'technician';
  status: 'active' | 'inactive';
  lastLogin: string;
  salesCount: number;
}

const initialUsers: User[] = [
  { 
    id: 1, 
    name: 'Administrador Principal', 
    email: 'admin@odinpos.com', 
    phone: '+506 8888-8888',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-02-09 14:30',
    salesCount: 156
  },
  { 
    id: 2, 
    name: 'Usuario Cajero 1', 
    email: 'cajero1@odinpos.com', 
    phone: '+506 8777-7777',
    role: 'cashier',
    status: 'active',
    lastLogin: '2025-02-09 12:15',
    salesCount: 89
  },
  { 
    id: 3, 
    name: 'Usuario Cajero 2', 
    email: 'cajero2@odinpos.com', 
    phone: '+506 8666-6666',
    role: 'cashier',
    status: 'active',
    lastLogin: '2025-02-09 08:00',
    salesCount: 124
  },
  { 
    id: 4, 
    name: 'Supervisor Ventas', 
    email: 'supervisor@odinpos.com', 
    phone: '+506 8555-5555',
    role: 'supervisor',
    status: 'active',
    lastLogin: '2025-02-09 13:45',
    salesCount: 67
  },
  { 
    id: 5, 
    name: 'Técnico Soporte', 
    email: 'soporte@odinpos.com', 
    phone: '+506 8444-4444',
    role: 'technician',
    status: 'active',
    lastLogin: '2025-02-08 16:30',
    salesCount: 0
  },
  { 
    id: 6, 
    name: 'Usuario Inactivo', 
    email: 'inactivo@odinpos.com', 
    phone: '+506 8333-3333',
    role: 'cashier',
    status: 'inactive',
    lastLogin: '2025-01-15 10:00',
    salesCount: 45
  },
];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    status: 'active'
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const cashierUsers = users.filter(u => u.role === 'cashier').length;

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'cashier',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'cashier',
      status: 'active'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...editingUser, ...formData } as User : u
      ));
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData as Omit<User, 'id'>,
        lastLogin: 'Nunca',
        salesCount: 0
      };
      setUsers([...users, newUser]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'supervisor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cashier':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'technician':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'supervisor':
        return 'Supervisor';
      case 'cashier':
        return 'Cajero';
      case 'technician':
        return 'Técnico';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    return <Shield className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Usuarios y Técnicos</h1>
          <p className="text-[var(--odin-text-secondary)]">Gestión de usuarios del sistema</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Usuario
        </Button>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total Usuarios</p>
          <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{users.length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Usuarios Activos</p>
          <p className="text-2xl font-bold text-green-400">{activeUsers}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Administradores</p>
          <p className="text-2xl font-bold text-purple-400">{adminUsers}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Cajeros</p>
          <p className="text-2xl font-bold text-cyan-400">{cashierUsers}</p>
        </Card>
      </div>

      {/* Search bar */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--odin-text-secondary)]" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)]"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/30 bg-slate-800/50 text-slate-300 hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Users table */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--odin-border-accent)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Usuario</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Teléfono</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Rol</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Último Login</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Ventas</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Estado</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[var(--odin-border-accent)] hover:bg-purple-500/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-[var(--odin-text-primary)]">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{user.email}</td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{user.phone}</td>
                  <td className="p-4 text-center">
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleText(user.role)}
                    </Badge>
                  </td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{user.lastLogin}</td>
                  <td className="p-4 text-center font-semibold text-[var(--odin-text-primary)]">{user.salesCount}</td>
                  <td className="p-4 text-center">
                    <Badge className={user.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-indigo-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
            Mostrando {filteredUsers.length} de {users.length} usuarios
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

      {/* Modal para agregar/editar usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
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
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white"
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
              Nombre Completo
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
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
              placeholder="usuario@odinpos.com"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
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
              placeholder="+506 8888-8888"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rol
            </label>
            <select
              name="role"
              value={formData.role || 'cashier'}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="cashier">Cajero</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrador</option>
              <option value="technician">Técnico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status || 'active'}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}