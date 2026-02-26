import { useEffect, useRef, useState } from 'react';

interface UseInactivityTimeoutOptions {
  onInactive: () => void;
  onWarning?: () => void;
  timeout?: number;
  warningTime?: number;
}

/**
 * Hook para detectar inactividad del usuario y ejecutar un callback
 * @param options - Configuración del hook
 * @param options.onInactive - Función a ejecutar cuando se detecta inactividad
 * @param options.onWarning - Función a ejecutar cuando falta poco tiempo (warning)
 * @param options.timeout - Tiempo de inactividad en milisegundos (default: 10 minutos)
 * @param options.warningTime - Tiempo antes del timeout para mostrar warning (default: 2 minutos)
 */
export function useInactivityTimeout({
  onInactive,
  onWarning,
  timeout = 10 * 60 * 1000, // 10 minutos
  warningTime = 2 * 60 * 1000, // 2 minutos antes
}: UseInactivityTimeoutOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(timeout);

  // Actualizar timestamp de última actividad
  const updateActivity = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    
    // Guardar en localStorage para persistencia entre recargas
    if (typeof window !== 'undefined') {
      localStorage.setItem('odin-last-activity', now.toString());
    }

    // Limpiar timers anteriores
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Resetear el tiempo restante
    setTimeRemaining(timeout);

    // Timer para el warning (faltan X minutos)
    if (onWarning) {
      const timeUntilWarning = timeout - warningTime;
      warningTimeoutRef.current = setTimeout(() => {
        console.log('⚠️ Advertencia de inactividad');
        onWarning();
      }, timeUntilWarning);
    }

    // Timer principal para logout
    timeoutRef.current = setTimeout(() => {
      onInactive();
    }, timeout);
  };

  useEffect(() => {
    // Verificar si hay una sesión expirada al montar
    if (typeof window !== 'undefined') {
      const lastActivity = localStorage.getItem('odin-last-activity');
      const isAuthenticated = localStorage.getItem('odin-isAuthenticated');

      if (isAuthenticated && lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        
        // Si pasaron más de 10 minutos, ejecutar callback inmediatamente
        if (timeSinceLastActivity > timeout) {
          onInactive();
          return; // No iniciar listeners si ya expiró
        }
      }
    }

    // Eventos que indican actividad del usuario
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Agregar listeners
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Iniciar el timer por primera vez
    updateActivity();

    // Countdown timer para UI
    const countdownInterval = setInterval(() => {
      const lastActivity = localStorage.getItem('odin-last-activity');
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity);
        const remaining = Math.max(0, timeout - elapsed);
        setTimeRemaining(remaining);
      }
    }, 1000);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      clearInterval(countdownInterval);
    };
  }, [timeout, warningTime, onInactive, onWarning]);

  return {
    resetTimer: updateActivity,
    getLastActivity: () => lastActivityRef.current,
    timeRemaining,
  };
}

/**
 * Verificar si la sesión expiró (para usar en el montaje de App)
 * @param timeout - Tiempo de expiración en milisegundos
 * @returns true si la sesión expiró
 */
export function isSessionExpired(timeout: number = 10 * 60 * 1000): boolean {
  if (typeof window === 'undefined') return false;

  const lastActivity = localStorage.getItem('odin-last-activity');
  const isAuthenticated = localStorage.getItem('odin-isAuthenticated');

  // Si no está autenticado, no hay sesión que expirar
  if (!isAuthenticated || isAuthenticated !== 'true') {
    return false;
  }

  // Si no hay registro de actividad, asumir que expiró
  if (!lastActivity) {
    return true;
  }

  const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
  return timeSinceLastActivity > timeout;
}

/**
 * Limpiar la sesión del usuario
 */
export function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('odin-isAuthenticated');
  localStorage.removeItem('odin-user');
  localStorage.removeItem('odin-last-activity');
  
  console.log('🔒 Sesión cerrada por inactividad');
}