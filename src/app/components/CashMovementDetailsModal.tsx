'use client';

import { X, DollarSign, User, Calendar, FileText, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { formatCurrency } from '../utils/formatters';
import { CashMovement } from '../hooks/useCashRegister';

interface CashMovementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: CashMovement | null;
}

export function CashMovementDetailsModal({ isOpen, onClose, movement }: CashMovementDetailsModalProps) {
  if (!isOpen || !movement) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getMovementColor = () => {
    switch (movement.movementType) {
      case 'Apertura':
        return 'from-green-600 to-emerald-600';
      case 'Cierre':
        return 'from-red-600 to-pink-600';
      case 'Ingreso Efectivo':
        return 'from-blue-600 to-cyan-600';
      case 'Retiro Efectivo':
        return 'from-orange-600 to-red-600';
      default:
        return 'from-purple-600 to-pink-600';
    }
  };

  const getMovementIcon = () => {
    switch (movement.movementType) {
      case 'Apertura':
        return '🟢';
      case 'Cierre':
        return '🔴';
      case 'Ingreso Efectivo':
        return '📈';
      case 'Retiro Efectivo':
        return '📉';
      default:
        return '💰';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getMovementColor()} flex items-center justify-center text-2xl`}>
                  {getMovementIcon()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">Detalles del Movimiento</h2>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Movimiento #{movement.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[var(--odin-input-bg)] hover:bg-red-500/20 border border-[var(--odin-border)] hover:border-red-500/50 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-[var(--odin-text-secondary)]" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Movement Type Card */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getMovementColor()} bg-opacity-10 border border-current border-opacity-20`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Tipo de Movimiento</p>
                    <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{movement.movementType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Monto</p>
                    <p className="text-3xl font-bold text-[var(--odin-text-primary)]">
                      {formatCurrency(movement.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cash Register */}
                <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Caja Registradora</p>
                      <p className="font-semibold text-[var(--odin-text-primary)]">{movement.cashRegister}</p>
                    </div>
                  </div>
                </div>

                {/* Employee */}
                <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Empleado</p>
                      <p className="font-semibold text-[var(--odin-text-primary)]">{movement.employee}</p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border)] md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Fecha y Hora</p>
                      <p className="font-semibold text-[var(--odin-text-primary)] capitalize">{formatDate(movement.date)}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border)] md:col-span-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Descripción</p>
                      <p className="font-medium text-[var(--odin-text-primary)]">{movement.description || 'Sin descripción'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-[var(--odin-text-primary)]">Resumen del Movimiento</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--odin-text-secondary)]">
                      {movement.movementType === 'Apertura' && 'Apertura de caja registradora'}
                      {movement.movementType === 'Cierre' && 'Cierre de turno de caja'}
                      {movement.movementType === 'Ingreso Efectivo' && 'Dinero agregado a la caja'}
                      {movement.movementType === 'Retiro Efectivo' && 'Dinero retirado de la caja'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-lg font-medium transition-all"
              >
                Cerrar
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}