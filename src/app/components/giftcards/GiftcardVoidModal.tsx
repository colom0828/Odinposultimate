/**
 * ═══════════════════════════════════════════════════════════════
 * MODAL - ANULAR GIFTCARD
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { X, Ban, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { voidGiftcard } from '../../services/giftcard.service';
import type { Giftcard, VoidGiftcardPayload } from '../../types/giftcard.types';

interface GiftcardVoidModalProps {
  isOpen: boolean;
  giftcard: Giftcard;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftcardVoidModal({
  isOpen,
  giftcard,
  onClose,
  onSuccess,
}: GiftcardVoidModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: giftcard.currency,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error('Debes proporcionar una razón para anular esta giftcard');
      return;
    }

    try {
      setIsLoading(true);

      const payload: VoidGiftcardPayload = {
        code: giftcard.code,
        reason,
      };

      const result = await voidGiftcard(payload);

      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error voiding giftcard:', error);
      toast.error('Error al anular la giftcard');
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
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Anular Giftcard
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Esta acción no se puede deshacer
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
            {/* Advertencia */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                    ⚠️ Advertencia
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    Esta acción es irreversible. La giftcard será anulada y no podrá ser
                    utilizada nuevamente. El saldo pendiente se perderá.
                  </p>
                </div>
              </div>
            </div>

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
                    Saldo a Perder:
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(giftcard.balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Razón */}
            <div>
              <Label htmlFor="reason">Razón de Anulación *</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Fraude detectado, solicitud del cliente, error en emisión..."
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Esta razón quedará registrada en el historial
              </p>
            </div>
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
            disabled={isLoading || !reason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Anulando...' : 'Anular Giftcard'}
          </Button>
        </div>
      </div>
    </div>
  );
}
