import { useState, useEffect } from 'react';
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

interface EditServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, orderData: Partial<ServiceOrder>) => void;
  order: ServiceOrder | null;
  technicians: Array<{ id: string; name: string }>;
}

export function EditServiceOrderModal({
  isOpen,
  onClose,
  onSave,
  order,
  technicians,
}: EditServiceOrderModalProps) {
  const [formData, setFormData] = useState({
    // Cliente
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    // Equipo
    equipmentType: EquipmentType.LAPTOP,
    equipmentBrand: '',
    equipmentModel: '',
    equipmentSerial: '',
    equipmentAccessories: '',
    // Problema
    reportedIssue: '',
    diagnosis: '',
    priority: ServicePriority.NORMAL,
    internalNotes: '',
    // Asignación
    assignedTechnicianId: '',
  });

  // Cargar datos de la orden cuando se abre el modal
  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        customerEmail: order.customer.email || '',
        customerAddress: order.customer.address || '',
        equipmentType: order.equipment.type,
        equipmentBrand: order.equipment.brand,
        equipmentModel: order.equipment.model,
        equipmentSerial: order.equipment.serial || '',
        equipmentAccessories: order.equipment.accessories || '',
        reportedIssue: order.reportedIssue,
        diagnosis: order.diagnosis || '',
        priority: order.priority,
        internalNotes: order.internalNotes || '',
        assignedTechnicianId: order.assignedTechnician?.id || '',
      });
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!order) return;

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
      diagnosis: formData.diagnosis || undefined,
      priority: formData.priority,
      internalNotes: formData.internalNotes || undefined,
      assignedTechnician: selectedTechnician ? {
        id: selectedTechnician.id,
        name: selectedTechnician.name,
      } : undefined,
    };

    onSave(order.id, orderData);
    onClose();
  };

  const canSave = () => {
    return formData.customerName && 
           formData.customerPhone && 
           formData.equipmentBrand && 
           formData.equipmentModel && 
           formData.reportedIssue;
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--odin-text-primary)] flex items-center">
            <LucideIcons.Edit className="w-6 h-6 mr-2 text-purple-400" />
            Editar Orden {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[65vh] px-1">
          <div className="space-y-6 py-4">
            {/* SECCIÓN: CLIENTE */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
              <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                <LucideIcons.User className="w-5 h-5 mr-2 text-blue-400" />
                Datos del Cliente
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                    Nombre del Cliente *
                  </Label>
                  <Input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-[var(--odin-text-primary)] mb-2 flex items-center">
                    Teléfono *
                  </Label>
                  <Input
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Email
                  </Label>
                  <Input
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Dirección
                  </Label>
                  <Input
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: EQUIPO */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
              <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                <LucideIcons.Laptop className="w-5 h-5 mr-2 text-purple-400" />
                Información del Equipo
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-[var(--odin-text-primary)] mb-2">
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

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Marca *
                  </Label>
                  <Input
                    name="equipmentBrand"
                    value={formData.equipmentBrand}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Modelo *
                  </Label>
                  <Input
                    name="equipmentModel"
                    value={formData.equipmentModel}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Número de Serie
                  </Label>
                  <Input
                    name="equipmentSerial"
                    value={formData.equipmentSerial}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Accesorios
                  </Label>
                  <Input
                    name="equipmentAccessories"
                    value={formData.equipmentAccessories}
                    onChange={handleInputChange}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: PROBLEMA Y DIAGNÓSTICO */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
              <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                <LucideIcons.AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
                Problema y Diagnóstico
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Problema Reportado *
                  </Label>
                  <Textarea
                    name="reportedIssue"
                    value={formData.reportedIssue}
                    onChange={handleInputChange}
                    rows={3}
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Diagnóstico
                  </Label>
                  <Textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Diagnóstico técnico del problema..."
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
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

                <div>
                  <Label className="text-[var(--odin-text-primary)] mb-2">
                    Notas Internas
                  </Label>
                  <Textarea
                    name="internalNotes"
                    value={formData.internalNotes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Notas internas para el equipo técnico..."
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: ASIGNACIÓN */}
            <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
              <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                <LucideIcons.UserCheck className="w-5 h-5 mr-2 text-cyan-400" />
                Asignación de Técnico
              </h3>
              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2">
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
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--odin-border-accent)] pt-4">
          <div className="flex items-center justify-end space-x-3 w-full">
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
            >
              <LucideIcons.Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}