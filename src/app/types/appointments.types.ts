/**
 * ODIN POS - Tipos para Módulo de Citas/Agenda (Spa)
 */

export type AppointmentStatus = 
  | 'scheduled'     // Programada
  | 'confirmed'     // Confirmada
  | 'in_progress'   // En curso
  | 'completed'     // Completada
  | 'cancelled'     // Cancelada
  | 'no_show';      // No se presentó

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  technicianId: string;
  technicianName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutos
  status: AppointmentStatus;
  room?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  cancelReason?: string;
}

export interface CreateAppointmentDTO {
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  technicianId: string;
  date: string;
  time: string;
  duration: number;
  room?: string;
  notes?: string;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  id: string;
  status?: AppointmentStatus;
  cancelReason?: string;
}

export interface AppointmentFilters {
  date?: string;
  technicianId?: string;
  status?: AppointmentStatus;
  serviceCategory?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  technicianId?: string;
  appointmentId?: string;
}

export interface DaySchedule {
  date: string;
  appointments: Appointment[];
  timeSlots: TimeSlot[];
}
