import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  CalendarX, 
  AlertTriangle, 
  UserX, 
  Package, 
  Utensils, 
  AlertCircle,
  CheckCircle,
  Eye,
  CheckCheck
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { OperationalAlert } from '../../../types/dashboard.types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertDetailModal } from '../AlertDetailModal';
import { toast } from 'sonner';

interface Props {
  alerts: OperationalAlert[];
  onResolve?: (alertId: string, resolution?: string) => void;
  onRefresh?: () => void;
}

export function SpaOperationalAlerts({ alerts, onResolve, onRefresh }: Props) {
  const [selectedAlert, setSelectedAlert] = useState<OperationalAlert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getAlertConfig = (type: OperationalAlert['type']) => {
    const configs = {
      DELAYED_APPOINTMENT: {
        icon: Clock,
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
      },
      SCHEDULE_GAP: {
        icon: CalendarX,
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
      },
      OVERBOOKED_TECHNICIAN: {
        icon: AlertTriangle,
        bgColor: 'bg-red-500/10',
        iconColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      },
      NO_SHOW: {
        icon: UserX,
        bgColor: 'bg-amber-500/10',
        iconColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
      },
      LOW_SUPPLIES: {
        icon: Package,
        bgColor: 'bg-purple-500/10',
        iconColor: 'text-purple-400',
        borderColor: 'border-purple-500/30',
      },
      // Fallbacks para tipos de restaurant
      DELAYED_ORDER: {
        icon: Clock,
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
      },
      OLD_ORDER: {
        icon: Clock,
        bgColor: 'bg-red-500/10',
        iconColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      },
      LONG_TABLE: {
        icon: Utensils,
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
      },
      LOW_STOCK: {
        icon: AlertCircle,
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

  const handleViewDetails = (alert: OperationalAlert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const handleResolve = (alertId: string, resolution?: string) => {
    // Si hay callback personalizado, usarlo
    if (onResolve) {
      onResolve(alertId, resolution);
    }

    // Mostrar toast
    const alert = alerts.find(a => a.id === alertId);
    toast.success(`Alerta resuelta: ${alert?.title || 'Alerta'}`, {
      description: resolution || 'Se ha marcado la alerta como resuelta',
      duration: 3000,
    });

    // Refrescar datos si hay callback
    onRefresh?.();
  };

  const handleQuickResolve = (alert: OperationalAlert, e: React.MouseEvent) => {
    e.stopPropagation();
    handleResolve(alert.id);
  };

  return (
    <>
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
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
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
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
                  className={`p-4 ${config.bgColor} border ${config.borderColor} rounded-xl hover:border-opacity-60 transition-all cursor-pointer group`}
                  onClick={() => handleViewDetails(alert)}
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
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(alert.timestamp)}</span>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(alert);
                            }}
                            className="px-3 py-1.5 bg-background hover:bg-foreground/10 rounded-lg text-xs font-medium text-foreground transition-colors flex items-center space-x-1"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ver detalles</span>
                          </button>
                          <button 
                            onClick={(e) => handleQuickResolve(alert, e)}
                            className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-xs font-medium text-green-400 transition-colors flex items-center space-x-1"
                            title="Marcar como resuelta"
                          >
                            <CheckCheck className="w-3 h-3" />
                            <span>Resolver</span>
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

      {/* Modal de Detalles */}
      <AlertDetailModal
        alert={selectedAlert}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAlert(null);
        }}
        onResolve={(alertId, resolution) => {
          handleResolve(alertId, resolution);
          setShowDetailModal(false);
          setSelectedAlert(null);
        }}
      />
    </>
  );
}