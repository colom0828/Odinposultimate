'use client';

import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { formatCurrencyDOP } from '../../utils/formatters';
import { ServicesService } from '../../services/servicesService';
import type { Service, ServiceCategory } from '../../types/services.types';
import type { Employee } from '../../types/employee.types';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: Partial<Service>) => void;
  onDelete?: (serviceId: string) => void;
  service: Service | null;
  userRole: string;
  technicians: Employee[];
}

export function ServiceFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  service,
  userRole,
  technicians,
}: ServiceFormModalProps) {
  const isEditing = !!service;
  const showPricing = userRole !== 'supervisor';
  const showCost = userRole === 'admin';
  const canDelete = userRole === 'encargado' || userRole === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cabello' as ServiceCategory,
    duration: 30,
    price: 0,
    cost: 0,
    description: '',
    isActive: true,
    technicians: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: ServiceCategory[] = [
    'Cabello',
    'Uñas',
    'Facial',
    'Masajes',
    'Depilación',
    'Maquillaje',
    'Pestañas',
    'Cejas',
    'Tratamientos',
    'Otros',
  ];

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        category: service.category,
        duration: service.duration,
        price: service.price || 0,
        cost: service.cost || 0,
        description: service.description || '',
        isActive: service.isActive,
        technicians: service.technicians || [],
      });
    } else {
      setFormData({
        name: '',
        category: 'Cabello',
        duration: 30,
        price: 0,
        cost: 0,
        description: '',
        isActive: true,
        technicians: [],
      });
    }
    setErrors({});
  }, [service, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTechnicianToggle = (technicianId: string) => {
    setFormData((prev) => {
      const newTechnicians = prev.technicians.includes(technicianId)
        ? prev.technicians.filter((id) => id !== technicianId)
        : [...prev.technicians, technicianId];
      return { ...prev, technicians: newTechnicians };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del servicio es obligatorio';
    }

    // Validar duplicados por nombre en misma categoría
    if (formData.name.trim()) {
      const existingServices = ServicesService.list();
      const isDuplicate = existingServices.some(
        (s) =>
          s.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          s.category === formData.category &&
          s.id !== service?.id // Excluir el servicio actual si estamos editando
      );

      if (isDuplicate) {
        newErrors.name = `Ya existe un servicio "${formData.name}" en la categoría ${formData.category}`;
      }
    }

    // Validar duración
    if (formData.duration <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0';
    }

    // Validar precio (solo si el usuario puede verlo)
    if (showPricing && formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const serviceData: Partial<Service> = {
      name: formData.name.trim(),
      category: formData.category,
      duration: formData.duration,
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
      technicians: formData.technicians.length > 0 ? formData.technicians : undefined,
    };

    if (showPricing) {
      serviceData.price = formData.price;
    }

    if (showCost) {
      serviceData.cost = formData.cost;
    }

    onSave(serviceData);
    onClose();
  };

  const handleDelete = () => {
    if (service && onDelete && canDelete) {
      const confirmMessage = formData.isActive
        ? `¿Estás seguro de eliminar el servicio "${service.name}"?\n\nEsta acción desactivará el servicio permanentemente.`
        : `¿Estás seguro de eliminar permanentemente el servicio "${service.name}"?`;

      if (confirm(confirmMessage)) {
        onDelete(service.id);
        onClose();
      }
    }
  };

  const canSave = () => {
    return formData.name.trim() && formData.duration > 0 && (!showPricing || formData.price > 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--odin-text-primary)] flex items-center justify-between">
            <div className="flex items-center">
              {isEditing ? (
                <>
                  <LucideIcons.Edit className="w-6 h-6 mr-3 text-purple-400" />
                  Editar Servicio
                </>
              ) : (
                <>
                  <LucideIcons.Plus className="w-6 h-6 mr-3 text-purple-400" />
                  Nuevo Servicio
                </>
              )}
            </div>
            {isEditing && (
              <Badge className={formData.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                {formData.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing ? 'Formulario para editar un servicio existente' : 'Formulario para crear un nuevo servicio'}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] px-1">
          <div className="space-y-5 py-4">
            {/* SECCIÓN: INFORMACIÓN BÁSICA */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-5">
              <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                <LucideIcons.Info className="w-5 h-5 mr-2 text-blue-400" />
                Información Básica
              </h3>

              <div className="space-y-4">
                {/* Nombre del Servicio */}
                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                    <LucideIcons.Tag className="w-4 h-4 mr-2" />
                    Nombre del Servicio *
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Corte de Cabello, Manicure Spa, etc."
                    className={`bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <LucideIcons.AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Categoría y Duración */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                      <LucideIcons.Layers className="w-4 h-4 mr-2" />
                      Categoría *
                    </Label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                      <LucideIcons.Clock className="w-4 h-4 mr-2" />
                      Duración (minutos) *
                    </Label>
                    <Input
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="5"
                      step="5"
                      className={`bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] ${
                        errors.duration ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.duration && (
                      <p className="text-red-400 text-xs mt-1">{errors.duration}</p>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                    <LucideIcons.FileText className="w-4 h-4 mr-2" />
                    Descripción
                  </Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción detallada del servicio que recibirá el cliente..."
                    rows={3}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: PRECIOS (solo si el rol lo permite) */}
            {showPricing && (
              <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-5">
                <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                  <LucideIcons.DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Información de Precios (RD$)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2">
                      Precio de Venta *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-bold">
                        RD$
                      </span>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] pl-14 ${
                          errors.price ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-400 text-xs mt-1">{errors.price}</p>
                    )}
                    {formData.price > 0 && (
                      <p className="text-xs text-green-400 mt-1">
                        {formatCurrencyDOP(formData.price)}
                      </p>
                    )}
                  </div>

                  {showCost && (
                    <div>
                      <Label className="text-[var(--odin-text-primary)] mb-2">Costo</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-bold">
                          RD$
                        </span>
                        <Input
                          name="cost"
                          type="number"
                          value={formData.cost}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] pl-14"
                        />
                      </div>
                      {formData.cost > 0 && (
                        <p className="text-xs text-orange-400 mt-1">
                          {formatCurrencyDOP(formData.cost)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {showCost && formData.price > 0 && formData.cost > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--odin-text-secondary)] mb-1">
                          Margen de Ganancia
                        </p>
                        <p className="text-2xl font-bold text-purple-400">
                          {formatCurrencyDOP(formData.price - formData.cost)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Porcentaje</p>
                        <p className="text-2xl font-bold text-pink-400">
                          {formData.cost > 0
                            ? (((formData.price - formData.cost) / formData.cost) * 100).toFixed(1)
                            : '0'}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN: TÉCNICOS */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-5">
              <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                <LucideIcons.Users className="w-5 h-5 mr-2 text-cyan-400" />
                Técnicos que pueden realizar este servicio
              </h3>

              {technicians.length === 0 ? (
                <div className="text-center py-8 bg-[var(--odin-bg-card)] rounded-lg border border-[var(--odin-border-accent)]">
                  <LucideIcons.UserX className="w-12 h-12 text-[var(--odin-text-secondary)] mx-auto mb-3" />
                  <p className="text-[var(--odin-text-secondary)] text-sm">
                    No hay técnicos registrados
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                  {technicians.map((tech) => (
                    <label
                      key={tech.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.technicians.includes(tech.id)
                          ? 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30'
                          : 'bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] hover:border-purple-500/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicians.includes(tech.id)}
                        onChange={() => handleTechnicianToggle(tech.id)}
                        className="w-4 h-4 rounded border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-purple-600 focus:ring-purple-500 focus:ring-2 mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--odin-text-primary)]">
                          {tech.name}
                        </p>
                        <p className="text-xs text-[var(--odin-text-secondary)]">{tech.role}</p>
                      </div>
                      {formData.technicians.includes(tech.id) && (
                        <LucideIcons.CheckCircle className="w-5 h-5 text-purple-400" />
                      )}
                    </label>
                  ))}
                </div>
              )}

              {formData.technicians.length > 0 && (
                <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-xs text-purple-400">
                    {formData.technicians.length} técnico(s) seleccionado(s)
                  </p>
                </div>
              )}
            </div>

            {/* SECCIÓN: ESTADO */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-1 flex items-center">
                    <LucideIcons.Power className="w-5 h-5 mr-2 text-amber-400" />
                    Estado del Servicio
                  </h3>
                  <p className="text-sm text-[var(--odin-text-secondary)]">
                    {formData.isActive
                      ? 'El servicio está activo y disponible para reservas'
                      : 'El servicio está desactivado y no aparecerá en reservas'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--odin-border-accent)] pt-4">
          <div className="flex items-center justify-between w-full">
            {isEditing && onDelete && canDelete && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LucideIcons.Trash2 className="w-4 h-4 mr-2" />
                Eliminar Servicio
              </Button>
            )}

            {isEditing && !canDelete && (
              <div className="text-xs text-[var(--odin-text-secondary)] italic">
                Solo Encargados pueden eliminar servicios
              </div>
            )}

            <div className={`flex items-center space-x-3 ${!isEditing || !canDelete ? 'ml-auto' : ''}`}>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
              >
                <LucideIcons.X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>

              <Button
                onClick={handleSave}
                disabled={!canSave()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LucideIcons.Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}