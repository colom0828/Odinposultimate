'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  User,
  MapPin,
  FileText,
  Tag,
  TrendingUp
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { OperationalAlert } from '../../types/dashboard.types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  alert: OperationalAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (alertId: string, resolution?: string) => void;
}

export function AlertDetailModal({ alert, isOpen, onClose, onResolve }: Props) {
  const [resolution, setResolution] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  if (!alert) return null;

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DELAYED_APPOINTMENT: 'Cita Retrasada',
      SCHEDULE_GAP: 'Hueco en Agenda',
      OVERBOOKED_TECHNICIAN: 'Personal Sobrecargado',
      NO_SHOW: 'Cliente No se Presentó',
      LOW_SUPPLIES: 'Insumos Bajos',
      DELAYED_ORDER: 'Pedido Retrasado',
      OLD_ORDER: 'Pedido Antiguo',
      LONG_TABLE: 'Mesa Mucho Tiempo',
      LOW_STOCK: 'Stock Bajo',
    };
    return labels[type] || type;
  };

  const getSeverityConfig = (severity: 'high' | 'medium' | 'low') => {
    const configs = {
      high: { 
        label: 'Alta', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        gradient: 'from-red-500/20 to-red-600/10'
      },
      medium: { 
        label: 'Media', 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        gradient: 'from-orange-500/20 to-orange-600/10'
      },
      low: { 
        label: 'Baja', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        gradient: 'from-blue-500/20 to-blue-600/10'
      },
    };
    return configs[severity];
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

  const handleResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      onResolve(alert.id, resolution || undefined);
      setIsResolving(false);
      setResolution('');
      onClose();
    }, 500);
  };

  const severityConfig = getSeverityConfig(alert.severity);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <Card 
              className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 border-b border-border bg-gradient-to-br ${severityConfig.gradient}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-background/50 rounded-xl">
                      <AlertTriangle className="w-8 h-8 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-foreground">
                          Detalle de Alerta
                        </h2>
                        <Badge className={severityConfig.color}>
                          Prioridad {severityConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getAlertTypeLabel(alert.type)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-background/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Info Principal */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Título</span>
                    </label>
                    <p className="text-lg font-semibold text-foreground">{alert.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Descripción</span>
                    </label>
                    <p className="text-foreground">{alert.description}</p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Clock className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tiempo transcurrido</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatTime(alert.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Tag className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo de alerta</p>
                        <p className="text-sm font-semibold text-foreground">
                          {getAlertTypeLabel(alert.type)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Prioridad</p>
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {severityConfig.label}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha y hora</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(alert.timestamp).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones Sugeridas */}
                {alert.type === 'DELAYED_APPOINTMENT' && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Acciones sugeridas</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400">•</span>
                        <span>Comunicarse con el cliente para avisar del retraso</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400">•</span>
                        <span>Re-agendar la siguiente cita si es necesario</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400">•</span>
                        <span>Actualizar el estado de la cita en el sistema</span>
                      </li>
                    </ul>
                  </div>
                )}

                {alert.type === 'NO_SHOW' && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      <span>Acciones sugeridas</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-400">•</span>
                        <span>Llamar al cliente para verificar la ausencia</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-400">•</span>
                        <span>Marcar la cita como "No se presentó"</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-400">•</span>
                        <span>Abrir el espacio para walk-ins</span>
                      </li>
                    </ul>
                  </div>
                )}

                {alert.type === 'LOW_SUPPLIES' && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Acciones sugeridas</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-400">•</span>
                        <span>Contactar al proveedor para realizar pedido urgente</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-400">•</span>
                        <span>Verificar stock de productos alternativos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-400">•</span>
                        <span>Actualizar inventario en el sistema</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Notas de Resolución */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Notas de resolución (opcional)</span>
                  </label>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe las acciones tomadas para resolver esta alerta..."
                    className="min-h-[100px] bg-background border-border"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-background/50 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-border"
                >
                  Cancelar
                </Button>
                
                <Button
                  onClick={handleResolve}
                  disabled={isResolving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isResolving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Resolviendo...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Resuelta
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
