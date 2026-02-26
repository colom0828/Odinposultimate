import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface InactivityWarningModalProps {
  isOpen: boolean;
  timeRemaining: number; // en milisegundos
  onContinue: () => void;
  onLogout: () => void;
}

export function InactivityWarningModal({ 
  isOpen, 
  timeRemaining, 
  onContinue,
  onLogout 
}: InactivityWarningModalProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Convertir a segundos
      const seconds = Math.ceil(timeRemaining / 1000);
      setCountdown(seconds);

      // Actualizar countdown cada segundo
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-[101] p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-purple-500/30 overflow-hidden">
              {/* Header con gradiente */}
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <AlertTriangle className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold">⚠️ Advertencia de Inactividad</h2>
                    <p className="text-white/90 text-sm mt-1">Tu sesión está por expirar</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Countdown Display */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-6 border border-orange-200 dark:border-orange-500/30">
                  <div className="flex items-center justify-center space-x-3">
                    <Clock className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Cerrando sesión en:
                      </p>
                      <motion.p 
                        key={countdown}
                        initial={{ scale: 1.2, color: '#f97316' }}
                        animate={{ scale: 1, color: countdown <= 30 ? '#ef4444' : '#f97316' }}
                        className="text-4xl font-bold font-mono"
                      >
                        {formatTime(countdown)}
                      </motion.p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ 
                        width: `${(countdown / 120) * 100}%`,
                        backgroundColor: countdown <= 30 ? '#ef4444' : '#f97316'
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="text-center space-y-2">
                  <p className="text-slate-700 dark:text-slate-300">
                    No hemos detectado actividad en los últimos minutos.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Por seguridad, tu sesión se cerrará automáticamente si no realizas ninguna acción.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={onContinue}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/30"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Continuar Sesión
                  </Button>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cerrar Sesión
                  </Button>
                </div>

                {/* Tip */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                    💡 <strong>Tip:</strong> Cualquier movimiento del mouse o teclado extenderá tu sesión automáticamente
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
