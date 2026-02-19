'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Card } from '../../ui/card';
import { SpaRealTimeMetrics as SpaMetricsType } from '../../../types/dashboard.types';

interface Props {
  metrics: SpaMetricsType;
}

export function SpaRealTimeMetrics({ metrics }: Props) {
  const cards = [
    {
      id: 'appointments_today',
      label: 'Citas de Hoy',
      value: metrics.appointmentsToday,
      icon: LucideIcons.Calendar,
      color: 'purple',
      bgGradient: 'from-purple-500/20 to-purple-600/10',
      iconBg: 'bg-purple-500/20',
      textColor: 'text-purple-400',
    },
    {
      id: 'in_progress',
      label: 'En Curso',
      value: metrics.appointmentsInProgress,
      icon: LucideIcons.Clock,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-blue-600/10',
      iconBg: 'bg-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      id: 'upcoming_2h',
      label: 'Próximas 2 Horas',
      value: metrics.upcomingAppointments,
      icon: LucideIcons.CalendarClock,
      color: 'orange',
      bgGradient: 'from-orange-500/20 to-orange-600/10',
      iconBg: 'bg-orange-500/20',
      textColor: 'text-orange-400',
    },
    {
      id: 'cancelled_today',
      label: 'Canceladas Hoy',
      value: metrics.cancelledToday,
      icon: LucideIcons.XCircle,
      color: 'red',
      bgGradient: 'from-red-500/20 to-red-600/10',
      iconBg: 'bg-red-500/20',
      textColor: 'text-red-400',
    },
    {
      id: 'active_staff',
      label: 'Personal Activo',
      value: metrics.activeStaff,
      icon: LucideIcons.Users,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/10',
      iconBg: 'bg-green-500/20',
      textColor: 'text-green-400',
    },
    {
      id: 'schedule_occupation',
      label: 'Ocupación Agenda',
      value: `${metrics.scheduleOccupation}%`,
      icon: LucideIcons.TrendingUp,
      color: 'cyan',
      bgGradient: 'from-cyan-500/20 to-cyan-600/10',
      iconBg: 'bg-cyan-500/20',
      textColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className={`bg-gradient-to-br ${card.bgGradient} border-border p-4 hover:scale-105 transition-transform duration-300`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-xl ${card.iconBg}`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}