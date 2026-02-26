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

interface OpenCashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cashRegisters = ['Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Caja 5'];
const employees = ['Admin', 'Danny Garritas', 'Osvaldo Rodriguez', 'Usuario1', 'Usuario2'];

export function OpenCashRegisterModal({ isOpen, onClose }: OpenCashRegisterModalProps) {
  const { openCashRegister, isCashRegisterOpen } = useCashRegister();
  const [selectedCashRegister, setSelectedCashRegister] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('Admin');
  const [initialAmount, setInitialAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!selectedCashRegister) {
      toast.error('Por favor selecciona una caja registradora');
      return;
    }

    if (!initialAmount || parseFloat(initialAmount) < 0) {
      toast.error('Por favor ingresa un monto inicial válido');
      return;
    }

    if (isCashRegisterOpen(selectedCashRegister)) {
      toast.error(`${selectedCashRegister} ya está abierta`);
      return;
    }

    try {
      openCashRegister(
        selectedCashRegister,
        selectedEmployee,
        parseFloat(initialAmount),
        description || 'Apertura de turno'
      );

      toast.success(`${selectedCashRegister} abierta exitosamente`, {
        description: `Monto inicial: $${parseFloat(initialAmount).toFixed(2)}`,
      });

      // Reset form
      setSelectedCashRegister('');
      setSelectedEmployee('Admin');
      setInitialAmount('');
      setDescription('');
      onClose();
    } catch (error: any) {
      toast.error('Error al abrir caja', {
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">Abrir Caja</h2>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Apertura de turno</p>
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
              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2">Caja Registradora</Label>
                <Select value={selectedCashRegister} onValueChange={setSelectedCashRegister}>
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]">
                    <SelectValue placeholder="Selecciona una caja" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-xl">
                    {cashRegisters.map(cr => (
                      <SelectItem key={cr} value={cr} className="text-[var(--odin-text-primary)]">
                        {cr}
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
                <Label className="text-[var(--odin-text-primary)] mb-2">Monto Inicial</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label className="text-[var(--odin-text-primary)] mb-2">Descripción (Opcional)</Label>
                <Input
                  placeholder="Apertura de turno matutino"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
                />
              </div>
            </div>

            {/* Actions */}
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
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 text-white"
              >
                Abrir Caja
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}