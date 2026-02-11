'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Mail, Phone, X, Save, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'cashier' | 'supervisor' | 'inventory';
  status: 'active' | 'inactive';
  lastLogin: string;
  salesCount: number;
}

const initialEmployees: Employee[] = [
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
    name: 'Cajero Principal', 
    email: 'cajero1@odinpos.com', 
    phone: '+506 8777-7777',
    role: 'cashier',
    status: 'active',
    lastLogin: '2025-02-09 12:15',
    salesCount: 89
  },
  { 
    id: 3, 
    name: 'Cajero Secundario', 
    email: 'cajero2@odinpos.com', 
    phone: '+506 8666-6666',
    role: 'cashier',
    status: 'active',
    lastLogin: '2025-02-09 08:00',
    salesCount: 124
  },
  { 
    id: 4, 
    name: 'Supervisor de Ventas', 
    email: 'supervisor@odinpos.com', 
    phone: '+506 8555-5555',
    role: 'supervisor',
    status: 'active',
    lastLogin: '2025-02-09 13:45',
    salesCount: 67
  },
  { 
    id: 5, 
    name: 'Encargado de Inventario', 
    email: 'inventario@odinpos.com', 
    phone: '+506 8444-4444',
    role: 'inventory',
    status: 'active',
    lastLogin: '2025-02-09 10:30',
    salesCount: 0
  },
];

export default function EmpleadosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    status: 'active'
  });

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const adminEmployees = employees.filter(e => e.role === 'admin').length;
  const cashierEmployees = employees.filter(e => e.role === 'cashier').length;

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData(employee);
    } else {
      setEditingEmployee(null);
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
    setEditingEmployee(null);
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
    if (editingEmployee) {
      setEmployees(employees.map(e => 
        e.id === editingEmployee.id ? { ...editingEmployee, ...formData } as Employee : e
      ));
    } else {
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...formData as Omit<Employee, 'id'>,
        lastLogin: 'Nunca',
        salesCount: 0
      };
      setEmployees([...employees, newEmployee]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      setEmployees(employees.filter(e => e.id !== id));
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
      case 'inventory':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
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
      case 'inventory':
        return 'Inventario';
      default:
        return role;
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
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Empleados</h1>
          <p className="text-[var(--odin-text-secondary)]">Gestión de empleados del sistema</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Empleado
        </Button>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total Empleados</p>
          <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{employees.length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-green-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Empleados Activos</p>
          <p className="text-2xl font-bold text-green-400">{activeEmployees}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-purple-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Administradores</p>
          <p className="text-2xl font-bold text-purple-400">{adminEmployees}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-green-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Cajeros</p>
          <p className="text-2xl font-bold text-green-400">{cashierEmployees}</p>
        </Card>
      </div>

      {/* Search bar */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-colors duration-300">
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
          <Button 
            variant="outline" 
            className="border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 transition-all"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Employees table */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--odin-border-accent)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Empleado</th>
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
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-[var(--odin-border-accent)] hover:bg-purple-500/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-[var(--odin-text-primary)]">{employee.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{employee.email}</td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{employee.phone}</td>
                  <td className="p-4 text-center">
                    <Badge className={getRoleColor(employee.role)}>
                      {getRoleText(employee.role)}
                    </Badge>
                  </td>
                  <td className="p-4 text-[var(--odin-text-secondary)]">{employee.lastLogin}</td>
                  <td className="p-4 text-center font-semibold text-[var(--odin-text-primary)]">{employee.salesCount}</td>
                  <td className="p-4 text-center">
                    <Badge className={employee.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(employee)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(employee.id)}
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
            Mostrando {filteredEmployees.length} de {employees.length} empleados
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

      {/* Modal para agregar/editar empleado */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
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
              Nombre Completo
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="empleado@odinpos.com"
              className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Teléfono
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="+506 8888-8888"
              className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Rol
            </label>
            <select
              name="role"
              value={formData.role || 'cashier'}
              onChange={handleInputChange}
              className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="cashier">Cajero</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrador</option>
              <option value="inventory">Inventario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--odin-text-primary)] mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status || 'active'}
              onChange={handleInputChange}
              className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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