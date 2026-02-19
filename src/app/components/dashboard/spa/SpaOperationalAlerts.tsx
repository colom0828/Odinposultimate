'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { OperationalAlert } from '../../../types/dashboard.types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  alerts: OperationalAlert[];
}

export function SpaOperationalAlerts({ alerts }: Props) {
  const getAlertConfig = (type: OperationalAlert['type']) => {
    const configs = {
      DELAYED_APPOINTMENT: {
        icon: LucideIcons.Clock,
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
      },
      SCHEDULE_GAP: {
        icon: LucideIcons.CalendarX,
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
      },
      OVERBOOKED_TECHNICIAN: {
        icon: LucideIcons.AlertTriangle,
        bgColor: 'bg-red-500/10',
        iconColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      },
      NO_SHOW: {
        icon: LucideIcons.UserX,
        bgColor: 'bg-amber-500/10',
        iconColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
      },
      LOW_SUPPLIES: {
        icon: LucideIcons.Package,
        bgColor: 'bg-purple-500/10',
        iconColor: 'text-purple-400',
        borderColor: 'border-purple-500/30',
      },
      // Fallbacks para tipos de restaurant
      DELAYED_ORDER: {
        icon: LucideIcons.Clock,
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
      },
      OLD_ORDER: {
        icon: LucideIcons.Clock,
        bgColor: 'bg-red-500/10',
        iconColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      },
      LONG_TABLE: {
        icon: LucideIcons.Utensils,
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
      },
      LOW_STOCK: {
        icon: LucideIcons.AlertCircle,
        bgColor: 'bg-purple-500/10',
        iconColor: 'text-purple-400',
        borderColor: 'border-purple-500/30',
      },
    };
    return configs[type] || configs.DELAYED_APPOINTMENT;
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    const badges = {
      high: { label: 'Alta', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      medium: { label: 'Media', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      low: { label: 'Baja', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    };
    return badges[severity];
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: es 
      });
    } catch {
      return 'Hace un momento';
    }
  };

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <LucideIcons.AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Alertas Operativas</h2>
            <p className="text-sm text-muted-foreground">Requieren atención</p>
          </div>
        </div>
        
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          {alerts.length} alertas
        </Badge>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <LucideIcons.CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Todo en orden</p>
          <p className="text-sm text-muted-foreground">No hay alertas operativas en este momento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const config = getAlertConfig(alert.type);
            const severity = getSeverityBadge(alert.severity);
            const AlertIcon = config.icon;
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 ${config.bgColor} border ${config.borderColor} rounded-xl`}
              >
                <div className="flex items-start space-x-4">
                  {/* Ícono */}
                  <div className={`p-3 bg-background/50 rounded-lg`}>
                    <AlertIcon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-1">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                      <Badge className={severity.color}>
                        {severity.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <LucideIcons.Clock className="w-3 h-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 bg-background hover:bg-foreground/10 rounded-lg text-xs font-medium text-foreground transition-colors">
                          Ver detalles
                        </button>
                        <button className="px-3 py-1.5 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-xs font-medium text-foreground transition-colors">
                          Resolver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}