'use client';

import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import { ReportDefinition, ReportFilters, ReportData } from '../../types/reports.types';
import { ReportFiltersComponent } from './ReportFilters';
import { ReportExportButtons } from './ReportExportButtons';
import { ReportChart } from './ReportChart';
import { ReportService } from '../../services/reportService';
import { canViewMoneyData, canViewMultiBranch } from '../../config/reportPermissions';
import type { UserRole } from '../../config/reportPermissions';

interface ReportDetailProps {
  report: ReportDefinition;
  userRole: UserRole;
  onBack: () => void;
}

export function ReportDetail({ report, userRole, onBack }: ReportDetailProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: 'TODAY',
    shift: 'ALL',
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShowMoney = canViewMoneyData(userRole);
  const canShowMultiBranch = canViewMultiBranch(userRole);

  // Cargar datos del reporte
  useEffect(() => {
    loadReportData();
  }, [report.type, filters]);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ReportService.getReportData(report.type, filters);
      setReportData(data);
    } catch (err) {
      setError('Error al cargar el reporte. Por favor intenta de nuevo.');
      console.error('Error loading report:', err);
    } finally {
      setLoading(false);
    }
  };

  const IconComponent = (LucideIcons as any)[report.icon] || LucideIcons.FileText;

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700',
    red: 'from-red-600 to-red-700',
    yellow: 'from-yellow-600 to-yellow-700',
    cyan: 'from-cyan-600 to-cyan-700',
    pink: 'from-pink-600 to-pink-700',
    emerald: 'from-emerald-600 to-emerald-700',
    indigo: 'from-indigo-600 to-indigo-700',
  };

  const bgGradient = colorClasses[report.color] || colorClasses.blue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-secondary hover:bg-accent text-foreground transition-all"
          >
            <LucideIcons.ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">{report.name}</h1>
            <p className="text-sm text-muted-foreground">{report.description}</p>
          </div>
        </div>

        {/* Botones de exportación */}
        {reportData && (
          <ReportExportButtons
            exportRequest={{
              reportId: report.id,
              filters,
              includeCharts: true,
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Filtros */}
        <div className="lg:col-span-1">
          <ReportFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            availableFilters={report.availableFilters}
            showBranchFilter={canShowMultiBranch}
            showEmployeeFilter={true}
          />
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={loadReportData} />
          ) : reportData ? (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {reportData.kpis.map((kpi) => {
                  // Ocultar KPIs monetarios si el rol no tiene permiso
                  if (kpi.isMoney && !canShowMoney) return null;

                  const KpiIcon = kpi.icon ? (LucideIcons as any)[kpi.icon] : null;
                  
                  return (
                    <motion.div
                      key={kpi.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                          <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                        </div>
                        {KpiIcon && (
                          <div className={`w-10 h-10 rounded-lg bg-${kpi.color}-500/10 flex items-center justify-center`}>
                            <KpiIcon className={`w-5 h-5 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                          </div>
                        )}
                      </div>
                      
                      {kpi.change !== undefined && (
                        <div className="flex items-center space-x-1">
                          {kpi.trend === 'up' ? (
                            <LucideIcons.TrendingUp className="w-4 h-4 text-green-500" />
                          ) : kpi.trend === 'down' ? (
                            <LucideIcons.TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <LucideIcons.Minus className="w-4 h-4 text-gray-500" />
                          )}
                          <span className={`text-sm font-semibold ${
                            kpi.trend === 'up' ? 'text-green-500' : 
                            kpi.trend === 'down' ? 'text-red-500' : 
                            'text-gray-500'
                          }`}>
                            {kpi.change > 0 ? '+' : ''}{kpi.change}%
                          </span>
                          <span className="text-xs text-muted-foreground">vs anterior</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Tabla de datos */}
              {reportData.tableData && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Datos Detallados</h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary">
                        <tr>
                          {reportData.tableData.headers.map((header) => {
                            // Ocultar columnas monetarias si el rol no tiene permiso
                            if (header.isMoney && !canShowMoney) return null;
                            
                            return (
                              <th
                                key={header.key}
                                className={`px-6 py-4 text-${header.align || 'left'} text-sm font-bold text-foreground`}
                              >
                                {header.label}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {reportData.tableData.rows.map((row) => (
                          <tr key={row.id} className="hover:bg-secondary/50 transition-colors">
                            {reportData.tableData!.headers.map((header) => {
                              // Ocultar columnas monetarias si el rol no tiene permiso
                              if (header.isMoney && !canShowMoney) return null;
                              
                              return (
                                <td
                                  key={header.key}
                                  className={`px-6 py-4 text-${header.align || 'left'} text-sm text-foreground`}
                                >
                                  {row.cells[header.key]}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 bg-secondary/50 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {reportData.tableData.rows.length} de {reportData.tableData.totalRows} registros
                    </p>
                  </div>
                </div>
              )}

              {/* Gráfica */}
              {reportData.chartData && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Visualización</h2>
                  <ReportChart chartData={reportData.chartData} />
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Estados de carga y error
function LoadingState() {
  return (
    <div className="bg-card border border-border rounded-xl p-16">
      <div className="flex flex-col items-center justify-center text-center">
        <LucideIcons.Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Cargando reporte...</h3>
        <p className="text-sm text-muted-foreground">Por favor espera un momento</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-card border border-border rounded-xl p-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <LucideIcons.AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Error al cargar</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}