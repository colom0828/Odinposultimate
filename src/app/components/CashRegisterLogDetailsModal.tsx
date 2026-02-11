'use client';

import { X, DollarSign, Calendar, FileText, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { formatCurrency } from '../utils/formatters';
import { CashRegisterLog } from '../hooks/useCashRegister';

interface CashRegisterLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: CashRegisterLog | null;
}

export function CashRegisterLogDetailsModal({ isOpen, onClose, log }: CashRegisterLogDetailsModalProps) {
  if (!isOpen || !log) return null;

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

  const difference = log.finalAmount - log.initialAmount;
  const isDifferencePositive = difference >= 0;

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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  log.isOpen ? 'from-green-600 to-emerald-600' : 'from-slate-600 to-slate-700'
                } flex items-center justify-center`}>
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">Detalles de Caja</h2>
                  <p className="text-sm text-[var(--odin-text-secondary)]">{log.cashRegister}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[var(--odin-input-bg)] hover:bg-red-500/20 border border-[var(--odin-border)] hover:border-red-500/50 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-[var(--odin-text-secondary)]" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              {log.isOpen ? (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Caja Abierta</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-red-400 font-semibold">Caja Cerrada</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Amounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Initial Amount */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-[var(--odin-text-secondary)]">Monto Inicial</p>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(log.initialAmount)}</p>
                  <p className="text-xs text-[var(--odin-text-secondary)] mt-1">Al abrir la caja</p>
                </div>

                {/* Final Amount */}
                <div className={`p-4 bg-gradient-to-br ${
                  log.isOpen ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/30' : 'from-red-500/10 to-pink-500/10 border-red-500/30'
                } rounded-xl border`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingDown className={`w-5 h-5 ${log.isOpen ? 'text-blue-400' : 'text-red-400'}`} />
                    <p className="text-sm text-[var(--odin-text-secondary)]">Monto {log.isOpen ? 'Actual' : 'Final'}</p>
                  </div>
                  <p className={`text-3xl font-bold ${log.isOpen ? 'text-blue-400' : 'text-red-400'}`}>
                    {formatCurrency(log.finalAmount)}
                  </p>
                  <p className="text-xs text-[var(--odin-text-secondary)] mt-1">
                    {log.isOpen ? 'Actualizado en tiempo real' : 'Al cerrar la caja'}
                  </p>
                </div>
              </div>

              {/* Difference Card */}
              <div className={`p-4 rounded-xl border ${
                isDifferencePositive 
                  ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-500/30'
                  : 'bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className={`w-6 h-6 ${isDifferencePositive ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                      <p className="text-sm text-[var(--odin-text-secondary)]">Diferencia</p>
                      <p className={`text-2xl font-bold ${isDifferencePositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isDifferencePositive ? '+' : ''}{formatCurrency(difference)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--odin-text-secondary)]">
                      {isDifferencePositive ? 'Ganancia/Ingreso' : 'Pérdida/Retiro'}
                    </p>
                    <p className="text-sm font-medium text-[var(--odin-text-primary)] mt-1">
                      {difference === 0 ? '¡Caja cuadrada!' : isDifferencePositive ? 'Positivo' : 'Negativo'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-4">
                {/* Date */}
                <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Última Actualización</p>
                      <p className="font-semibold text-[var(--odin-text-primary)] capitalize">{formatDate(log.date)}</p>
                    </div>
                  </div>
                </div>

                {/* Last Reason */}
                <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border)]">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Última Razón / Descripción</p>
                      <p className="font-medium text-[var(--odin-text-primary)]">{log.lastReason}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="p-4 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg border border-purple-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg">ℹ️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--odin-text-primary)] mb-1">Información</p>
                    <p className="text-xs text-[var(--odin-text-secondary)] leading-relaxed">
                      {log.isOpen 
                        ? 'Esta caja está actualmente abierta y aceptando transacciones. El monto actual se actualiza automáticamente con cada ingreso o retiro.'
                        : 'Esta caja ha sido cerrada. Los montos mostrados representan el estado final al momento del cierre.'}
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
