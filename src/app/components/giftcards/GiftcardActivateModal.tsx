/**
 * ═══════════════════════════════════════════════════════════════
 * MODAL - ACTIVAR GIFTCARD EN POS VERIPHONE
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import { X, CreditCard, Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { Giftcard, POSTerminal } from '../../types/giftcard.types';
import { activateGiftcard } from '../../services/giftcard.service';
import { listPOSTerminals, checkTerminalStatus } from '../../services/veriphone.service';

interface GiftcardActivateModalProps {
  giftcard: Giftcard;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftcardActivateModal({ giftcard, onClose, onSuccess }: GiftcardActivateModalProps) {
  const [terminals, setTerminals] = useState<POSTerminal[]>([]);
  const [selectedTerminalId, setSelectedTerminalId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingTerminals, setLoadingTerminals] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

  // Cargar terminales disponibles
  useEffect(() => {
    loadTerminals();
  }, []);

  async function loadTerminals() {
    try {
      setLoadingTerminals(true);
      const data = await listPOSTerminals();
      const onlineTerminals = data.filter(t => t.status === 'ONLINE');
      setTerminals(onlineTerminals);
      
      if (onlineTerminals.length > 0) {
        setSelectedTerminalId(onlineTerminals[0].id);
      }
    } catch (err) {
      setError('Error al cargar terminales POS');
      console.error(err);
    } finally {
      setLoadingTerminals(false);
    }
  }

  async function handleActivate() {
    if (!selectedTerminalId) {
      setError('Seleccione un terminal POS');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      // Verificar estado del terminal
      const terminalStatus = await checkTerminalStatus(selectedTerminalId);
      
      if (!terminalStatus.online) {
        throw new Error('Terminal POS no disponible');
      }

      // Activar giftcard
      const result = await activateGiftcard({
        code: giftcard.code,
        posTerminalId: selectedTerminalId,
        userId: 'current-user', // TODO: Obtener de AuthContext
      });

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error al activar la giftcard');
      setStep('select');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d24] rounded-xl border border-gray-800 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Activar en POS</h2>
              <p className="text-sm text-gray-400">Terminal Veriphone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Información de Giftcard */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">{giftcard.code}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Beneficiario</p>
                <p className="text-white font-medium">{giftcard.beneficiaryName}</p>
              </div>
              <div>
                <p className="text-gray-400">Saldo Inicial</p>
                <p className="text-white font-medium">
                  {giftcard.currency} {giftcard.initialAmount.toLocaleString('es-DO')}
                </p>
              </div>
            </div>
          </div>

          {/* Step: Seleccionar Terminal */}
          {step === 'select' && (
            <>
              {/* Selector de Terminal */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Terminal POS
                </label>
                
                {loadingTerminals ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                ) : terminals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                    <p>No hay terminales POS disponibles</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {terminals.map((terminal) => (
                      <label
                        key={terminal.id}
                        className={`
                          flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
                          ${selectedTerminalId === terminal.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="terminal"
                          value={terminal.id}
                          checked={selectedTerminalId === terminal.id}
                          onChange={(e) => setSelectedTerminalId(e.target.value)}
                          className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-white">{terminal.name}</p>
                          <p className="text-sm text-gray-400">
                            {terminal.location} • {terminal.serialNumber}
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {/* Advertencia */}
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-200">
                    La giftcard será activada en el terminal seleccionado y quedará lista para usar.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Step: Procesando */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Activando en POS...</p>
              <p className="text-sm text-gray-400">
                Comunicándose con terminal {terminals.find(t => t.id === selectedTerminalId)?.name}
              </p>
            </div>
          )}

          {/* Step: Éxito */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">¡Activación exitosa!</p>
              <p className="text-sm text-gray-400">
                La giftcard ya está lista para usar
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'select' && (
          <div className="flex gap-3 p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 font-medium hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleActivate}
              disabled={loading || !selectedTerminalId || terminals.length === 0}
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Activando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Activar Ahora
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
