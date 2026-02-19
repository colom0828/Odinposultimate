'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';
import { getDashboardConfig } from '../../config/dashboardsConfig';
import { getSupervisorDashboardData, isRestaurantDashboard, isSpaDashboard } from '../../services/dashboardService';
import type { DashboardData } from '../../services/dashboardService';

// Restaurant Components
import { RealTimeOperations } from '../../components/dashboard/RealTimeOperations';
import { DailyPerformance } from '../../components/dashboard/DailyPerformance';
import { OperationalAlerts } from '../../components/dashboard/OperationalAlerts';
import { StaffStatus } from '../../components/dashboard/StaffStatus';

// Spa Components
import { SpaRealTimeMetrics } from '../../components/dashboard/spa/SpaRealTimeMetrics';
import { DailySchedule } from '../../components/dashboard/spa/DailySchedule';
import { TopServices } from '../../components/dashboard/spa/TopServices';
import { SpaOperationalAlerts } from '../../components/dashboard/spa/SpaOperationalAlerts';
import { SpaStaffStatus } from '../../components/dashboard/spa/SpaStaffStatus';

export default function DashboardPage() {
  const { config } = useConfig();
  const businessType = config?.businessType || 'restaurant';
  
  // Obtener configuración dinámica
  const dashboardConfig = useMemo(() => getDashboardConfig(businessType), [businessType]);
  
  // Obtener datos según vertical
  const [dashboardData, setDashboardData] = useState<DashboardData>(() => 
    getSupervisorDashboardData(businessType)
  );
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Actualizar datos cuando cambia el businessType
  useEffect(() => {
    const newData = getSupervisorDashboardData(businessType);
    setDashboardData(newData);
  }, [businessType]);

  // Simular actualización de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Aquí iría la lógica real de fetch desde API
      // Por ahora usamos datos mock
    }, dashboardConfig.refreshInterval);

    return () => clearInterval(interval);
  }, [dashboardConfig.refreshInterval]);

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 5) return 'Ahora mismo';
    if (seconds < 60) return `Hace ${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    
    return lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    const newData = getSupervisorDashboardData(businessType);
    setDashboardData(newData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            {/* Logo Dashboard */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50">
              <LucideIcons.LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            
            {/* Título y Subtítulo */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {dashboardConfig.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {dashboardConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Info de Actualización */}
          <div className="flex items-center space-x-3">
            {/* Última actualización */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-card border border-border">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Actualizado: <span className="font-semibold text-foreground">{formatLastUpdated()}</span>
              </span>
            </div>

            {/* Botón Refrescar */}
            <button
              onClick={handleRefresh}
              className="p-3 rounded-xl bg-card hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all group"
              title="Refrescar datos"
            >
              <LucideIcons.RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>

        {/* DASHBOARD ESPECÍFICO POR VERTICAL */}
        
        {/* ========================================
            RESTAURANT DASHBOARD
            ======================================== */}
        {isRestaurantDashboard(dashboardData) && (
          <>
            {/* Bloque 1: Operación en Tiempo Real */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RealTimeOperations metrics={dashboardData.realTimeMetrics} />
            </motion.div>

            {/* Bloque 2: Rendimiento del Día */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DailyPerformance performance={dashboardData.dailyPerformance} />
            </motion.div>

            {/* Bloque 3: Alertas Operativas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <OperationalAlerts alerts={dashboardData.alerts} />
            </motion.div>

            {/* Bloque 4: Estado del Personal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StaffStatus staffStatus={dashboardData.staffStatus} />
            </motion.div>
          </>
        )}

        {/* ========================================
            SPA DASHBOARD
            ======================================== */}
        {isSpaDashboard(dashboardData) && (
          <>
            {/* Bloque 1: Métricas en Tiempo Real */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SpaRealTimeMetrics metrics={dashboardData.realTimeMetrics} />
            </motion.div>

            {/* Bloque 2: Agenda del Día */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DailySchedule appointments={dashboardData.dailySchedule} />
            </motion.div>

            {/* Grid 2 columnas: Servicios + Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Servicios Más Solicitados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TopServices services={dashboardData.topServices} />
              </motion.div>

              {/* Alertas Operativas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <SpaOperationalAlerts alerts={dashboardData.alerts} />
              </motion.div>
            </div>

            {/* Bloque 4: Estado del Personal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SpaStaffStatus staff={dashboardData.staffStatus} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
