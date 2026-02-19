'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ServiceOrder,
  ServiceOrderStatus,
  ServicePriority,
  ApprovalStatus,
  EQUIPMENT_TYPE_CONFIG,
  PartStatus,
} from '../../types/serviceOrders.types';
import { getCurrentUser } from '../../utils/auth';

interface ServiceOrderCardProps {
  order: ServiceOrder;
  onViewDetails: (order: ServiceOrder) => void;
  onChangeStatus: (orderId: string, newStatus: ServiceOrderStatus) => void;
  onAssignTechnician: (orderId: string) => void;
}

// Componente interno para evitar problemas con forwardRef y Motion
function ServiceOrderCardInner({
  order,
  onViewDetails,
  onChangeStatus,
  onAssignTechnician,
}: ServiceOrderCardProps) {
  const currentUser = getCurrentUser();
  const canSeeCosts = currentUser?.rol !== 'supervisor';

  const equipmentConfig = EQUIPMENT_TYPE_CONFIG[order.equipment.type];
  const EquipmentIcon = (LucideIcons as any)[equipmentConfig.icon] || LucideIcons.HardDrive;

  // Determinar si hay repuestos pendientes
  const hasPendingParts = order.parts.some(p => p.status === PartStatus.PENDIENTE);
  const hasReceivedParts = order.parts.some(p => p.status === PartStatus.RECIBIDO);

  // Calcular antigüedad
  const daysOldText = order.daysOld === 0 ? 'Hoy' : order.daysOld === 1 ? '1 día' : `${order.daysOld} días`;

  return (
    <div
      className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4 shadow-lg hover:shadow-xl hover:border-purple-500/30 transition-all cursor-pointer"
      onClick={() => onViewDetails(order)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-500/10 p-2 rounded-lg">
            {EquipmentIcon && <EquipmentIcon className="w-4 h-4 text-purple-400" />}
          </div>
          <div>
            <p className="font-mono font-bold text-purple-400 text-sm">{order.orderNumber}</p>
            <p className="text-xs text-[var(--odin-text-secondary)]">{daysOldText}</p>
          </div>
        </div>

        {/* Prioridad */}
        {order.priority === ServicePriority.URGENTE && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
            <LucideIcons.AlertCircle className="w-3 h-3 mr-1" />
            Urgente
          </Badge>
        )}
      </div>

      {/* Cliente */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <LucideIcons.User className="w-4 h-4 text-[var(--odin-text-secondary)]" />
          <p className="text-[var(--odin-text-primary)] font-semibold text-sm">{order.customer.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <LucideIcons.Phone className="w-3 h-3 text-[var(--odin-text-secondary)]" />
          <p className="text-[var(--odin-text-secondary)] text-xs">{order.customer.phone}</p>
        </div>
      </div>

      {/* Equipo */}
      <div className="mb-3 p-2 bg-slate-900/30 rounded-lg border border-[var(--odin-border-accent)]">
        <p className="text-[var(--odin-text-primary)] text-sm font-medium">
          {order.equipment.brand} {order.equipment.model}
        </p>
        <p className="text-[var(--odin-text-secondary)] text-xs">{equipmentConfig.label}</p>
        {order.equipment.serial && (
          <p className="text-[var(--odin-text-secondary)] text-xs font-mono mt-1">
            S/N: {order.equipment.serial}
          </p>
        )}
      </div>

      {/* Problema reportado (truncado) */}
      <div className="mb-3">
        <p className="text-[var(--odin-text-secondary)] text-xs line-clamp-2">
          {order.reportedIssue}
        </p>
      </div>

      {/* Técnico asignado */}
      {order.assignedTechnician ? (
        <div className="mb-3 flex items-center space-x-2">
          <div className="bg-blue-500/10 p-1.5 rounded-full">
            <LucideIcons.UserCheck className="w-3 h-3 text-blue-400" />
          </div>
          <p className="text-[var(--odin-text-primary)] text-xs font-medium">
            {order.assignedTechnician.name}
          </p>
        </div>
      ) : (
        <div className="mb-3">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
            <LucideIcons.UserX className="w-3 h-3 mr-1" />
            Sin técnico
          </Badge>
        </div>
      )}

      {/* Indicadores */}
      <div className="flex items-center space-x-2 mb-3">
        {/* Aprobación pendiente */}
        {order.approval.status === ApprovalStatus.PENDIENTE && (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
            <LucideIcons.Clock className="w-3 h-3 mr-1" />
            Aprobación
          </Badge>
        )}

        {/* Repuestos */}
        {hasPendingParts && (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
            <LucideIcons.Package className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )}

        {hasReceivedParts && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            <LucideIcons.PackageCheck className="w-3 h-3 mr-1" />
            Repuesto
          </Badge>
        )}

        {/* Atrasado */}
        {order.isOverdue && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
            <LucideIcons.AlertTriangle className="w-3 h-3 mr-1" />
            Atrasado
          </Badge>
        )}
      </div>

      {/* Acciones rápidas */}
      <div className="flex items-center space-x-2 pt-3 border-t border-[var(--odin-border-accent)]">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(order);
          }}
          className="flex-1 text-xs hover:bg-purple-500/10 hover:text-purple-400"
        >
          <LucideIcons.Eye className="w-3 h-3 mr-1" />
          Ver
        </Button>

        {!order.assignedTechnician && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onAssignTechnician(order.id);
            }}
            className="flex-1 text-xs hover:bg-blue-500/10 hover:text-blue-400"
          >
            <LucideIcons.UserPlus className="w-3 h-3 mr-1" />
            Asignar
          </Button>
        )}
      </div>

      {/* Conexión externa (discreto) */}
      {order.source !== 'ODIN' && (
        <div className="mt-2 pt-2 border-t border-[var(--odin-border-accent)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <LucideIcons.Link className="w-3 h-3 text-[var(--odin-text-secondary)]" />
              <p className="text-[var(--odin-text-secondary)] text-xs">
                Origen: {order.source}
              </p>
            </div>
            {order.syncStatus === 'pending' && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                <LucideIcons.RefreshCw className="w-3 h-3" />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const ServiceOrderCard = forwardRef<HTMLDivElement, ServiceOrderCardProps>(
  (props, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <ServiceOrderCardInner {...props} />
      </motion.div>
    );
  }
);

ServiceOrderCard.displayName = 'ServiceOrderCard';