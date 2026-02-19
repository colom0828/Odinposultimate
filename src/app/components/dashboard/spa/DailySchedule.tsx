'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CalendarDays, 
  Clock, 
  Scissors, 
  User, 
  Eye, 
  Edit, 
  Calendar, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { DailyAppointment } from '../../../types/dashboard.types';
import { AppointmentDetailsModal } from '../../citas/AppointmentDetailsModal';
import { AppointmentFormModal } from '../../citas/AppointmentFormModal';
import { AppointmentsService } from '../../../services/appointmentsService';
import { toast } from 'sonner';

interface Props {
  appointments: DailyAppointment[];
  onRefresh?: () => void;
}

export function DailySchedule({ appointments, onRefresh }: Props) {
  const [selectedAppointment, setSelectedAppointment] = useState<DailyAppointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<DailyAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusConfig = (status: DailyAppointment['status']) => {
    const configs = {
      scheduled: {
        label: 'Programada',
        color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        icon: Calendar,
      },
      confirmed: {
        label: 'Confirmada',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: CheckCircle,
      },
      in_progress: {
        label: 'En Curso',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: Clock,
      },
      completed: {
        label: 'Completada',
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle2,
      },
      cancelled: {
        label: 'Cancelada',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
      },
      no_show: {
        label: 'No se presentó',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        icon: AlertTriangle,
      },
    };
    return configs[status] || configs.scheduled;
  };

  const handleViewDetails = (apt: DailyAppointment) => {
    setSelectedAppointment(apt);
    setShowDetailsModal(true);
  };

  const handleEdit = (apt: DailyAppointment) => {
    setEditingAppointment(apt);
    setShowEditModal(true);
  };

  const handleQuickStatusChange = (apt: DailyAppointment, newStatus: DailyAppointment['status']) => {
    try {
      // Actualizar en el servicio
      AppointmentsService.update(apt.id, { status: newStatus });
      toast.success(`Cita marcada como: ${getStatusConfig(newStatus).label}`);
      onRefresh?.();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <>
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <CalendarDays className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Agenda del Día</h2>
              <p className="text-sm text-muted-foreground">Próximas citas programadas</p>
            </div>
          </div>
          
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {appointments.length} citas
          </Badge>
        </div>

        <div className="space-y-3">
          {appointments.slice(0, 8).map((apt, index) => {
            const statusConfig = getStatusConfig(apt.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-xl hover:border-purple-500/50 transition-all group cursor-pointer"
                onClick={() => handleViewDetails(apt)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Hora */}
                  <div className="flex flex-col items-center justify-center min-w-[70px] p-3 bg-purple-500/10 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-400 mb-1" />
                    <span className="text-sm font-bold text-purple-400">{apt.time}</span>
                  </div>

                  {/* Cliente */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">{apt.client}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Scissors className="w-4 h-4" />
                      <span>{apt.service}</span>
                      <span className="text-xs">·</span>
                      <span>{apt.duration} min</span>
                    </div>
                  </div>

                  {/* Técnico */}
                  <div className="hidden lg:flex items-center space-x-2 min-w-[180px]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{apt.technicianName}</p>
                      {apt.room && <p className="text-xs text-muted-foreground">{apt.room}</p>}
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="hidden group-hover:flex items-center space-x-2 ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(apt);
                    }}
                    className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground hover:text-purple-400" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(apt);
                    }}
                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground hover:text-blue-400" />
                  </button>
                  {apt.status === 'confirmed' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickStatusChange(apt, 'in_progress');
                      }}
                      className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Iniciar"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-green-400" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No hay citas programadas para hoy</p>
          </div>
        )}

        {appointments.length > 8 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
              Ver todas las citas ({appointments.length}) →
            </button>
          </div>
        )}
      </Card>

      {/* Modales */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setEditingAppointment(selectedAppointment);
            setShowEditModal(true);
          }}
          onDelete={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
            onRefresh?.();
          }}
        />
      )}

      {editingAppointment && (
        <AppointmentFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingAppointment(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingAppointment(null);
            onRefresh?.();
          }}
          appointment={editingAppointment}
        />
      )}
    </>
  );
}