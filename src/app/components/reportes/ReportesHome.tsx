import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import { useConfig } from '../../contexts/ConfigContext';
import { ReportCard } from './ReportCard';
import { ReportDetail } from './ReportDetail';
import { getReportsByBusinessType } from '../../config/reportsConfig';
import { ReportDefinition, ReportCategory } from '../../types/reports.types';
import { canAccessReport, canAccessCategory, getRoleDisplayName, getRoleBadgeColor } from '../../config/reportPermissions';
import type { UserRole } from '../../config/reportPermissions';

export function ReportesHome() {
  const { config } = useConfig();
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'ALL'>('ALL');
  
  // MOCK: Rol del usuario (en producción viene del contexto de autenticación)
  const [userRole] = useState<UserRole>('supervisor'); // Cambiar a 'gerente' para ver reportes financieros

  // Obtener reportes disponibles para el tipo de negocio actual
  const availableReports = useMemo(() => {
    if (!config) return [];
    
    const allReports = getReportsByBusinessType(config.businessType);
    
    // Filtrar por permisos de rol
    return allReports.filter(report => {
      const hasRoleAccess = canAccessReport(userRole, report.minRole);
      const hasCategoryAccess = canAccessCategory(userRole, report.category);
      return hasRoleAccess && hasCategoryAccess;
    });
  }, [config, userRole]);

  // Filtrar por categoría seleccionada
  const filteredReports = useMemo(() => {
    if (selectedCategory === 'ALL') return availableReports;
    return availableReports.filter(r => r.category === selectedCategory);
  }, [availableReports, selectedCategory]);

  // Agrupar reportes por categoría
  const reportsByCategory = useMemo(() => {
    const categories: ReportCategory[] = ['OPERATIONAL', 'INVENTORY', 'STAFF', 'FINANCIAL'];
    const grouped: Record<string, ReportDefinition[]> = {};
    
    categories.forEach(cat => {
      const reports = availableReports.filter(r => r.category === cat);
      if (reports.length > 0) {
        grouped[cat] = reports;
      }
    });
    
    return grouped;
  }, [availableReports]);

  // Si hay un reporte seleccionado, mostrar el detalle
  if (selectedReport) {
    return (
      <ReportDetail 
        report={selectedReport}
        userRole={userRole}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  const categoryLabels: Record<ReportCategory | 'ALL', { name: string; icon: any; color: string }> = {
    ALL: { name: 'Todos', icon: LucideIcons.LayoutGrid, color: 'blue' },
    OPERATIONAL: { name: 'Operativos', icon: LucideIcons.Activity, color: 'blue' },
    INVENTORY: { name: 'Inventario', icon: LucideIcons.Package, color: 'purple' },
    STAFF: { name: 'Personal', icon: LucideIcons.Users, color: 'green' },
    FINANCIAL: { name: 'Financieros', icon: LucideIcons.DollarSign, color: 'emerald' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <LucideIcons.BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Centro de Reportes</h1>
            <p className="text-sm text-muted-foreground">
              {availableReports.length} reportes disponibles para tu rol
            </p>
          </div>
        </div>

        {/* Badge de rol */}
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-lg bg-${getRoleBadgeColor(userRole)}-500/10 border border-${getRoleBadgeColor(userRole)}-500/20`}>
            <div className="flex items-center space-x-2">
              <LucideIcons.Shield className={`w-4 h-4 text-${getRoleBadgeColor(userRole)}-600 dark:text-${getRoleBadgeColor(userRole)}-400`} />
              <span className={`text-sm font-semibold text-${getRoleBadgeColor(userRole)}-600 dark:text-${getRoleBadgeColor(userRole)}-400`}>
                {getRoleDisplayName(userRole)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="bg-card/50 rounded-xl border border-border p-4">
        <div className="flex items-center space-x-3 mb-4">
          <LucideIcons.Filter className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Filtrar por Categoría</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(['ALL', ...Object.keys(reportsByCategory)] as (ReportCategory | 'ALL')[]).map((cat) => {
            const config = categoryLabels[cat];
            const IconComponent = config.icon;
            const count = cat === 'ALL' ? availableReports.length : reportsByCategory[cat as ReportCategory]?.length || 0;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-secondary hover:bg-accent text-foreground'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{config.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedCategory === cat
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-card text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de reportes */}
      {filteredReports.length === 0 ? (
        <div className="bg-card/50 rounded-xl border border-border p-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <LucideIcons.FileX className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay reportes disponibles
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              No tienes acceso a reportes en esta categoría con tu rol actual de {getRoleDisplayName(userRole)}.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {Object.entries(reportsByCategory).map(([category, reports]) => {
            if (selectedCategory !== 'ALL' && selectedCategory !== category) return null;
            
            const config = categoryLabels[category as ReportCategory];
            const IconComponent = config.icon;
            
            return (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Header de categoría */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-${config.color}-500/20 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{config.name}</h2>
                    <p className="text-xs text-muted-foreground">{reports.length} reportes disponibles</p>
                  </div>
                </div>

                {/* Grid de reportes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {reports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onClick={() => setSelectedReport(report)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info sobre permisos */}
      {userRole === 'supervisor' && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <LucideIcons.Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                Reportes Operativos
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                Como Supervisor, solo tienes acceso a reportes operativos sin información financiera. 
                Contacta a tu Gerente para acceso a reportes financieros.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}