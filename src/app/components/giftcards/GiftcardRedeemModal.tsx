/**
 * ═══════════════════════════════════════════════════════════════
 * MODAL - REDIMIR GIFTCARD
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { redeemGiftcard } from '../../services/giftcard.service';
import type { Giftcard, RedeemGiftcardPayload } from '../../types/giftcard.types';

interface GiftcardRedeemModalProps {
  isOpen: boolean;
  giftcard: Giftcard;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftcardRedeemModal({
  isOpen,
  giftcard,
  onClose,
  onSuccess,
}: GiftcardRedeemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

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

    if (amount > giftcard.balance) {
      toast.error(`El monto excede el saldo disponible (${formatCurrency(giftcard.balance)})`);
      return;
    }

    try {
      setIsLoading(true);

      const payload: RedeemGiftcardPayload = {
        code: giftcard.code,
        amount,
        notes: notes || undefined,
      };

      const result = await redeemGiftcard(payload);

      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error redeeming giftcard:', error);
      toast.error('Error al redimir la giftcard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(Math.min(value, giftcard.balance));
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
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Redimir Giftcard
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Aplicar descuento
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
                    Saldo Disponible:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(giftcard.balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Monto a redimir */}
            <div>
              <Label htmlFor="amount">Monto a Redimir *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                max={giftcard.balance}
                step="0.01"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Máximo: {formatCurrency(giftcard.balance)}
              </p>
            </div>

            {/* Botones de monto rápido */}
            <div>
              <Label className="mb-2">Monto Rápido</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount(giftcard.balance * 0.25)}
                  size="sm"
                >
                  25%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount(giftcard.balance * 0.50)}
                  size="sm"
                >
                  50%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount(giftcard.balance)}
                  size="sm"
                >
                  Todo
                </Button>
              </div>
            </div>

            {/* Notas */}
            <div>
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Aplicado a orden #123"
              />
            </div>

            {/* Resumen */}
            {amount > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Saldo Restante
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {formatCurrency(giftcard.balance - amount)}
                    </p>
                  </div>
                </div>
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
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Redimiendo...' : 'Redimir'}
          </Button>
        </div>
      </div>
    </div>
  );
}