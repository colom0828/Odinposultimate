'use client';

import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { StaffStatus as StaffStatusType, StaffMember } from '../../types/dashboard.types';
import { useState } from 'react';

interface StaffStatusProps {
  staffStatus: StaffStatusType;
}

export function StaffStatus({ staffStatus }: StaffStatusProps) {
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({});

  const toggleColumn = (role: string) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const getStatusConfig = (status: StaffMember['status']) => {
    switch (status) {
      case 'active':
        return {
          dot: 'bg-green-400',
          label: 'Activo',
          textColor: 'text-green-500',
        };
      case 'break':
        return {
          dot: 'bg-yellow-400',
          label: 'En descanso',
          textColor: 'text-yellow-600',
        };
      case 'offline':
        return {
          dot: 'bg-muted-foreground',
          label: 'Inactivo',
          textColor: 'text-muted-foreground',
        };
    }
  };

  const getRoleConfig = (role: StaffMember['role']) => {
    switch (role) {
      case 'COCINERO':
        return {
          icon: LucideIcons.ChefHat,
          color: 'text-white',
          bg: 'bg-orange-600',
          label: 'Cocineros',
          labelSingular: 'Cocinero',
        };
      case 'CAJERO':
        return {
          icon: LucideIcons.CreditCard,
          color: 'text-white',
          bg: 'bg-blue-600',
          label: 'Cajeros',
          labelSingular: 'Cajero',
        };
      case 'REPARTIDOR':
        return {
          icon: LucideIcons.Bike,
          color: 'text-white',
          bg: 'bg-purple-600',
          label: 'Repartidores',
          labelSingular: 'Repartidor',
        };
      case 'MESERO':
        return {
          icon: LucideIcons.User,
          color: 'text-white',
          bg: 'bg-green-600',
          label: 'Meseros',
          labelSingular: 'Mesero',
        };
    }
  };

  const renderStaffColumn = (members: StaffMember[], role: StaffMember['role']) => {
    const config = getRoleConfig(role);
    const Icon = config.icon;
    const activeCount = members.filter(m => m.status === 'active').length;
    const visibleCount = 4;
    const hasMore = members.length > visibleCount;
    const isExpanded = expandedColumns[role] || false;
    const displayedMembers = isExpanded ? members : members.slice(0, visibleCount);

    const renderMember = (member: StaffMember, index: number) => {
      const statusConfig = getStatusConfig(member.status);

      return (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="flex items-center space-x-3 group"
        >
          {/* Avatar con Status */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center border-2 border-border">
              <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${statusConfig.dot} border-2 border-card`} />
          </div>

          {/* Info del Personal */}
          <div className="flex-1 min-w-0">
            {member.status === 'active' && member.currentTask ? (
              <>
                <p className="text-xs text-muted-foreground truncate">{member.name.split(' ')[0]}</p>
                <p className="text-xs font-medium text-foreground truncate">{member.currentTask}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground truncate">{member.name.split(' ')[0]}</p>
                <p className={`text-xs ${statusConfig.textColor}`}>{statusConfig.label}</p>
              </>
            )}
          </div>

          {/* Icono de Actividad */}
          {member.status === 'active' && member.currentTask && (
            <LucideIcons.Zap className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}
        </motion.div>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card/70 rounded-2xl border border-border p-5"
      >
        {/* Header de la Columna */}
        <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-border">
          <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground mb-1">{config.label}</h3>
            <p className="text-sm text-muted-foreground">
              <span className={`font-bold text-foreground`}>{activeCount}</span> de{' '}
              <span className="font-semibold">{members.length}</span> activos
            </p>
          </div>
        </div>

        {/* Lista de Staff */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayedMembers.map((member, index) => renderMember(member, index))}
          </AnimatePresence>

          {/* Botón Ver Más / Ver Menos */}
          {hasMore && (
            <button
              onClick={() => toggleColumn(role)}
              className="w-full py-2 mt-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center space-x-1 rounded-lg hover:bg-secondary"
            >
              <span>
                {isExpanded ? 'Ver menos' : `Ver ${members.length - visibleCount} más`}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <LucideIcons.ChevronDown className="w-3 h-3" />
              </motion.div>
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const allStaff = [
    ...staffStatus.chefs,
    ...staffStatus.cashiers,
    ...staffStatus.couriers,
    ...staffStatus.waiters,
  ];

  const totalActive = allStaff.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <LucideIcons.Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Estado del Personal</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalActive}</span> de{' '}
              <span className="font-medium">{allStaff.length}</span> personas activas
            </p>
          </div>
        </div>

        {/* Badge de Activos */}
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-bold text-green-400">{totalActive} activos</span>
        </div>
      </div>

      {/* Grid de 4 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {renderStaffColumn(staffStatus.chefs, 'COCINERO')}
        {renderStaffColumn(staffStatus.cashiers, 'CAJERO')}
        {renderStaffColumn(staffStatus.couriers, 'REPARTIDOR')}
        {renderStaffColumn(staffStatus.waiters, 'MESERO')}
      </div>
    </div>
  );
}