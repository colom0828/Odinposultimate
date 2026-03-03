/**
 * ═══════════════════════════════════════════════════════════════
 * MODAL - DETALLE DE GIFTCARD + HISTORIAL
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect } from 'react';
import { X, History, QrCode, Printer, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { listMovements } from '../../services/giftcard.service';
import type { Giftcard, GiftcardMovement } from '../../types/giftcard.types';

interface GiftcardDetailModalProps {
  isOpen: boolean;
  giftcard: Giftcard;
  onClose: () => void;
  onReload: () => void;
}

export function GiftcardDetailModal({
  isOpen,
  giftcard,
  onClose,
  onReload,
}: GiftcardDetailModalProps) {
  const [movements, setMovements] = useState<GiftcardMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadMovements();
    }
  }, [isOpen, giftcard.id]);

  const loadMovements = async () => {
    try {
      setIsLoading(true);
      const data = await listMovements(giftcard.id);
      setMovements(data);
    } catch (error) {
      console.error('Error loading movements:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: giftcard.currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMovementTypeBadge = (type: GiftcardMovement['type']) => {
    const styles = {
      SALE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      REDEEM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      RECHARGE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      VOID: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      ADJUST: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };

    const labels = {
      SALE: 'Venta',
      REDEEM: 'Redención',
      RECHARGE: 'Recarga',
      VOID: 'Anulación',
      ADJUST: 'Ajuste',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const getStatusBadge = (status: Giftcard['status']) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      DEPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      EXPIRED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      VOIDED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    const labels = {
      ACTIVE: 'Activa',
      DEPLETED: 'Agotada',
      EXPIRED: 'Expirada',
      VOIDED: 'Anulada',
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
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
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Detalle de Giftcard
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                {giftcard.code}
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Tarjeta Visual */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Giftcard</p>
                  <p className="text-2xl font-bold">{formatCurrency(giftcard.balance)}</p>
                  <p className="text-xs opacity-75 mt-1">
                    De {formatCurrency(giftcard.initialAmount)} inicial
                  </p>
                </div>
                <div>{getStatusBadge(giftcard.status)}</div>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-90">Beneficiario</p>
                <p className="font-semibold">{giftcard.beneficiaryName}</p>
                {giftcard.beneficiaryPhone && (
                  <p className="text-xs opacity-75">{giftcard.beneficiaryPhone}</p>
                )}
              </div>
            </div>

            {/* Información Detallada */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Código
                </p>
                <p className="font-mono font-bold text-slate-900 dark:text-white">
                  {giftcard.code}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Tipo
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {giftcard.type === 'DIGITAL' ? '💻 Digital' : '💳 Física'}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Creada
                </p>
                <p className="text-sm text-slate-900 dark:text-white">
                  {formatDate(giftcard.createdAt)}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Expira
                </p>
                <p className="text-sm text-slate-900 dark:text-white">
                  {giftcard.expiresAt ? formatDate(giftcard.expiresAt) : 'Sin expiración'}
                </p>
              </div>
            </div>

            {/* Mensaje */}
            {giftcard.message && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-600 dark:text-blue-400 uppercase mb-1">
                  Mensaje
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100 italic">
                  "{giftcard.message}"
                </p>
              </div>
            )}

            {/* Historial de Movimientos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Historial de Movimientos
                </h3>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cargando...</p>
                </div>
              ) : movements.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No hay movimientos registrados
                </div>
              ) : (
                <div className="space-y-3">
                  {movements.map((movement) => (
                    <div
                      key={movement.id}
                      className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getMovementTypeBadge(movement.type)}
                            <span className="text-xs text-slate-500">
                              {formatDate(movement.createdAt)}
                            </span>
                          </div>
                          {movement.notes && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                              {movement.notes}
                            </p>
                          )}
                          {movement.reference && (
                            <p className="text-xs text-slate-500 font-mono">
                              Ref: {movement.reference}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p
                            className={`text-lg font-bold ${
                              movement.amount >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {movement.amount >= 0 ? '+' : ''}
                            {formatCurrency(movement.amount)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Saldo: {formatCurrency(movement.balanceAfter)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Próximamente')}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info('Próximamente')}>
              <Mail className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
