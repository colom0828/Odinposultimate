'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  List, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  CalendarX,
  Scissors,
  User,
  Play,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { AppointmentFormModal } from '../../components/citas/AppointmentFormModal';
import { AppointmentDetailsModal } from '../../components/citas/AppointmentDetailsModal';
import { AppointmentsService } from '../../services/appointmentsService';
import { getEmployeesByBusinessType } from '../../data/employeesMockData';
import { BusinessType } from '../../types/config.types';
import type { Appointment, AppointmentStatus } from '../../types/appointments.types';
import { toast } from 'sonner';

export default function CitasPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterTechnician, setFilterTechnician] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | ''>('');

  // Obtener técnicos de Spa
  const technicians = useMemo(() => 
    getEmployeesByBusinessType(BusinessType.SPA).filter(e => 
      e.role === 'estilista' || e.role === 'manicurista' || e.role === 'masajista' || e.role === 'cosmetologo'
    ),
    []
  );

  // Cargar citas
  const refreshAppointments = useCallback(() => {
    const updated = AppointmentsService.list({ date: selectedDate });
    setAppointments(updated);
  }, [selectedDate]);

  // Cargar al montar y cuando cambie la fecha
  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAppointments();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAppointments]);

  // Filtrar citas
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (filterTechnician && apt.technicianId !== filterTechnician) return false;
      if (filterStatus && apt.status !== filterStatus) return false;
      return true;
    });
  }, [appointments, filterTechnician, filterStatus]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;

    let updated: Appointment | null = null;

    if (status === 'confirmed') {
      updated = AppointmentsService.confirm(id);
      toast.success('Cita confirmada', {
        description: `${appointment.clientName} - ${appointment.serviceName}`,
      });
    } else if (status === 'in_progress') {
      updated = AppointmentsService.start(id);
      toast.success('Cita iniciada', {
        description: `${appointment.clientName} - ${appointment.serviceName}`,
      });
    } else if (status === 'completed') {
      updated = AppointmentsService.complete(id);
      toast.success('Cita completada', {
        description: `${appointment.clientName} - ${appointment.serviceName}`,
      });
    } else if (status === 'cancelled') {
      updated = AppointmentsService.cancel(id, 'Cancelada por usuario');
      toast.error('Cita cancelada', {
        description: `${appointment.clientName} - ${appointment.serviceName}`,
      });
    } else if (status === 'no_show') {
      updated = AppointmentsService.markNoShow(id);
      toast.warning('Cliente no se presentó', {
        description: `${appointment.clientName} - ${appointment.serviceName}`,
      });
    }

    if (updated) {
      refreshAppointments();
    }
  };

  const handleDeleteAppointment = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;

    if (confirm(`¿Está seguro de eliminar la cita de ${appointment.clientName}?`)) {
      const success = AppointmentsService.delete(id);
      if (success) {
        toast.success('Cita eliminada');
        refreshAppointments();
      }
    }
  };

  const getStatusConfig = (status: AppointmentStatus) => {
    const configs = {
      scheduled: { label: 'Programada', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
      confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      in_progress: { label: 'En Curso', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      completed: { label: 'Completada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      cancelled: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      no_show: { label: 'No se presentó', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    };
    return configs[status] || configs.scheduled;
  };

  const renderStatusIcon = (status: AppointmentStatus, className: string = "w-3 h-3 mr-1") => {
    switch (status) {
      case 'scheduled':
        return <CalendarIcon className={className} />;
      case 'confirmed':
        return <CheckCircle className={className} />;
      case 'in_progress':
        return <Clock className={className} />;
      case 'completed':
        return <CheckCircle2 className={className} />;
      case 'cancelled':
        return <XCircle className={className} />;
      case 'no_show':
        return <AlertTriangle className={className} />;
      default:
        return <CalendarIcon className={className} />;
    }
  };

  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const inProgress = appointments.filter(a => a.status === 'in_progress').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    return { total, confirmed, inProgress, completed, cancelled };
  }, [appointments]);

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
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Citas / Agenda</h1>
          <p className="text-[var(--odin-text-secondary)]">Gestión de citas y horarios</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Toggle Vista */}
          <div className="flex items-center space-x-2 p-1 bg-card border border-border rounded-lg">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'calendar' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => {
              setSelectedAppointment(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Hoy', value: stats.total, icon: CalendarIcon, color: 'purple' },
          { label: 'Confirmadas', value: stats.confirmed, icon: CheckCircle, color: 'blue' },
          { label: 'En Curso', value: stats.inProgress, icon: Clock, color: 'green' },
          { label: 'Completadas', value: stats.completed, icon: CheckCircle2, color: 'emerald' },
          { label: 'Canceladas', value: stats.cancelled, icon: XCircle, color: 'red' },
        ].map((kpi) => (
          <Card key={kpi.label} className={`bg-card border-${kpi.color}-500/20 p-4`}>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
            </div>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className={`text-2xl font-bold text-${kpi.color}-400`}>{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className="bg-card border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fecha</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-[var(--odin-input-bg)] border-border text-foreground"
            />
          </div>

          {/* Técnico */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Estilista / Especialista</label>
            <select
              value={filterTechnician}
              onChange={(e) => setFilterTechnician(e.target.value)}
              className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2"
            >
              <option value="">Todo el personal</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | '')}
              className="w-full bg-[var(--odin-input-bg)] border border-border text-foreground rounded-lg px-3 py-2"
            >
              <option value="">Todos los estados</option>
              <option value="scheduled">Programada</option>
              <option value="confirmed">Confirmada</option>
              <option value="in_progress">En Curso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
              <option value="no_show">No se presentó</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Citas */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Citas del {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">No hay citas</p>
            <p className="text-sm text-muted-foreground">No se encontraron citas para los filtros seleccionados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((apt, index) => {
              const statusConfig = getStatusConfig(apt.status);
              const isInProgress = apt.status === 'in_progress';
              
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`grid grid-cols-[80px_1fr_200px_140px_auto] gap-4 items-center p-4 bg-background/50 border rounded-xl transition-all group ${
                    isInProgress 
                      ? 'border-green-500/50 shadow-lg shadow-green-500/20' 
                      : 'border-border hover:border-purple-500/50'
                  }`}
                >
                  {/* Hora */}
                  <div className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                    isInProgress ? 'bg-green-500/20' : 'bg-purple-500/10'
                  }`}>
                    <Clock className={`w-4 h-4 mb-1 ${
                      isInProgress ? 'text-green-400 animate-pulse' : 'text-purple-400'
                    }`} />
                    <span className={`text-sm font-bold ${
                      isInProgress ? 'text-green-400' : 'text-purple-400'
                    }`}>{apt.time}</span>
                  </div>

                  {/* Cliente + Servicio */}
                  <div>
                    <p className="font-semibold text-foreground mb-1">{apt.clientName}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Scissors className="w-4 h-4" />
                      <span>{apt.serviceName}</span>
                      <span className="text-xs">·</span>
                      <span>{apt.duration} min</span>
                    </div>
                  </div>

                  {/* Estilista/Especialista */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{apt.technicianName}</p>
                      {apt.room && <p className="text-xs text-muted-foreground truncate">{apt.room}</p>}
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center justify-center">
                    <Badge className={statusConfig.color}>
                      {renderStatusIcon(apt.status)}
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2">
                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'confirmed')}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Confirmar"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'in_progress')}
                        className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Iniciar"
                      >
                        <Play className="w-4 h-4 text-green-400" />
                      </button>
                    )}
                    {apt.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                        className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors"
                        title="Completar"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </button>
                    )}
                    {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'cancelled')}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Cancelar"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsModalOpen(true);
                      }}
                      className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground hover:text-purple-400" />
                    </button>
                    {(apt.status === 'cancelled' || apt.status === 'completed') && (
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal Nueva/Editar Cita */}
      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={refreshAppointments}
        appointment={selectedAppointment}
      />

      {/* Modal Detalles Cita */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </motion.div>
  );
}