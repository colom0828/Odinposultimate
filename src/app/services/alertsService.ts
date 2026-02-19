/**
 * ODIN POS - Alerts Service
 * Servicio para gestión de alertas operativas
 */

import { OperationalAlert } from '../types/dashboard.types';

// ========================================
// STORAGE KEY
// ========================================

const STORAGE_KEY = 'odin_alerts_resolved';

// ========================================
// TIPOS
// ========================================

interface ResolvedAlert {
  id: string;
  resolvedAt: string;
  resolvedBy?: string;
  resolution?: string;
}

// ========================================
// LOCAL STORAGE HELPERS
// ========================================

function getResolvedAlertsFromStorage(): ResolvedAlert[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading resolved alerts from storage:', error);
  }
  
  return [];
}

function saveResolvedAlertsToStorage(resolved: ResolvedAlert[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
  } catch (error) {
    console.error('Error saving resolved alerts to storage:', error);
  }
}

// ========================================
// ALERT DETECTION DESDE DATOS REALES
// ========================================

/**
 * Detecta alertas desde las citas del sistema
 */
export function detectAlertsFromAppointments(appointments: any[]): OperationalAlert[] {
  const alerts: OperationalAlert[] = [];
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Filtrar solo citas de hoy
  const todayAppointments = appointments.filter(apt => apt.date === today);

  // 1. Detectar citas retrasadas (cita confirmada pero pasó su hora)
  todayAppointments.forEach(apt => {
    if (apt.status === 'confirmed' || apt.status === 'scheduled') {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      
      const delayMinutes = Math.floor((now.getTime() - aptTime.getTime()) / (1000 * 60));
      
      if (delayMinutes > 15) { // Retrasada si pasó más de 15 min
        alerts.push({
          id: `delayed-${apt.id}`,
          type: 'DELAYED_APPOINTMENT',
          severity: delayMinutes > 30 ? 'high' : 'medium',
          title: `Cita retrasada - ${apt.technicianName || 'Sala'}`,
          description: `${apt.customerName}: ${apt.serviceName}. Cliente esperando ${delayMinutes} minutos.`,
          timestamp: aptTime.toISOString(),
        });
      }
    }
  });

  // 2. Detectar no-shows (cita confirmada, pasó 30 min y no inició)
  todayAppointments.forEach(apt => {
    if (apt.status === 'confirmed') {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      
      const delayMinutes = Math.floor((now.getTime() - aptTime.getTime()) / (1000 * 60));
      
      if (delayMinutes > 30) {
        alerts.push({
          id: `noshow-${apt.id}`,
          type: 'NO_SHOW',
          severity: 'medium',
          title: 'Cliente no se presentó',
          description: `Cita ${apt.time} - ${apt.customerName} no llegó a su cita de ${apt.serviceName}.`,
          timestamp: new Date(aptTime.getTime() + 30 * 60 * 1000).toISOString(),
        });
      }
    }
  });

  // 3. Detectar huecos en agenda (técnico sin citas en próxima hora)
  const technicians = [...new Set(todayAppointments.map(apt => apt.technicianName).filter(Boolean))];
  
  technicians.forEach(techName => {
    const techAppointments = todayAppointments.filter(
      apt => apt.technicianName === techName && apt.status !== 'cancelled'
    );
    
    // Buscar próxima cita del técnico
    const nextApt = techAppointments.find(apt => {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      return aptTime > now;
    });

    if (nextApt) {
      const [hours, minutes] = nextApt.time.split(':').map(Number);
      const nextAptTime = new Date(now);
      nextAptTime.setHours(hours, minutes, 0, 0);
      
      const gapHours = (nextAptTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (gapHours > 1.5) {
        alerts.push({
          id: `gap-${techName}`,
          type: 'SCHEDULE_GAP',
          severity: 'low',
          title: `Hueco en agenda - ${techName}`,
          description: `Espacio de ${Math.round(gapHours * 60)} min libre entre ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} y ${nextApt.time}.`,
          timestamp: now.toISOString(),
        });
      }
    }
  });

  // 4. Detectar técnico sobrecargado (más de 6 citas en el día)
  technicians.forEach(techName => {
    const techAppointments = todayAppointments.filter(
      apt => apt.technicianName === techName && apt.status !== 'cancelled'
    );
    
    if (techAppointments.length > 6) {
      const consecutive = techAppointments.filter(apt => {
        const [hours, minutes] = apt.time.split(':').map(Number);
        const aptTime = new Date(now);
        aptTime.setHours(hours, minutes, 0, 0);
        return aptTime > now;
      }).length;

      if (consecutive >= 4) {
        alerts.push({
          id: `overbooked-${techName}`,
          type: 'OVERBOOKED_TECHNICIAN',
          severity: 'high',
          title: 'Personal sobrecargado',
          description: `${techName}: ${consecutive} citas consecutivas sin descanso. Riesgo de retrasos.`,
          timestamp: now.toISOString(),
        });
      }
    }
  });

  return alerts;
}

// ========================================
// CRUD OPERATIONS
// ========================================

export const AlertsService = {
  /**
   * Obtener alertas filtradas (excluye las resueltas)
   */
  getActive(allAlerts: OperationalAlert[]): OperationalAlert[] {
    const resolved = getResolvedAlertsFromStorage();
    const resolvedIds = new Set(resolved.map(r => r.id));
    
    return allAlerts.filter(alert => !resolvedIds.has(alert.id));
  },

  /**
   * Marcar alerta como resuelta
   */
  resolve(alertId: string, resolution?: string, resolvedBy?: string): void {
    const resolved = getResolvedAlertsFromStorage();
    
    const newResolved: ResolvedAlert = {
      id: alertId,
      resolvedAt: new Date().toISOString(),
      resolvedBy,
      resolution,
    };
    
    resolved.push(newResolved);
    saveResolvedAlertsToStorage(resolved);
  },

  /**
   * Obtener historial de alertas resueltas
   */
  getResolvedHistory(): ResolvedAlert[] {
    return getResolvedAlertsFromStorage();
  },

  /**
   * Limpiar alertas resueltas antiguas (más de 7 días)
   */
  cleanOldResolved(): void {
    const resolved = getResolvedAlertsFromStorage();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const filtered = resolved.filter(r => {
      const resolvedDate = new Date(r.resolvedAt);
      return resolvedDate > sevenDaysAgo;
    });
    
    saveResolvedAlertsToStorage(filtered);
  },

  /**
   * Re-activar alerta resuelta (deshacer)
   */
  unresolve(alertId: string): void {
    const resolved = getResolvedAlertsFromStorage();
    const filtered = resolved.filter(r => r.id !== alertId);
    saveResolvedAlertsToStorage(filtered);
  },
};
