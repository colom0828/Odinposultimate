'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Save, Clock, Info } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { AppointmentsService } from '../../services/appointmentsService';
import { ServicesService } from '../../services/servicesService';
import { useCustomers } from '../../hooks/useCustomers';
import { getEmployeesByBusinessType } from '../../data/employeesMockData';
import { BusinessType } from '../../types/config.types';
import type { Appointment, CreateAppointmentDTO } from '../../types/appointments.types';
import type { Service } from '../../types/services.types';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment?: Appointment | null;
}

export function AppointmentFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  appointment 
}: AppointmentFormModalProps) {
  const { customers } = useCustomers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Obtener servicios y técnicos
  const services = useMemo(() => ServicesService.getActive(), []);
  const technicians = useMemo(() => 
    getEmployeesByBusinessType(BusinessType.SPA).filter(e => 
      e.role === 'estilista' || e.role === 'manicurista' || 
      e.role === 'masajista' || e.role === 'cosmetologo'
    ),
    []
  );

  // Estado del formulario
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    technicianId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 60,
    room: '',
    notes: '',
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.clientId,
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone,
        clientEmail: appointment.clientEmail || '',
        serviceId: appointment.serviceId,
        technicianId: appointment.technicianId,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        room: appointment.room || '',
        notes: appointment.notes || '',
      });
    } else {
      // Reset al crear nueva
      setFormData({
        clientId: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        serviceId: '',
        technicianId: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        duration: 60,
        room: '',
        notes: '',
      });
    }
  }, [appointment, isOpen]);

  // Auto-completar datos del cliente seleccionado
  const handleClientChange = (clientId: string) => {
    const customer = customers.find(c => c.id.toString() === clientId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        clientId: customer.id.toString(),
        clientName: customer.name,
        clientPhone: customer.phone,
        clientEmail: customer.email,
      }));
    }
  };

  // Auto-completar duración del servicio
  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceId,
        duration: service.duration,
      }));
    }
  };

  // Calcular hora fin
  const calculateEndTime = () => {
    if (!formData.time || !formData.duration) return '';
    
    const [hours, minutes] = formData.time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + formData.duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Validar formulario
  const validateForm = (): string | null => {
    if (!formData.clientId && !formData.clientName) {
      return 'Debe seleccionar o ingresar un cliente';
    }
    if (!formData.serviceId) {
      return 'Debe seleccionar un servicio';
    }
    if (!formData.technicianId) {
      return 'Debe seleccionar un especialista';
    }
    if (!formData.date) {
      return 'Debe seleccionar una fecha';
    }
    if (!formData.time) {
      return 'Debe seleccionar una hora';
    }

    // Validar que no sea fecha pasada
    const selectedDate = new Date(formData.date + 'T' + formData.time);
    const now = new Date();
    if (selectedDate < now && !appointment) {
      return 'No puede agendar citas en fechas u horas pasadas';
    }

    // Validar disponibilidad de técnico
    const isAvailable = AppointmentsService.checkAvailability(
      formData.technicianId,
      formData.date,
      formData.time,
      formData.duration,
      appointment?.id
    );

    if (!isAvailable) {
      const techName = technicians.find(t => t.id === formData.technicianId)?.name;
      return `${techName} ya tiene una cita programada en ese horario`;
    }

    return null;
  };

  // Manejar envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener datos completos del servicio y técnico
      const service = services.find(s => s.id === formData.serviceId);
      const technician = technicians.find(t => t.id === formData.technicianId);

      if (!service || !technician) {
        toast.error('Error al obtener datos del servicio o especialista');
        return;
      }

      const appointmentData: CreateAppointmentDTO = {
        clientId: formData.clientId || `cli-${Date.now()}`,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail || undefined,
        serviceId: formData.serviceId,
        technicianId: formData.technicianId,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        room: formData.room || undefined,
        notes: formData.notes || undefined,
      };

      if (appointment) {
        // Actualizar cita existente
        const updated = AppointmentsService.update({
          id: appointment.id,
          ...appointmentData,
        });

        if (updated) {
          toast.success('Cita actualizada exitosamente');
          onSuccess();
          onClose();
        } else {
          toast.error('Error al actualizar la cita');
        }
      } else {
        // Crear nueva cita
        const newAppointment = AppointmentsService.create(appointmentData);
        
        // Actualizar con datos completos
        AppointmentsService.update({
          id: newAppointment.id,
          serviceName: service.name,
          serviceCategory: service.category,
          technicianName: technician.name,
          status: 'confirmed',
        });

        toast.success('Cita creada exitosamente', {
          description: `${formData.clientName} - ${service.name} - ${formData.date} ${formData.time}`,
        });
        
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar cita:', error);
      toast.error('Error al guardar la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'Editar Cita' : 'Nueva Cita'}
      footer={
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-border bg-[var(--odin-input-bg)] text-foreground"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {appointment ? 'Actualizar' : 'Crear Cita'}
              </>
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cliente */}
        <div className="space-y-2">
          <Label htmlFor="client">Cliente *</Label>
          <select
            id="client"
            value={formData.clientId}
            onChange={(e) => handleClientChange(e.target.value)}
            className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Seleccionar cliente...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </select>
          
          {/* Opción de cliente nuevo */}
          {!formData.clientId && (
            <div className="mt-3 p-3 border border-border rounded-lg space-y-3">
              <p className="text-sm text-muted-foreground">O ingrese datos del nuevo cliente:</p>
              
              <div>
                <Label htmlFor="clientName">Nombre</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Nombre completo"
                  className="bg-[var(--odin-input-bg)] border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="clientPhone">Teléfono</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  placeholder="+1 809-555-0000"
                  className="bg-[var(--odin-input-bg)] border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="clientEmail">Email (opcional)</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  placeholder="email@ejemplo.com"
                  className="bg-[var(--odin-input-bg)] border-border text-foreground"
                />
              </div>
            </div>
          )}
        </div>

        {/* Servicio */}
        <div className="space-y-2">
          <Label htmlFor="service">Servicio *</Label>
          <select
            id="service"
            value={formData.serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Seleccionar servicio...</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.duration} min{service.price ? ` - RD$ ${service.price.toFixed(2)}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Especialista */}
        <div className="space-y-2">
          <Label htmlFor="technician">Estilista / Especialista *</Label>
          <select
            id="technician"
            value={formData.technicianId}
            onChange={(e) => setFormData(prev => ({ ...prev, technicianId: e.target.value }))}
            className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Seleccionar especialista...</option>
            {technicians.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.name} - {tech.role}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="bg-[var(--odin-input-bg)] border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Hora de Inicio *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="bg-[var(--odin-input-bg)] border-border text-foreground"
              required
            />
          </div>
        </div>

        {/* Duración */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (minutos)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              min="15"
              step="15"
              className="bg-[var(--odin-input-bg)] border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Hora Estimada de Fin</Label>
            <div className="flex items-center h-10 px-3 bg-[var(--odin-input-bg)]/50 border border-border rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground mr-2" />
              <span className="text-foreground">{calculateEndTime() || '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Sala / Ubicación */}
        <div className="space-y-2">
          <Label htmlFor="room">Sala / Ubicación (opcional)</Label>
          <Input
            id="room"
            value={formData.room}
            onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
            placeholder="Ej: Sala 1, Cabina 3, etc."
            className="bg-[var(--odin-input-bg)] border-border text-foreground"
          />
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Preferencias del cliente, instrucciones especiales..."
            rows={3}
            className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Resumen */}
        {formData.serviceId && formData.technicianId && formData.date && formData.time && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-purple-400">Resumen de la Cita</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(formData.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  De {formData.time} a {calculateEndTime()} ({formData.duration} min)
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}