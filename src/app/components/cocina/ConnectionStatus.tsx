import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

interface ConnectionStatusProps {
  apiUrl?: string;
}

export function ConnectionStatus({ apiUrl }: ConnectionStatusProps) {
  const [status, setStatus] = useState<ConnectionState>('connected');
  const [showTooltip, setShowTooltip] = useState(false);

  // Simulación de estado de conexión (en producción, esto vendría de un WebSocket o polling)
  useEffect(() => {
    // Aquí iría la lógica real de conexión con el backend
    // Por ahora, simulamos que está conectado
    setStatus('connected');
  }, []);

  const statusConfig = {
    connected: {
      icon: Wifi,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      label: 'Conectado',
      description: 'Recibiendo órdenes en tiempo real',
    },
    reconnecting: {
      icon: WifiOff,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      label: 'Reconectando',
      description: 'Intentando reconectar con el servidor...',
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      label: 'Sin conexión',
      description: 'No se pueden recibir órdenes nuevas',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${config.bg} border ${config.border} transition-all hover:scale-105`}
      >
        <Icon className={`w-4 h-4 ${config.color} ${status === 'reconnecting' ? 'animate-pulse' : ''}`} />
        <span className={`text-xs font-semibold ${config.color}`}>
          {config.label}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
          <div className="flex items-start space-x-2">
            <Icon className={`w-4 h-4 ${config.color} mt-0.5 flex-shrink-0`} />
            <div>
              <p className="text-sm font-semibold text-white mb-1">{config.label}</p>
              <p className="text-xs text-slate-400">{config.description}</p>
              {apiUrl && (
                <p className="text-xs text-slate-500 mt-2 font-mono">{apiUrl}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}