/**
 * ═══════════════════════════════════════════════════════════════
 * MODAL - RECARGAR GIFTCARD
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { rechargeGiftcard } from '../../services/giftcard.service';
import type { Giftcard, RechargeGiftcardPayload } from '../../types/giftcard.types';

interface GiftcardRechargeModalProps {
  isOpen: boolean;
  giftcard: Giftcard;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftcardRechargeModal({
  isOpen,
  giftcard,
  onClose,
  onSuccess,
}: GiftcardRechargeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [mode, setMode] = useState<'SALE' | 'ADJUST'>('SALE');
  const [reason, setReason] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: giftcard.currency,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    if (mode === 'ADJUST' && !reason.trim()) {
      toast.error('Debes proporcionar una razón para el ajuste administrativo');
      return;
    }

    try {
      setIsLoading(true);

      const payload: RechargeGiftcardPayload = {
        code: giftcard.code,
        amount,
        mode,
        reason: reason || undefined,
      };

      const result = await rechargeGiftcard(payload);

      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error recharging giftcard:', error);
      toast.error('Error al recargar la giftcard');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Recargar Giftcard
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Agregar saldo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Info de Giftcard */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Código:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {giftcard.code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Beneficiario:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {giftcard.beneficiaryName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Saldo Actual:
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(giftcard.balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modo de recarga */}
            <div>
              <Label htmlFor="mode">Método de Recarga</Label>
              <Select
                value={mode}
                onValueChange={(value) => setMode(value as 'SALE' | 'ADJUST')}
              >
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">
                    💳 Recarga por venta en caja
                  </SelectItem>
                  <SelectItem value="ADJUST">
                    ⚙️ Ajuste administrativo
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'SALE'
                  ? 'Se generará una venta en caja por el monto de la recarga'
                  : 'Se agregará saldo sin generar venta (requiere permisos)'}
              </p>
            </div>

            {/* Monto a recargar */}
            <div>
              <Label htmlFor="amount">Monto a Recargar *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Razón (solo para ajuste) */}
            {mode === 'ADJUST' && (
              <div>
                <Label htmlFor="reason">Razón del Ajuste *</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Compensación por error en sistema"
                  required
                />
              </div>
            )}

            {/* Nuevo saldo */}
            {amount > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Nuevo Saldo:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(giftcard.balance + amount)}
                  </span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  +{formatCurrency(amount)} de recarga
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || amount <= 0}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Recargando...' : 'Recargar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
