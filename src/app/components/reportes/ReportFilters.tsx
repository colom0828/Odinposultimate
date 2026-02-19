'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ReportFilters, DateRangePreset, ShiftType } from '../../types/reports.types';

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  availableFilters: (keyof ReportFilters)[];
  showBranchFilter?: boolean;
  showEmployeeFilter?: boolean;
}

export function ReportFiltersComponent({ 
  filters, 
  onFiltersChange, 
  availableFilters,
  showBranchFilter = false,
  showEmployeeFilter = false,
}: ReportFiltersProps) {
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleDateRangeChange = (range: DateRangePreset) => {
    const newFilters = { ...filters, dateRange: range };
    
    if (range !== 'CUSTOM') {
      delete newFilters.startDate;
      delete newFilters.endDate;
      setShowCustomDate(false);
    } else {
      setShowCustomDate(true);
    }
    
    onFiltersChange(newFilters);
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleShiftChange = (shift: ShiftType) => {
    onFiltersChange({
      ...filters,
      shift,
    });
  };

  const shouldShow = (filterKey: keyof ReportFilters) => {
    return availableFilters.includes(filterKey);
  };

  return (
    <div className="bg-card/50 rounded-xl border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <LucideIcons.Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Filtros</h3>
      </div>

      <div className="space-y-4">
        {/* Rango de Fecha */}
        {shouldShow('dateRange') && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Período
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['TODAY', 'YESTERDAY', 'WEEK', 'MONTH', 'CUSTOM'] as DateRangePreset[]).map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    filters.dateRange === range
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary hover:bg-accent text-foreground'
                  }`}
                >
                  {getDateRangeIcon(range)}
                  <span>{getDateRangeLabel(range)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fechas personalizadas */}
        {showCustomDate && shouldShow('startDate') && shouldShow('endDate') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Turno */}
        {shouldShow('shift') && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Turno
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['ALL', 'MORNING', 'AFTERNOON', 'NIGHT'] as ShiftType[]).map((shift) => (
                <button
                  key={shift}
                  onClick={() => handleShiftChange(shift)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                    filters.shift === shift
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary hover:bg-accent text-foreground'
                  }`}
                >
                  {getShiftIcon(shift)}
                  <span>{getShiftLabel(shift)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sucursal */}
        {shouldShow('branchId') && showBranchFilter && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Sucursal
            </label>
            <select
              value={filters.branchId || ''}
              onChange={(e) => onFiltersChange({ ...filters, branchId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas las sucursales</option>
              <option value="1">Sucursal Centro</option>
              <option value="2">Sucursal Norte</option>
              <option value="3">Sucursal Sur</option>
            </select>
          </div>
        )}

        {/* Empleado */}
        {shouldShow('employeeId') && showEmployeeFilter && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Empleado
            </label>
            <select
              value={filters.employeeId || ''}
              onChange={(e) => onFiltersChange({ ...filters, employeeId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos los empleados</option>
              <option value="1">Juan Pérez</option>
              <option value="2">María García</option>
              <option value="3">Carlos López</option>
            </select>
          </div>
        )}

        {/* Botón limpiar filtros */}
        <button
          onClick={() => onFiltersChange({
            dateRange: 'TODAY',
            shift: 'ALL',
          })}
          className="w-full px-4 py-2 rounded-lg bg-secondary hover:bg-accent text-foreground text-sm font-medium transition-all flex items-center justify-center space-x-2"
        >
          <LucideIcons.RotateCcw className="w-4 h-4" />
          <span>Limpiar Filtros</span>
        </button>
      </div>
    </div>
  );
}

function getDateRangeLabel(range: DateRangePreset): string {
  const labels: Record<DateRangePreset, string> = {
    TODAY: 'Hoy',
    YESTERDAY: 'Ayer',
    WEEK: 'Semana',
    MONTH: 'Mes',
    CUSTOM: 'Custom',
  };
  return labels[range];
}

function getDateRangeIcon(range: DateRangePreset): JSX.Element {
  const icons: Record<DateRangePreset, JSX.Element> = {
    TODAY: <LucideIcons.Calendar className="w-4 h-4" />,
    YESTERDAY: <LucideIcons.CalendarDays className="w-4 h-4" />,
    WEEK: <LucideIcons.CalendarRange className="w-4 h-4" />,
    MONTH: <LucideIcons.CalendarClock className="w-4 h-4" />,
    CUSTOM: <LucideIcons.CalendarSearch className="w-4 h-4" />,
  };
  return icons[range];
}

function getShiftLabel(shift: ShiftType): string {
  const labels: Record<ShiftType, string> = {
    ALL: 'Todos',
    MORNING: 'Mañana',
    AFTERNOON: 'Tarde',
    NIGHT: 'Noche',
  };
  return labels[shift];
}

function getShiftIcon(shift: ShiftType): JSX.Element {
  const icons: Record<ShiftType, JSX.Element> = {
    ALL: <LucideIcons.Clock className="w-4 h-4" />,
    MORNING: <LucideIcons.Sunrise className="w-4 h-4" />,
    AFTERNOON: <LucideIcons.Sun className="w-4 h-4" />,
    NIGHT: <LucideIcons.Moon className="w-4 h-4" />,
  };
  return icons[shift];
}