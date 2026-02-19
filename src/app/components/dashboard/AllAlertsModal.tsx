'use client';

import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { OperationalAlert } from '../../types/dashboard.types';
import { useState } from 'react';

interface AllAlertsModalProps {
  alerts: OperationalAlert[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAlert: (alert: OperationalAlert) => void;
  onResolve: (alertId: string) => void;
}

export function AllAlertsModal({ alerts, isOpen, onClose, onSelectAlert, onResolve }: AllAlertsModalProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterType, setFilterType] = useState<'all' | OperationalAlert['type']>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const getTypeLabel = (type: OperationalAlert['type']) => {
    switch (type) {
      case 'DELAYED_ORDER':
        return 'Orden Retrasada';
      case 'OLD_ORDER':
        return 'Orden Antigua';
      case 'LONG_TABLE':
        return 'Mesa con Mucho Tiempo';
      case 'LOW_STOCK':
        return 'Stock Bajo';
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

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (alert.relatedId && alert.relatedId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSeverity && matchesType && matchesSearch;
  });

  // Agrupar por severidad
  const groupedAlerts = {
    high: filteredAlerts.filter(a => a.severity === 'high'),
    medium: filteredAlerts.filter(a => a.severity === 'medium'),
    low: filteredAlerts.filter(a => a.severity === 'low'),
  };

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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-20 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-w-[1400px] mx-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <LucideIcons.Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Gestión de Alertas Operativas</h2>
                    <p className="text-sm text-red-100">
                      {filteredAlerts.length === alerts.length 
                        ? `${alerts.length} ${alerts.length === 1 ? 'alerta activa' : 'alertas activas'}`
                        : `${filteredAlerts.length} de ${alerts.length} alertas`
                      }
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <LucideIcons.X className="w-6 h-6" />
                </button>
              </div>

              {/* Búsqueda */}
              <div className="relative mb-4">
                <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                  >
                    <LucideIcons.X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtros - Mejor organizados */}
              <div className="space-y-3">
                {/* Filtros de Severidad */}
                <div>
                  <label className="text-xs font-semibold text-white/80 mb-2 block uppercase tracking-wide">
                    Nivel de Urgencia
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterSeverity('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterSeverity === 'all'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Todas ({alerts.length})
                    </button>
                    <button
                      onClick={() => setFilterSeverity('high')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterSeverity === 'high'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.AlertTriangle className="w-4 h-4" />
                      <span>Urgente ({groupedAlerts.high.length})</span>
                    </button>
                    <button
                      onClick={() => setFilterSeverity('medium')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterSeverity === 'medium'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.AlertCircle className="w-4 h-4" />
                      <span>Atención ({groupedAlerts.medium.length})</span>
                    </button>
                    <button
                      onClick={() => setFilterSeverity('low')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterSeverity === 'low'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.Info className="w-4 h-4" />
                      <span>Info ({groupedAlerts.low.length})</span>
                    </button>
                  </div>
                </div>

                {/* Filtros de Tipo */}
                <div>
                  <label className="text-xs font-semibold text-white/80 mb-2 block uppercase tracking-wide">
                    Tipo de Alerta
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterType === 'all'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Todos los tipos
                    </button>
                    <button
                      onClick={() => setFilterType('DELAYED_ORDER')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterType === 'DELAYED_ORDER'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.Clock className="w-4 h-4" />
                      <span>Retrasadas</span>
                    </button>
                    <button
                      onClick={() => setFilterType('OLD_ORDER')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterType === 'OLD_ORDER'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.Timer className="w-4 h-4" />
                      <span>Antiguas</span>
                    </button>
                    <button
                      onClick={() => setFilterType('LONG_TABLE')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterType === 'LONG_TABLE'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.Users className="w-4 h-4" />
                      <span>Mesas</span>
                    </button>
                    <button
                      onClick={() => setFilterType('LOW_STOCK')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                        filterType === 'LOW_STOCK'
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <LucideIcons.PackageX className="w-4 h-4" />
                      <span>Stock</span>
                    </button>
                  </div>
                </div>

                {/* Botón limpiar filtros */}
                {(searchTerm || filterSeverity !== 'all' || filterType !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSeverity('all');
                      setFilterType('all');
                    }}
                    className="text-xs text-white/80 hover:text-white underline transition-colors"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-background/50">
              {filteredAlerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <LucideIcons.SearchX className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchTerm || filterSeverity !== 'all' || filterType !== 'all'
                      ? 'No se encontraron alertas'
                      : 'No hay alertas activas'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterSeverity !== 'all' || filterType !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Todo está funcionando correctamente'}
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-8">
                  {/* Alertas Urgentes */}
                  {groupedAlerts.high.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-red-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <LucideIcons.AlertTriangle className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">Alertas Urgentes</h3>
                            <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-bold">
                          {groupedAlerts.high.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {groupedAlerts.high.map((alert) => (
                          <AlertCard
                            key={alert.id}
                            alert={alert}
                            onSelect={onSelectAlert}
                            onResolve={onResolve}
                            getSeverityConfig={getSeverityConfig}
                            getTypeIcon={getTypeIcon}
                            getTypeLabel={getTypeLabel}
                            formatTime={formatTime}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alertas de Atención */}
                  {groupedAlerts.medium.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-yellow-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                            <LucideIcons.AlertCircle className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">Alertas de Atención</h3>
                            <p className="text-xs text-muted-foreground">Necesitan seguimiento</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-yellow-500 text-white text-sm font-bold">
                          {groupedAlerts.medium.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {groupedAlerts.medium.map((alert) => (
                          <AlertCard
                            key={alert.id}
                            alert={alert}
                            onSelect={onSelectAlert}
                            onResolve={onResolve}
                            getSeverityConfig={getSeverityConfig}
                            getTypeIcon={getTypeIcon}
                            getTypeLabel={getTypeLabel}
                            formatTime={formatTime}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alertas Informativas */}
                  {groupedAlerts.low.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <LucideIcons.Info className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">Alertas Informativas</h3>
                            <p className="text-xs text-muted-foreground">Para tu conocimiento</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-blue-500 text-white text-sm font-bold">
                          {groupedAlerts.low.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {groupedAlerts.low.map((alert) => (
                          <AlertCard
                            key={alert.id}
                            alert={alert}
                            onSelect={onSelectAlert}
                            onResolve={onResolve}
                            getSeverityConfig={getSeverityConfig}
                            getTypeIcon={getTypeIcon}
                            getTypeLabel={getTypeLabel}
                            formatTime={formatTime}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-card/80 backdrop-blur-sm border-t border-border p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Mostrando <strong className="text-foreground font-bold">{filteredAlerts.length}</strong> de <strong className="text-foreground font-bold">{alerts.length}</strong> alertas
                </span>
                {(searchTerm || filterSeverity !== 'all' || filterType !== 'all') && (
                  <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Filtros activos
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Componente auxiliar para cada alerta - Mejorado
interface AlertCardProps {
  alert: OperationalAlert;
  onSelect: (alert: OperationalAlert) => void;
  onResolve: (alertId: string) => void;
  getSeverityConfig: (severity: OperationalAlert['severity']) => any;
  getTypeIcon: (type: OperationalAlert['type']) => any;
  getTypeLabel: (type: OperationalAlert['type']) => string;
  formatTime: (timestamp: string) => string;
}

function AlertCard({ alert, onSelect, onResolve, getSeverityConfig, getTypeIcon, getTypeLabel, formatTime }: AlertCardProps) {
  const config = getSeverityConfig(alert.severity);
  const SeverityIcon = config.icon;
  const TypeIcon = getTypeIcon(alert.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative rounded-xl border ${config.border} ${config.bg} p-5 hover:shadow-xl transition-all cursor-pointer bg-card/50 backdrop-blur-sm`}
    >
      <div className="flex flex-col space-y-4">
        {/* Header de la tarjeta */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.badge}/20 flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <SeverityIcon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <TypeIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium text-muted-foreground">{getTypeLabel(alert.type)}</span>
              </div>
              <h4 className="text-sm font-bold text-foreground leading-tight">{alert.title}</h4>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg ${config.badge} text-white text-xs font-bold shadow-sm flex-shrink-0`}>
            {config.label}
          </span>
        </div>

        {/* Descripción */}
        <p className="text-sm text-muted-foreground leading-relaxed">{alert.description}</p>

        {/* Metadata */}
        <div className="flex items-center space-x-3 text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center space-x-1.5">
            <LucideIcons.Clock className="w-3.5 h-3.5" />
            <span>{formatTime(alert.timestamp)}</span>
          </div>
          {alert.relatedId && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center space-x-1.5">
                <LucideIcons.Hash className="w-3.5 h-3.5" />
                <span className="font-mono font-medium">{alert.relatedId}</span>
              </div>
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(alert);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <LucideIcons.Eye className="w-4 h-4" />
            <span>Ver detalle</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResolve(alert.id);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <LucideIcons.CheckCircle2 className="w-4 h-4" />
            <span>Resolver</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}