import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ServiceFormModal } from '../../components/services/ServiceFormModal';
import { ServicesService } from '../../services/servicesService';
import { EmployeesService } from '../../services/employeesService';
import { useConfig } from '../../contexts/ConfigContext';
import { formatCurrencyDOP } from '../../utils/formatters';
import type { Service, ServiceCategory } from '../../types/services.types';
import type { Employee } from '../../types/employee.types';
import { BusinessType } from '../../types/config.types';

export default function ServiciosPage() {
  const { config } = useConfig();
  const userRole = config?.user?.role || 'supervisor';
  const businessType = config?.businessType || BusinessType.SPA;
  
  const [services, setServices] = useState<Service[]>(() => ServicesService.list({ isActive: true }));
  const [technicians, setTechnicians] = useState<Employee[]>([]);
  const [filterCategory, setFilterCategory] = useState<ServiceCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categories: ServiceCategory[] = ['Cabello', 'Uñas', 'Facial', 'Masajes', 'Depilación', 'Maquillaje', 'Pestañas', 'Cejas', 'Tratamientos', 'Otros'];

  // Cargar técnicos al montar el componente
  useEffect(() => {
    const loadedTechnicians = EmployeesService.getTechnicians(businessType);
    setTechnicians(loadedTechnicians);
  }, [businessType]);

  const filteredServices = useMemo(() => {
    return services.filter(svc => {
      if (filterCategory && svc.category !== filterCategory) return false;
      if (searchTerm && !svc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [services, filterCategory, searchTerm]);

  const stats = useMemo(() => {
    const byCat: Record<string, number> = {};
    categories.forEach(cat => {
      byCat[cat] = services.filter(s => s.category === cat).length;
    });
    return {
      total: services.length,
      byCategory: byCat,
    };
  }, [services, categories]);

  const getCategoryIcon = (category: ServiceCategory) => {
    const icons: Record<ServiceCategory, any> = {
      'Cabello': LucideIcons.Scissors,
      'Uñas': LucideIcons.Sparkles,
      'Facial': LucideIcons.Sparkle,
      'Masajes': LucideIcons.Hand,
      'Depilación': LucideIcons.Wind,
      'Maquillaje': LucideIcons.Palette,
      'Pestañas': LucideIcons.Eye,
      'Cejas': LucideIcons.Scan,
      'Tratamientos': LucideIcons.Stethoscope,
      'Otros': LucideIcons.MoreHorizontal,
    };
    return icons[category] || LucideIcons.Circle;
  };

  const getCategoryColor = (category: ServiceCategory) => {
    const colors: Record<ServiceCategory, string> = {
      'Cabello': 'purple',
      'Uñas': 'pink',
      'Facial': 'amber',
      'Masajes': 'cyan',
      'Depilación': 'orange',
      'Maquillaje': 'rose',
      'Pestañas': 'blue',
      'Cejas': 'emerald',
      'Tratamientos': 'indigo',
      'Otros': 'slate',
    };
    return colors[category] || 'slate';
  };

  const handleToggleActive = (id: string) => {
    ServicesService.toggleActive(id);
    setServices(ServicesService.list({ isActive: true }));
    toast.success('Estado del servicio actualizado');
  };

  const handleSaveService = (serviceData: Partial<Service>) => {
    try {
      if (selectedService) {
        // Editar servicio existente
        ServicesService.update({ id: selectedService.id, ...serviceData });
        toast.success('Servicio actualizado exitosamente');
      } else {
        // Crear nuevo servicio
        ServicesService.create(serviceData);
        toast.success('Servicio creado exitosamente');
      }
      setServices(ServicesService.list({ isActive: true }));
    } catch (error) {
      toast.error('Error al guardar el servicio');
      console.error(error);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    try {
      ServicesService.delete(serviceId);
      setServices(ServicesService.list({ isActive: true }));
      toast.success('Servicio eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el servicio');
      console.error(error);
    }
  };

  // IMPORTANTE: Supervisor NO ve precios
  const showPricing = userRole !== 'supervisor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Servicios</h1>
          <p className="text-[var(--odin-text-secondary)]">Catálogo de servicios del spa</p>
        </div>

        <Button
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
        >
          <LucideIcons.Plus className="w-5 h-5 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* KPIs por Categoría */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.slice(0, 5).map((cat) => {
          const Icon = getCategoryIcon(cat);
          const color = getCategoryColor(cat);
          
          return (
            <Card key={cat} className={`bg-card border-${color}-500/20 p-4`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 text-${color}-400`} />
              </div>
              <p className="text-sm text-muted-foreground">{cat}</p>
              <p className={`text-2xl font-bold text-${color}-400`}>{stats.byCategory[cat] || 0}</p>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card className="bg-card border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
            <div className="relative">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar servicio..."
                className="pl-11 bg-[var(--odin-input-bg)] border-border text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ServiceCategory | '')}
              className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service, index) => {
          const Icon = getCategoryIcon(service.category);
          const color = getCategoryColor(service.category);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-card border-border p-6 hover:border-purple-500/50 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${color}-500/10 rounded-xl`}>
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                  </div>
                  <Badge className={`bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}>
                    {service.category}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
                
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                )}

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <LucideIcons.Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">{service.duration} min</span>
                  </div>
                  
                  {showPricing && service.price && (
                    <div className="flex items-center space-x-2">
                      <LucideIcons.DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-bold">
                        {formatCurrencyDOP(service.price)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => handleToggleActive(service.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      service.isActive
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {service.isActive ? 'Activo' : 'Inactivo'}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsModalOpen(true);
                      }}
                      className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      <LucideIcons.Eye className="w-4 h-4 text-muted-foreground hover:text-purple-400" />
                    </button>
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors">
                      <LucideIcons.Edit className="w-4 h-4 text-muted-foreground hover:text-blue-400" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card className="bg-card border-border p-12">
          <div className="text-center">
            <LucideIcons.Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">No se encontraron servicios</p>
            <p className="text-sm text-muted-foreground">Intenta con otros filtros de búsqueda</p>
          </div>
        </Card>
      )}

      {/* Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        userRole={userRole}
        technicians={technicians}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </motion.div>
  );
}