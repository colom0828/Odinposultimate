import { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCashRegister } from '../hooks/useCashRegister';
import { toast } from 'sonner';

interface CashTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Ingreso Efectivo' | 'Retiro Efectivo';
}

const employees = ['Admin', 'Danny Garritas', 'Osvaldo Rodriguez', 'Usuario1', 'Usuario2'];

export function CashTransactionModal({ isOpen, onClose, type }: CashTransactionModalProps) {
  const { addTransaction, logs } = useCashRegister();
  const [selectedCashRegister, setSelectedCashRegister] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('Admin');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const openCashRegisters = logs.filter(log => log.isOpen);
  const isDeposit = type === 'Ingreso Efectivo';

  const handleSubmit = () => {
    if (!selectedCashRegister) {
      toast.error('Por favor selecciona una caja registradora');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    if (!description.trim()) {
      toast.error('Por favor ingresa una descripción');
      return;
    }

    try {
      addTransaction(
        selectedCashRegister,
        selectedEmployee,
        parseFloat(amount),
        type,
        description
      );

      toast.success(`${type} registrado exitosamente`, {
        description: `$${parseFloat(amount).toFixed(2)} - ${description}`,
      });

      // Reset form
      setSelectedCashRegister('');
      setSelectedEmployee('Admin');
      setAmount('');
      setDescription('');
      onClose();
    } catch (error: any) {
      toast.error('Error al registrar transacción', {
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
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                  isDeposit ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-red-600'
                } flex items-center justify-center`}>
                  {isDeposit ? (
                    <TrendingUp className="w-5 h-5 text-white" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">{type}</h2>
                  <p className="text-sm text-[var(--odin-text-secondary)]">
                    {isDeposit ? 'Agregar dinero a caja' : 'Retirar dinero de caja'}
                  </p>
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
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
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
                            {log.cashRegister} (${log.finalAmount.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                    <Label className="text-[var(--odin-text-primary)] mb-2">Monto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
                    />
                  </div>

                  <div>
                    <Label className="text-[var(--odin-text-primary)] mb-2">Descripción</Label>
                    <Input
                      placeholder={isDeposit ? 'Ej: Sobrante del día anterior' : 'Ej: Retiro para banco'}
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
                  disabled={!selectedCashRegister || !amount || !description}
                  className={`flex-1 bg-gradient-to-r ${
                    isDeposit 
                      ? 'from-green-600 to-emerald-600 hover:shadow-green-500/50' 
                      : 'from-orange-600 to-red-600 hover:shadow-orange-500/50'
                  } hover:shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Registrar {isDeposit ? 'Ingreso' : 'Retiro'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}