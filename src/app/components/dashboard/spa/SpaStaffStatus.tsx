import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { SpaTechnician } from '../../../types/dashboard.types';

interface Props {
  staff: SpaTechnician[];
}

export function SpaStaffStatus({ staff }: Props) {
  const getStatusConfig = (status: SpaTechnician['status']) => {
    const configs = {
      available: {
        label: 'Disponible',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: LucideIcons.CheckCircle,
        dotColor: 'bg-green-400',
      },
      busy: {
        label: 'Ocupado',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: LucideIcons.Clock,
        dotColor: 'bg-blue-400',
      },
      break: {
        label: 'En descanso',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        icon: LucideIcons.Coffee,
        dotColor: 'bg-orange-400',
      },
      offline: {
        label: 'Fuera de turno',
        color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        icon: LucideIcons.XCircle,
        dotColor: 'bg-slate-400',
      },
    };
    return configs[status] || configs.offline;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-400';
    if (efficiency >= 85) return 'text-blue-400';
    if (efficiency >= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  // Agrupar por estado
  const availableStaff = staff.filter(s => s.status === 'available');
  const busyStaff = staff.filter(s => s.status === 'busy');
  const breakStaff = staff.filter(s => s.status === 'break');
  const offlineStaff = staff.filter(s => s.status === 'offline');

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <LucideIcons.UserCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Estado del Personal</h2>
            <p className="text-sm text-muted-foreground">Técnicos y personal operativo</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-green-400">{availableStaff.length} disponibles</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium text-blue-400">{busyStaff.length} ocupados</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {staff.map((member, index) => {
          const statusConfig = getStatusConfig(member.status);
          const StatusIcon = statusConfig.icon;
          const efficiencyColor = getEfficiencyColor(member.efficiency);
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 bg-background/50 border border-border rounded-xl hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <LucideIcons.User className="w-6 h-6 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${statusConfig.dotColor} border-2 border-background`} />
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.currentTask && (
                      <div className="flex items-center space-x-2 mt-2 text-sm">
                        <LucideIcons.Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-muted-foreground">{member.currentTask}</span>
                      </div>
                    )}
                  </div>

                  {/* Métricas */}
                  <div className="hidden lg:grid grid-cols-3 gap-4">
                    {/* Citas hoy */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Citas Hoy</p>
                      <p className="text-lg font-bold text-foreground">{member.appointmentsToday}</p>
                    </div>

                    {/* Próxima disponible */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Disponible</p>
                      <p className="text-sm font-semibold text-cyan-400">{member.nextAvailable}</p>
                    </div>

                    {/* Eficiencia */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Eficiencia</p>
                      <p className={`text-lg font-bold ${efficiencyColor}`}>{member.efficiency}%</p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="hidden group-hover:flex items-center space-x-2">
                    <button className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors">
                      <LucideIcons.Calendar className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
                    </button>
                    <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                      <LucideIcons.MessageSquare className="w-4 h-4 text-muted-foreground hover:text-purple-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Resumen */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <LucideIcons.Users className="w-5 h-5 text-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{staff.length}</p>
            <p className="text-xs text-muted-foreground">Total Personal</p>
          </div>
          <div className="text-center">
            <LucideIcons.CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-400">{availableStaff.length}</p>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </div>
          <div className="text-center">
            <LucideIcons.Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-400">{busyStaff.length}</p>
            <p className="text-xs text-muted-foreground">Ocupados</p>
          </div>
          <div className="text-center">
            <LucideIcons.Coffee className="w-5 h-5 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-400">{breakStaff.length}</p>
            <p className="text-xs text-muted-foreground">En Descanso</p>
          </div>
        </div>
      </div>
    </Card>
  );
}