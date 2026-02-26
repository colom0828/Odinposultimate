import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  Info,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { OperationalAlert } from '../../types/dashboard.types';

interface Props {
  alerts: OperationalAlert[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAlert: (alert: OperationalAlert) => void;
  onResolve: (alertId: string, resolution?: string) => void;
}

export function AllAlertsModal({ alerts, isOpen, onClose, onSelectAlert, onResolve }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!isOpen) return null;

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityConfig = (severity: OperationalAlert['severity']) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: AlertTriangle,
          iconColor: 'text-red-400',
          badge: 'bg-red-500',
          label: 'Urgente',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: AlertCircle,
          iconColor: 'text-yellow-400',
          badge: 'bg-yellow-500',
          label: 'Atención',
        };
      case 'low':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: Info,
          iconColor: 'text-blue-400',
          badge: 'bg-blue-500',
          label: 'Info',
        };
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Todas las Alertas</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAlerts.length} de {alerts.length} alertas
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar alertas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Filtro de severidad */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as any)}
                  className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todas</option>
                  <option value="high">Urgente</option>
                  <option value="medium">Atención</option>
                  <option value="low">Info</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de alertas */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {filteredAlerts.length === 0 ? (
              <div className="py-16 text-center">
                <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-lg font-semibold text-foreground">No se encontraron alertas</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? 'Intenta con otra búsqueda' : 'No hay alertas activas'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map((alert, index) => {
                  const config = getSeverityConfig(alert.severity);
                  const SeverityIcon = config.icon;

                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative rounded-xl border ${config.border} ${config.bg} p-4 hover:shadow-lg transition-all cursor-pointer`}
                      onClick={() => onSelectAlert(alert)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Ícono */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.badge}/20 flex items-center justify-center flex-shrink-0`}>
                          <SeverityIcon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-sm font-bold text-foreground">{alert.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full ${config.badge} text-white text-xs font-semibold`}>
                              {config.label}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {alert.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(alert.timestamp)}</span>
                              {alert.relatedId && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                  <span className="font-mono">{alert.relatedId}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>Ver detalles</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-colors pointer-events-none" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-lg bg-secondary hover:bg-accent text-foreground font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}