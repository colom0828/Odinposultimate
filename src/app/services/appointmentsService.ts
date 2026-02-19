/**
 * ODIN POS - Appointments Service
 * Servicio para gestión de citas (mock + preparado para API)
 */

import { 
  Appointment, 
  CreateAppointmentDTO, 
  UpdateAppointmentDTO,
  AppointmentFilters 
} from '../types/appointments.types';
import { mockAppointments } from '../data/mockAppointmentsData';

// ========================================
// STORAGE KEY
// ========================================

const STORAGE_KEY = 'odin_appointments';

// ========================================
// LOCAL STORAGE HELPERS
// ========================================

function getAppointmentsFromStorage(): Appointment[] {
  if (typeof window === 'undefined') return mockAppointments;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading appointments from storage:', error);
  }
  
  // Si no hay datos, guardar los mock
  saveAppointmentsToStorage(mockAppointments);
  return mockAppointments;
}

function saveAppointmentsToStorage(appointments: Appointment[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error('Error saving appointments to storage:', error);
  }
}

// ========================================
// CRUD OPERATIONS
// ========================================

export const AppointmentsService = {
  /**
   * Listar todas las citas
   */
  list(filters?: AppointmentFilters): Appointment[] {
    let appointments = getAppointmentsFromStorage();
    
    if (filters) {
      if (filters.date) {
        appointments = appointments.filter(apt => apt.date === filters.date);
      }
      if (filters.technicianId) {
        appointments = appointments.filter(apt => apt.technicianId === filters.technicianId);
      }
      if (filters.status) {
        appointments = appointments.filter(apt => apt.status === filters.status);
      }
      if (filters.serviceCategory) {
        appointments = appointments.filter(apt => apt.serviceCategory === filters.serviceCategory);
      }
    }
    
    // Ordenar por fecha y hora
    return appointments.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  },

  /**
   * Obtener cita por ID
   */
  getById(id: string): Appointment | undefined {
    const appointments = getAppointmentsFromStorage();
    return appointments.find(apt => apt.id === id);
  },

  /**
   * Crear nueva cita
   */
  create(data: CreateAppointmentDTO): Appointment {
    const appointments = getAppointmentsFromStorage();
    
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      ...data,
      serviceName: '', // Se debe obtener del servicio
      serviceCategory: '', // Se debe obtener del servicio
      technicianName: '', // Se debe obtener del empleado
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
    
    appointments.push(newAppointment);
    saveAppointmentsToStorage(appointments);
    
    return newAppointment;
  },

  /**
   * Actualizar cita existente
   */
  update(data: UpdateAppointmentDTO): Appointment | null {
    const appointments = getAppointmentsFromStorage();
    const index = appointments.findIndex(apt => apt.id === data.id);
    
    if (index === -1) return null;
    
    const updatedAppointment: Appointment = {
      ...appointments[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    appointments[index] = updatedAppointment;
    saveAppointmentsToStorage(appointments);
    
    return updatedAppointment;
  },

  /**
   * Cancelar cita
   */
  cancel(id: string, reason?: string): Appointment | null {
    return this.update({
      id,
      status: 'cancelled',
      cancelReason: reason,
    });
  },

  /**
   * Confirmar cita
   */
  confirm(id: string): Appointment | null {
    return this.update({
      id,
      status: 'confirmed',
    });
  },

  /**
   * Iniciar cita
   */
  start(id: string): Appointment | null {
    return this.update({
      id,
      status: 'in_progress',
    });
  },

  /**
   * Completar cita
   */
  complete(id: string): Appointment | null {
    return this.update({
      id,
      status: 'completed',
    });
  },

  /**
   * Marcar como no se presentó
   */
  markNoShow(id: string): Appointment | null {
    return this.update({
      id,
      status: 'no_show',
    });
  },

  /**
   * Eliminar cita
   */
  delete(id: string): boolean {
    const appointments = getAppointmentsFromStorage();
    const filtered = appointments.filter(apt => apt.id !== id);
    
    if (filtered.length === appointments.length) return false;
    
    saveAppointmentsToStorage(filtered);
    return true;
  },

  /**
   * Verificar disponibilidad de horario
   */
  checkAvailability(
    technicianId: string,
    date: string,
    time: string,
    duration: number,
    excludeId?: string
  ): boolean {
    const appointments = this.list({ date, technicianId });
    
    const [newHour, newMinute] = time.split(':').map(Number);
    const newStart = newHour * 60 + newMinute;
    const newEnd = newStart + duration;
    
    for (const apt of appointments) {
      if (excludeId && apt.id === excludeId) continue;
      if (apt.status === 'cancelled' || apt.status === 'no_show') continue;
      
      const [aptHour, aptMinute] = apt.time.split(':').map(Number);
      const aptStart = aptHour * 60 + aptMinute;
      const aptEnd = aptStart + apt.duration;
      
      // Verificar solapamiento
      if (
        (newStart >= aptStart && newStart < aptEnd) ||
        (newEnd > aptStart && newEnd <= aptEnd) ||
        (newStart <= aptStart && newEnd >= aptEnd)
      ) {
        return false; // Hay conflicto
      }
    }
    
    return true; // No hay conflicto
  },

  /**
   * Obtener citas del día
   */
  getToday(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.list({ date: today });
  },

  /**
   * Obtener estadísticas del día
   */
  getTodayStats() {
    const today = this.getToday();
    
    return {
      total: today.length,
      scheduled: today.filter(a => a.status === 'scheduled').length,
      confirmed: today.filter(a => a.status === 'confirmed').length,
      in_progress: today.filter(a => a.status === 'in_progress').length,
      completed: today.filter(a => a.status === 'completed').length,
      cancelled: today.filter(a => a.status === 'cancelled').length,
      no_show: today.filter(a => a.status === 'no_show').length,
    };
  },
};

// ========================================
// API INTEGRATION (PREPARADO PARA FUTURO)
// ========================================

/**
 * Funciones preparadas para integración con API real
 */
export async function fetchAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
  try {
    // TODO: Reemplazar con llamada real a API
    // const response = await fetch(`/api/appointments?${new URLSearchParams(filters)}`);
    // return await response.json();
    
    return AppointmentsService.list(filters);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}
