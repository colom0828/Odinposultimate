import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCashRegister } from '../hooks/useCashRegister';
import { toast } from 'sonner';

interface CloseCashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const employees = ['Admin', 'Danny Garritas', 'Osvaldo Rodriguez', 'Usuario1', 'Usuario2'];

export function CloseCashRegisterModal({ isOpen, onClose }: CloseCashRegisterModalProps) {
  const { closeCashRegister, logs } = useCashRegister();
  const [selectedCashRegister, setSelectedCashRegister] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('Admin');
  const [finalAmount, setFinalAmount] = useState('');
  const [description, setDescription] = useState('');

  const openCashRegisters = logs.filter(log => log.isOpen);
  const selectedLog = logs.find(log => log.cashRegister === selectedCashRegister && log.isOpen);

  const handleSubmit = () => {
    if (!selectedCashRegister) {
      toast.error('Por favor selecciona una caja registradora');
      return;
    }

    if (!finalAmount || parseFloat(finalAmount) < 0) {
      toast.error('Por favor ingresa un monto final válido');
      return;
    }

    try {
      closeCashRegister(
        selectedCashRegister,
        selectedEmployee,
        parseFloat(finalAmount),
        description || 'Cierre de turno'
      );

      const difference = selectedLog ? parseFloat(finalAmount) - selectedLog.initialAmount : 0;

      toast.success(`${selectedCashRegister} cerrada exitosamente`, {
        description: `Diferencia: $${difference.toFixed(2)}`,
      });

      // Reset form
      setSelectedCashRegister('');
      setSelectedEmployee('Admin');
      setFinalAmount('');
      setDescription('');
      onClose();
    } catch (error: any) {
      toast.error('Error al cerrar caja', {
        description: error.message,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">Cerrar Caja</h2>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Cierre de turno</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[var(--odin-input-bg)] hover:bg-red-500/20 border border-[var(--odin-border)] hover:border-red-500/50 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-[var(--odin-text-secondary)]" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {openCashRegisters.length === 0 ? (
                <div className="text-center py-8 text-[var(--odin-text-secondary)]">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay cajas abiertas</p>
                  <p className="text-sm mt-1">Abre una caja primero</p>
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2">Caja Registradora</Label>
                    <Select value={selectedCashRegister} onValueChange={setSelectedCashRegister}>
                      <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]">
                        <SelectValue placeholder="Selecciona una caja" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-xl">
                        {openCashRegisters.map(log => (
                          <SelectItem key={log.id} value={log.cashRegister} className="text-[var(--odin-text-primary)]">
                            {log.cashRegister} (Inicial: ${log.initialAmount.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLog && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[var(--odin-text-secondary)]">Monto Inicial:</span>
                        <span className="font-semibold text-[var(--odin-text-primary)]">${selectedLog.initialAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--odin-text-secondary)]">Monto Actual:</span>
                        <span className="font-semibold text-[var(--odin-text-primary)]">${selectedLog.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2">Empleado</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-xl">
                        {employees.map(emp => (
                          <SelectItem key={emp} value={emp} className="text-[var(--odin-text-primary)]">
                            {emp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2">Monto Final en Caja</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
                    />
                  </div>

                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2">Descripción (Opcional)</Label>
                    <Input
                      placeholder="Cierre de turno vespertino"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            {openCashRegisters.length > 0 && (
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-red-500/10 hover:border-red-500/50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedCashRegister || !finalAmount}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-lg hover:shadow-red-500/50 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cerrar Caja
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}