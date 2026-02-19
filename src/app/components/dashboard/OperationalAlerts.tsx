'use client';

import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { OperationalAlert } from '../../types/dashboard.types';
import { useState, useEffect } from 'react';
import { AlertDetailModal } from './AlertDetailModal';
import { AllAlertsModal } from './AllAlertsModal';

interface OperationalAlertsProps {
  alerts: OperationalAlert[];
}

export function OperationalAlerts({ alerts }: OperationalAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<OperationalAlert | null>(null);
  const [visibleAlerts, setVisibleAlerts] = useState<OperationalAlert[]>(alerts);
  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);

  // Sincronizar con las alertas del props
  useEffect(() => {
    setVisibleAlerts(alerts);
  }, [alerts]);

  // Función para manejar cuando se resuelve una alerta
  const handleResolveAlert = (alertId: string) => {
    setVisibleAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    setSelectedAlert(null);
  };

  // Función para seleccionar una alerta desde el modal de todas las alertas
  const handleSelectAlertFromAllModal = (alert: OperationalAlert) => {
    setShowAllAlertsModal(false); // Primero cerrar el modal de todas las alertas
    setTimeout(() => {
      setSelectedAlert(alert); // Luego abrir el modal de detalle individual
    }, 100); // Pequeño delay para que la animación sea suave
  };

  const getSeverityConfig = (severity: OperationalAlert['severity']) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: LucideIcons.AlertTriangle,
          iconColor: 'text-red-400',
          badge: 'bg-red-500',
          label: 'Urgente',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: LucideIcons.AlertCircle,
          iconColor: 'text-yellow-400',
          badge: 'bg-yellow-500',
          label: 'Atención',
        };
      case 'low':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: LucideIcons.Info,
          iconColor: 'text-blue-400',
          badge: 'bg-blue-500',
          label: 'Info',
        };
    }
  };

  const getTypeIcon = (type: OperationalAlert['type']) => {
    switch (type) {
      case 'DELAYED_ORDER':
        return LucideIcons.Clock;
      case 'OLD_ORDER':
        return LucideIcons.Timer;
      case 'LONG_TABLE':
        return LucideIcons.Users;
      case 'LOW_STOCK':
        return LucideIcons.PackageX;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes === 1) return 'Hace 1 min';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours}h`;
  };

  const highPriorityAlerts = visibleAlerts.filter(a => a.severity === 'high');
  const otherAlerts = visibleAlerts.filter(a => a.severity !== 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/50">
            <LucideIcons.Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Alertas Operativas</h2>
            <p className="text-sm text-muted-foreground">
              {visibleAlerts.length === 0 ? 'No hay alertas activas' : `${visibleAlerts.length} alertas activas`}
            </p>
          </div>
        </div>

        {/* Badges de resumen */}
        {visibleAlerts.length > 0 && (
          <div className="flex items-center space-x-2">
            {highPriorityAlerts.length > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-sm font-semibold text-red-400">URGENTE: {highPriorityAlerts.length}</span>
              </div>
            )}
            {otherAlerts.length > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-card border border-border flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">OTRAS: {otherAlerts.length}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de Alertas */}
      <div className="bg-card/50 rounded-2xl border border-border p-6">
        {visibleAlerts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <LucideIcons.CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Todo bajo control</h3>
            <p className="text-sm text-muted-foreground">No hay alertas operativas en este momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {visibleAlerts.map((alert, index) => {
                const config = getSeverityConfig(alert.severity);
                const SeverityIcon = config.icon;
                const TypeIcon = getTypeIcon(alert.type);

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative group rounded-xl border ${config.border} ${config.bg} p-4 hover:shadow-lg transition-all cursor-pointer`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Ícono de Severidad */}
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.badge}/20 flex items-center justify-center flex-shrink-0`}>
                        <SeverityIcon className={`w-5 h-5 ${config.iconColor}`} />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold text-foreground">{alert.title}</h3>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full ${config.badge} text-white text-xs font-semibold`}>
                            {config.label}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{alert.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <LucideIcons.Clock className="w-3 h-3" />
                            <span>{formatTime(alert.timestamp)}</span>
                            {alert.relatedId && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                <span className="font-mono">{alert.relatedId}</span>
                              </>
                            )}
                          </div>

                          <button
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-accent border border-border text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAlert(alert);
                            }}
                          >
                            <LucideIcons.Eye className="w-3.5 h-3.5" />
                            <span>Ver detalles</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Indicador de hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-colors pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Ver todas */}
        {visibleAlerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <button className="w-full py-2.5 px-4 rounded-lg bg-secondary hover:bg-accent text-foreground text-sm font-medium transition-colors flex items-center justify-center space-x-2" onClick={() => setShowAllAlertsModal(true)}>
              <span>Ver detalles de todas las alertas</span>
              <LucideIcons.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalles de alerta */}
      {selectedAlert && (
        <AlertDetailModal 
          alert={selectedAlert} 
          onClose={() => setSelectedAlert(null)} 
          onResolve={handleResolveAlert} 
        />
      )}

      {/* Modal de todas las alertas */}
      {showAllAlertsModal && (
        <AllAlertsModal 
          alerts={visibleAlerts} 
          isOpen={showAllAlertsModal}
          onClose={() => setShowAllAlertsModal(false)} 
          onSelectAlert={handleSelectAlertFromAllModal}
          onResolve={handleResolveAlert} 
        />
      )}
    </div>
  );
}