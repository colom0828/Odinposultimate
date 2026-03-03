/**
 * ═══════════════════════════════════════════════════════════════
 * MODAL - CREAR GIFTCARD
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import { X, Gift, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { createGiftcard } from '../../services/giftcard.service';
import type { CreateGiftcardPayload } from '../../types/giftcard.types';

interface GiftcardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GiftcardCreateModal({ isOpen, onClose, onSuccess }: GiftcardCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGiftcardPayload>({
    initialAmount: 0,
    currency: 'DOP',
    type: 'DIGITAL',
    beneficiaryName: '',
    beneficiaryPhone: '',
    beneficiaryEmail: '',
    message: '',
    sellNow: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.beneficiaryName.trim()) {
      toast.error('El nombre del beneficiario es requerido');
      return;
    }

    if (formData.initialAmount <= 0) {
      toast.error('El monto inicial debe ser mayor a 0');
      return;
    }

    try {
      setIsLoading(true);
      const giftcard = await createGiftcard(formData);
      toast.success(`🎁 Giftcard creada: ${giftcard.code}`);
      onSuccess();
    } catch (error) {
      console.error('Error creating giftcard:', error);
      toast.error('Error al crear la giftcard');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = <K extends keyof CreateGiftcardPayload>(
    field: K,
    value: CreateGiftcardPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Crear Giftcard
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Nueva tarjeta de regalo
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Monto y Moneda */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialAmount">Monto Inicial *</Label>
                <Input
                  id="initialAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialAmount || ''}
                  onChange={(e) => updateField('initialAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => updateField('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOP">DOP (Peso Dominicano)</SelectItem>
                    <SelectItem value="USD">USD (Dólar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tipo */}
            <div>
              <Label htmlFor="type">Tipo de Giftcard</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateField('type', value as any)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIGITAL">
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      <span>Digital (Email/WhatsApp)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PHYSICAL">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Física (Tarjeta impresa)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Beneficiario */}
            <div>
              <Label htmlFor="beneficiaryName">Nombre del Beneficiario *</Label>
              <Input
                id="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(e) => updateField('beneficiaryName', e.target.value)}
                placeholder="Ej: María González"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="beneficiaryPhone">Teléfono</Label>
                <Input
                  id="beneficiaryPhone"
                  value={formData.beneficiaryPhone || ''}
                  onChange={(e) => updateField('beneficiaryPhone', e.target.value)}
                  placeholder="+1 809-555-1234"
                />
              </div>
              <div>
                <Label htmlFor="beneficiaryEmail">Email</Label>
                <Input
                  id="beneficiaryEmail"
                  type="email"
                  value={formData.beneficiaryEmail || ''}
                  onChange={(e) => updateField('beneficiaryEmail', e.target.value)}
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            {/* Mensaje Personalizado */}
            {formData.type === 'DIGITAL' && (
              <div>
                <Label htmlFor="message">Mensaje Personalizado (Opcional)</Label>
                <Textarea
                  id="message"
                  value={formData.message || ''}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Ej: ¡Feliz cumpleaños! Disfruta este regalo..."
                  rows={3}
                />
              </div>
            )}

            {/* Expiración */}
            <div>
              <Label htmlFor="expiresAt">Fecha de Expiración (Opcional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt || ''}
                onChange={(e) => updateField('expiresAt', e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Si no se especifica, la giftcard no expirará
              </p>
            </div>

            {/* Método de venta */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sellNow" className="text-base">
                    Registrar venta en caja
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.sellNow
                      ? 'Se generará una venta por el monto de la giftcard'
                      : 'Solo se registrará sin generar venta'}
                  </p>
                </div>
                <Switch
                  id="sellNow"
                  checked={formData.sellNow}
                  onCheckedChange={(checked) => updateField('sellNow', checked)}
                />
              </div>
            </div>

            {/* Preview (simple) */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">ODIN POS</h3>
                <p className="text-3xl font-bold mb-4">
                  {formData.initialAmount > 0
                    ? new Intl.NumberFormat('es-DO', {
                        style: 'currency',
                        currency: formData.currency,
                      }).format(formData.initialAmount)
                    : '—'}
                </p>
                <p className="text-sm opacity-90">
                  {formData.beneficiaryName || 'Nombre del beneficiario'}
                </p>
                {formData.message && (
                  <p className="text-xs opacity-80 mt-2 italic">"{formData.message}"</p>
                )}
              </div>
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
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isLoading ? 'Creando...' : 'Crear Giftcard'}
          </Button>
        </div>
      </div>
    </div>
  );
}