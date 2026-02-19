import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { OperationalAlert } from '../../types/dashboard.types';
import { toast } from 'sonner';

interface AlertDetailModalProps {
  alert: OperationalAlert | null;
  onClose: () => void;
  onResolve?: (alertId: string) => void;
}

export function AlertDetailModal({ alert, onClose, onResolve }: AlertDetailModalProps) {
  if (!alert) return null;

  const getSeverityConfig = (severity: OperationalAlert['severity']) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'from-red-600 to-red-700',
          icon: LucideIcons.AlertTriangle,
          iconColor: 'text-red-400',
          badge: 'bg-red-500',
          label: 'Urgente',
          borderColor: 'border-red-500/30',
        };
      case 'medium':
        return {
          bg: 'from-yellow-600 to-yellow-700',
          icon: LucideIcons.AlertCircle,
          iconColor: 'text-yellow-400',
          badge: 'bg-yellow-500',
          label: 'Atención',
          borderColor: 'border-yellow-500/30',
        };
      case 'low':
        return {
          bg: 'from-blue-600 to-blue-700',
          icon: LucideIcons.Info,
          iconColor: 'text-blue-400',
          badge: 'bg-blue-500',
          label: 'Info',
          borderColor: 'border-blue-500/30',
        };
    }
  };

  const getTypeInfo = (type: OperationalAlert['type']) => {
    switch (type) {
      case 'DELAYED_ORDER':
        return {
          icon: LucideIcons.Clock,
          label: 'Orden Retrasada',
          action: 'Verificar estado en cocina',
          color: 'text-orange-400',
        };
      case 'OLD_ORDER':
        return {
          icon: LucideIcons.Timer,
          label: 'Orden Antigua',
          action: 'Coordinar entrega inmediata',
          color: 'text-blue-400',
        };
      case 'LONG_TABLE':
        return {
          icon: LucideIcons.Users,
          label: 'Mesa Ocupada Largo Tiempo',
          action: 'Verificar si necesitan algo',
          color: 'text-purple-400',
        };
      case 'LOW_STOCK':
        return {
          icon: LucideIcons.PackageX,
          label: 'Stock Bajo',
          action: 'Programar reposición',
          color: 'text-yellow-400',
        };
    }
  };

  const formatFullTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const severityConfig = getSeverityConfig(alert.severity);
  const typeInfo = getTypeInfo(alert.type);
  const SeverityIcon = severityConfig.icon;
  const TypeIcon = typeInfo.icon;

  // Función para navegar al elemento relacionado
  const handleGoToElement = () => {
    if (!alert.relatedId) return;

    // Determinar la ruta según el tipo de ID
    if (alert.relatedId.startsWith('ORDER-')) {
      toast.info('Navegando a la orden...');
      // navigate('/ventas');
      onClose();
    } else if (alert.relatedId.startsWith('TABLE-')) {
      toast.info('Navegando a las mesas...');
      // navigate('/mesa');
      onClose();
    } else if (alert.relatedId.startsWith('PRODUCT-')) {
      toast.info('Navegando a productos...');
      // navigate('/productos');
      onClose();
    } else {
      toast.info('Elemento identificado');
    }
  };

  // Función para crear recordatorio
  const handleReminder = () => {
    toast.success('Recordatorio creado', {
      description: 'Te notificaremos en 15 minutos',
      icon: '⏰',
    });
    onClose();
  };

  // Función para marcar como resuelto
  const handleResolve = () => {
    if (onResolve) {
      onResolve(alert.id);
    }
    toast.success('Alerta resuelta', {
      description: 'La alerta ha sido marcada como resuelta',
      icon: '✅',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
        >
          {/* Header con Gradiente */}
          <div className={`bg-gradient-to-r ${severityConfig.bg} p-6`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <SeverityIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full ${severityConfig.badge} text-white text-xs font-bold uppercase`}>
                      {severityConfig.label}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                      {typeInfo.label}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{alert.title}</h2>
                  <p className="text-sm text-white/80">{alert.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              >
                <LucideIcons.X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tipo de Alerta */}
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Tipo</p>
                </div>
                <p className="text-base font-bold text-foreground">{typeInfo.label}</p>
              </div>

              {/* Fecha y Hora */}
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <LucideIcons.Calendar className="w-5 h-5 text-blue-400" />
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Fecha</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatFullTime(alert.timestamp)}</p>
              </div>
            </div>

            {/* ID Relacionado */}
            {alert.relatedId && (
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <LucideIcons.Link className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">ID Relacionado</p>
                      <p className="text-base font-bold text-foreground mt-1">{alert.relatedId}</p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors flex items-center space-x-2"
                    onClick={handleGoToElement}
                  >
                    <span>Ir al elemento</span>
                    <LucideIcons.ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Acción Recomendada */}
            <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                  <LucideIcons.Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-green-400 uppercase font-semibold mb-1">Acción Recomendada</p>
                  <p className="text-sm font-medium text-foreground">{typeInfo.action}</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center space-x-3 pt-4 border-t border-border">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center space-x-2"
                onClick={handleResolve}
              >
                <LucideIcons.CheckCircle2 className="w-5 h-5" />
                <span>Marcar como Resuelto</span>
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-secondary hover:bg-accent text-foreground font-semibold transition-all flex items-center justify-center space-x-2"
                onClick={handleReminder}
              >
                <LucideIcons.Bell className="w-5 h-5" />
                <span>Recordar</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-secondary hover:bg-accent text-foreground font-semibold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}