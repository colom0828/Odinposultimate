import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  ServiceOrder,
  EquipmentType,
  ServicePriority,
  EQUIPMENT_TYPE_CONFIG,
} from '../../types/serviceOrders.types';

interface NewServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: Partial<ServiceOrder>) => void;
  technicians: Array<{ id: string; name: string }>;
}

export function NewServiceOrderModal({
  isOpen,
  onClose,
  onSave,
  technicians,
}: NewServiceOrderModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Cliente
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    // Paso 2: Equipo
    equipmentType: EquipmentType.LAPTOP,
    equipmentBrand: '',
    equipmentModel: '',
    equipmentSerial: '',
    equipmentAccessories: '',
    // Paso 3: Problema
    reportedIssue: '',
    priority: ServicePriority.NORMAL,
    // Paso 4: Asignación
    assignedTechnicianId: '',
  });

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    const selectedTechnician = technicians.find(t => t.id === formData.assignedTechnicianId);

    const orderData: Partial<ServiceOrder> = {
      customer: {
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail || undefined,
        address: formData.customerAddress || undefined,
      },
      equipment: {
        type: formData.equipmentType,
        brand: formData.equipmentBrand,
        model: formData.equipmentModel,
        serial: formData.equipmentSerial || undefined,
        accessories: formData.equipmentAccessories || undefined,
      },
      reportedIssue: formData.reportedIssue,
      priority: formData.priority,
      assignedTechnician: selectedTechnician ? {
        id: selectedTechnician.id,
        name: selectedTechnician.name,
      } : undefined,
    };

    onSave(orderData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      equipmentType: EquipmentType.LAPTOP,
      equipmentBrand: '',
      equipmentModel: '',
      equipmentSerial: '',
      equipmentAccessories: '',
      reportedIssue: '',
      priority: ServicePriority.NORMAL,
      assignedTechnicianId: '',
    });
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.customerName && formData.customerPhone;
      case 2:
        return formData.equipmentBrand && formData.equipmentModel;
      case 3:
        return formData.reportedIssue;
      case 4:
        return true; // Asignación es opcional
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--odin-text-primary)]">
            Nueva Orden de Servicio
          </DialogTitle>
          
          {/* Indicador de pasos */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s === step
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : s < step
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {s < step ? <LucideIcons.Check className="w-5 h-5" /> : s}
                </div>
                {s < totalSteps && (
                  <div
                    className={`w-12 h-1 mx-1 transition-all ${
                      s < step ? 'bg-green-400' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Títulos de pasos */}
          <div className="text-center pt-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {step === 1 && 'Paso 1: Datos del Cliente'}
              {step === 2 && 'Paso 2: Información del Equipo'}
              {step === 3 && 'Paso 3: Problema Reportado'}
              {step === 4 && 'Paso 4: Asignación (Opcional)'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[50vh] px-1">
          {/* PASO 1: CLIENTE */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.User className="w-4 h-4 mr-2" />
                  Nombre del Cliente *
                </Label>
                <Input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Ej: Roberto Jiménez"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.Phone className="w-4 h-4 mr-2" />
                  Teléfono *
                </Label>
                <Input
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="Ej: +506 8888-1234"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.Mail className="w-4 h-4 mr-2" />
                  Email (Opcional)
                </Label>
                <Input
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="cliente@email.com"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.MapPin className="w-4 h-4 mr-2" />
                  Dirección (Opcional)
                </Label>
                <Input
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  placeholder="Dirección del cliente"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>
            </div>
          )}

          {/* PASO 2: EQUIPO */}
          {step === 2 && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.Laptop className="w-4 h-4 mr-2" />
                  Tipo de Equipo
                </Label>
                <select
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(EQUIPMENT_TYPE_CONFIG).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                    <LucideIcons.Tag className="w-4 h-4 mr-2" />
                    Marca *
                  </Label>
                  <Input
                    name="equipmentBrand"
                    value={formData.equipmentBrand}
                    onChange={handleInputChange}
                    placeholder="Ej: HP, Dell, Apple"
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                    <LucideIcons.Layers className="w-4 h-4 mr-2" />
                    Modelo *
                  </Label>
                  <Input
                    name="equipmentModel"
                    value={formData.equipmentModel}
                    onChange={handleInputChange}
                    placeholder="Ej: Pavilion 15"
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.Hash className="w-4 h-4 mr-2" />
                  Número de Serie (Opcional)
                </Label>
                <Input
                  name="equipmentSerial"
                  value={formData.equipmentSerial}
                  onChange={handleInputChange}
                  placeholder="Ej: HP2024XYZ123"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.Package className="w-4 h-4 mr-2" />
                  Accesorios Recibidos (Opcional)
                </Label>
                <Input
                  name="equipmentAccessories"
                  value={formData.equipmentAccessories}
                  onChange={handleInputChange}
                  placeholder="Ej: Cargador, Bolso, Cable USB"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>
            </div>
          )}

          {/* PASO 3: PROBLEMA */}
          {step === 3 && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.AlertCircle className="w-4 h-4 mr-2" />
                  Problema Reportado *
                </Label>
                <Textarea
                  name="reportedIssue"
                  value={formData.reportedIssue}
                  onChange={handleInputChange}
                  placeholder="Describa detalladamente el problema reportado por el cliente..."
                  rows={5}
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.Flag className="w-4 h-4 mr-2" />
                  Prioridad
                </Label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={ServicePriority.NORMAL}>Normal</option>
                  <option value={ServicePriority.URGENTE}>Urgente</option>
                </select>
              </div>

              {formData.priority === ServicePriority.URGENTE && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-400">
                    <LucideIcons.AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-medium">Esta orden será marcada como urgente</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 4: ASIGNACIÓN */}
          {step === 4 && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <LucideIcons.Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm">Asignación Opcional</p>
                    <p className="text-[var(--odin-text-secondary)] text-xs mt-1">
                      Puedes asignar un técnico ahora o hacerlo más tarde desde el tablero.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                  <LucideIcons.UserCheck className="w-4 h-4 mr-2" />
                  Técnico Asignado
                </Label>
                <select
                  name="assignedTechnicianId"
                  value={formData.assignedTechnicianId}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--odin-input-bg)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sin asignar</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.assignedTechnicianId && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-400">
                    <LucideIcons.CheckCircle className="w-5 h-5" />
                    <p className="text-sm">
                      Técnico seleccionado: {technicians.find(t => t.id === formData.assignedTechnicianId)?.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Resumen */}
              <div className="mt-6 bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-lg p-4">
                <h4 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                  <LucideIcons.FileText className="w-4 h-4 mr-2" />
                  Resumen de la Orden
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-[var(--odin-text-secondary)]">Cliente:</span>{' '}
                    <span className="text-[var(--odin-text-primary)] font-medium">{formData.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--odin-text-secondary)]">Equipo:</span>{' '}
                    <span className="text-[var(--odin-text-primary)] font-medium">
                      {formData.equipmentBrand} {formData.equipmentModel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--odin-text-secondary)]">Prioridad:</span>{' '}
                    {formData.priority === ServicePriority.URGENTE ? (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Urgente</Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Normal</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[var(--odin-border-accent)] pt-4">
          <div className="flex items-center justify-between w-full">
            <div>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                >
                  <LucideIcons.ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
              >
                <LucideIcons.X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                >
                  Siguiente
                  <LucideIcons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg"
                >
                  <LucideIcons.Save className="w-4 h-4 mr-2" />
                  Crear Orden
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}