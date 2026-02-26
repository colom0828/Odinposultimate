import { 
  User, 
  Scissors, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Edit
} from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Appointment, AppointmentStatus } from '../../types/appointments.types';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit?: () => void;
  onChangeStatus?: (status: AppointmentStatus) => void;
}

export function AppointmentDetailsModal({ 
  isOpen, 
  onClose, 
  appointment,
  onEdit,
  onChangeStatus 
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

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

  const renderStatusIcon = (status: AppointmentStatus, className: string = "w-6 h-6") => {
    switch (status) {
      case 'scheduled':
        return <CalendarIcon className={className} />;
      case 'confirmed':
        return <CheckCircle className={className} />;
      case 'in_progress':
        return <Play className={className} />;
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

  const statusConfig = getStatusConfig(appointment.status);

  const calculateEndTime = () => {
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + appointment.duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Cita"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            {onChangeStatus && appointment.status === 'scheduled' && (
              <Button
                onClick={() => onChangeStatus('confirmed')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar
              </Button>
            )}
            {onChangeStatus && appointment.status === 'confirmed' && (
              <Button
                onClick={() => onChangeStatus('in_progress')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
            )}
            {onChangeStatus && appointment.status === 'in_progress' && (
              <Button
                onClick={() => onChangeStatus('completed')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completar
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                className="border-border bg-[var(--odin-input-bg)] text-foreground"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="border-border bg-[var(--odin-input-bg)] text-foreground"
            >
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Estado */}
        <div className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            {renderStatusIcon(appointment.status, `w-6 h-6 ${statusConfig.color.split(' ')[1]}`)}
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge className={statusConfig.color + ' text-base'}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ID de Cita</p>
            <p className="text-sm font-mono text-foreground">{appointment.id}</p>
          </div>
        </div>

        {/* Cliente */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-foreground">Información del Cliente</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 border border-border rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Nombre</p>
              <p className="text-base font-medium text-foreground">{appointment.clientName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
              <p className="text-base font-medium text-foreground">{appointment.clientPhone}</p>
            </div>
            {appointment.clientEmail && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-base font-medium text-foreground">{appointment.clientEmail}</p>
              </div>
            )}
          </div>
        </div>

        {/* Servicio */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-foreground">Detalles del Servicio</h3>
          </div>
          
          <div className="p-4 bg-background/50 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-base font-semibold text-foreground">{appointment.serviceName}</p>
                <p className="text-sm text-muted-foreground">{appointment.serviceCategory}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Duración</p>
                <p className="text-base font-bold text-purple-400">{appointment.duration} min</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Especialista: <span className="text-foreground font-medium">{appointment.technicianName}</span></span>
            </div>
            
            {appointment.room && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span>Ubicación: <span className="text-foreground font-medium">{appointment.room}</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-foreground">Fecha y Hora</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background/50 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Fecha</p>
              <p className="text-base font-medium text-foreground">
                {new Date(appointment.date).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="p-4 bg-background/50 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Horario</p>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <p className="text-base font-medium text-foreground">
                  {appointment.time} - {calculateEndTime()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {appointment.notes && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">Notas</h3>
            </div>
            
            <div className="p-4 bg-background/50 border border-border rounded-lg">
              <p className="text-sm text-foreground">{appointment.notes}</p>
            </div>
          </div>
        )}

        {/* Razón de cancelación */}
        {appointment.cancelReason && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-foreground">Razón de Cancelación</h3>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{appointment.cancelReason}</p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="mb-1">Creada</p>
              <p className="text-foreground">
                {new Date(appointment.createdAt).toLocaleString('es-ES')}
              </p>
            </div>
            {appointment.updatedAt && (
              <div>
                <p className="mb-1">Última actualización</p>
                <p className="text-foreground">
                  {new Date(appointment.updatedAt).toLocaleString('es-ES')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}