import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Filter } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { useConfig } from '../../contexts/ConfigContext';
import { getEmployeesConfig, getRoleConfig, formatMetricValue } from '../../config/employeesConfig';
import { getEmployeesByBusinessType } from '../../data/employeesMockData';
import type { Employee } from '../../types/employee.types';

export default function EmpleadosPage() {
  const { config } = useConfig();
  const businessType = config?.businessType || 'restaurant';
  
  // Obtener configuración dinámica
  const employeesConfig = useMemo(() => getEmployeesConfig(businessType), [businessType]);
  
  // Estado
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(getEmployeesByBusinessType(businessType));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    role: employeesConfig?.defaultRole || 'empleado',
    status: 'active',
    businessType: businessType,
  });

  // Filtrado
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular KPIs dinámicamente
  const kpisData = useMemo(() => {
    if (!employeesConfig?.kpis) return [];
    return employeesConfig.kpis.map(kpi => ({
      ...kpi,
      value: kpi.calculateFrom(employees),
    }));
  }, [employees, employeesConfig]);

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
        role: employeesConfig?.defaultRole || 'empleado',
        status: 'active',
        businessType: businessType,
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
      role: employeesConfig?.defaultRole || 'empleado',
      status: 'active',
      businessType: businessType,
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
        id: `emp-${Date.now()}`,
        ...formData as Omit<Employee, 'id'>,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Nunca',
        businessType: businessType,
      };
      setEmployees([...employees, newEmployee]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const getRoleColor = (roleId: string) => {
    const role = getRoleConfig(businessType, roleId);
    if (!role) return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    
    const colorMap: Record<string, string> = {
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      slate: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    
    return colorMap[role.color] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getRoleLabel = (roleId: string) => {
    const role = getRoleConfig(businessType, roleId);
    return role?.label || roleId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'vacation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'suspended':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      vacation: 'Vacaciones',
      suspended: 'Suspendido',
    };
    return labels[status] || status;
  };

  const renderCellValue = (employee: Employee, column: any) => {
    const value = (employee as any)[column.key];
    
    if (column.key === 'actions') {
      return (
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
      );
    }

    if (column.key === 'name') {
      const roleConfig = getRoleConfig(businessType, employee.role);
      const IconComponent = roleConfig?.icon ? (LucideIcons as any)[roleConfig.icon] : LucideIcons.User;
      
      // Mapa de colores fijos para gradientes
      const gradientColorMap: Record<string, string> = {
        purple: 'bg-gradient-to-br from-purple-500 to-purple-700',
        indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
        blue: 'bg-gradient-to-br from-blue-500 to-blue-700',
        green: 'bg-gradient-to-br from-green-500 to-green-700',
        cyan: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
        orange: 'bg-gradient-to-br from-orange-500 to-orange-700',
        yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
        pink: 'bg-gradient-to-br from-pink-500 to-pink-700',
        emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
        amber: 'bg-gradient-to-br from-amber-500 to-amber-700',
        rose: 'bg-gradient-to-br from-rose-500 to-rose-700',
        slate: 'bg-gradient-to-br from-slate-500 to-slate-700',
      };
      
      const gradientClass = gradientColorMap[roleConfig?.color || 'blue'] || gradientColorMap.blue;
      
      return (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${gradientClass} flex items-center justify-center`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-[var(--odin-text-primary)]">{value}</span>
        </div>
      );
    }

    if (column.key === 'role') {
      return (
        <Badge className={getRoleColor(value)}>
          {getRoleLabel(value)}
        </Badge>
      );
    }

    if (column.key === 'status') {
      return (
        <Badge className={getStatusColor(value)}>
          {getStatusLabel(value)}
        </Badge>
      );
    }

    if (column.format === 'currency') {
      return <span className="font-semibold text-green-400">{formatMetricValue(value || 0, 'currency')}</span>;
    }

    if (column.format === 'number') {
      return <span className="font-semibold text-[var(--odin-text-primary)]">{value || 0}</span>;
    }

    return <span className="text-[var(--odin-text-secondary)]">{value || '-'}</span>;
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
          <p className="text-[var(--odin-text-secondary)]">Gestión de personal - {config?.companyName || 'ODIN POS'}</p>
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
          Nuevo Empleado
        </Button>
        </motion.div>
      </motion.div>

      {/* KPIs dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisData.map((kpi) => {
          const IconComponent = (LucideIcons as any)[kpi.icon];
          const colorClasses: Record<string, string> = {
            blue: 'border-blue-500/20',
            green: 'border-green-500/20',
            purple: 'border-purple-500/20',
            orange: 'border-orange-500/20',
            cyan: 'border-cyan-500/20',
            yellow: 'border-yellow-500/20',
            pink: 'border-pink-500/20',
            emerald: 'border-emerald-500/20',
          };
          
          const textColorClasses: Record<string, string> = {
            blue: 'text-blue-400',
            green: 'text-green-400',
            purple: 'text-purple-400',
            orange: 'text-orange-400',
            cyan: 'text-cyan-400',
            yellow: 'text-yellow-400',
            pink: 'text-pink-400',
            emerald: 'text-emerald-400',
          };
          
          return (
            <Card key={kpi.id} className={`bg-[var(--odin-bg-card)] ${colorClasses[kpi.color] || 'border-[var(--odin-border-accent)]'} p-4 backdrop-blur-sm transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[var(--odin-text-secondary)]">{kpi.label}</p>
                {IconComponent && <IconComponent className={`w-5 h-5 ${textColorClasses[kpi.color] || 'text-blue-400'}`} />}
              </div>
              <p className={`text-2xl font-bold ${textColorClasses[kpi.color] || 'text-blue-400'}`}>{kpi.value}</p>
            </Card>
          );
        })}
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
                {employeesConfig?.tableColumns?.map((column) => (
                  <th
                    key={column.key}
                    className={`text-${column.align} p-4 text-sm font-semibold text-[var(--odin-text-secondary)] ${column.hideOnMobile ? 'hidden lg:table-cell' : ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-[var(--odin-border-accent)] hover:bg-purple-500/5 transition-colors">
                  {employeesConfig?.tableColumns?.map((column) => (
                    <td
                      key={column.key}
                      className={`p-4 text-${column.align} ${column.hideOnMobile ? 'hidden lg:table-cell' : ''}`}
                    >
                      {renderCellValue(employee, column)}
                    </td>
                  ))}
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
              value={formData.role || employeesConfig.defaultRole}
              onChange={handleInputChange}
              className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {employeesConfig?.roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
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
              {employeesConfig?.allowedStatuses?.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}