'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: 'moto' | 'bicicleta' | 'auto';
  available: boolean;
}

interface AssignCourierModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (courierId: string, courierName: string) => void;
  orderNumber: string;
}

// Mock de repartidores
const MOCK_COURIERS: Courier[] = [
  { id: 'c1', name: 'Carlos Ramírez', phone: '555-0101', vehicle: 'moto', available: true },
  { id: 'c2', name: 'Ana López', phone: '555-0102', vehicle: 'bicicleta', available: true },
  { id: 'c3', name: 'Miguel Torres', phone: '555-0103', vehicle: 'moto', available: true },
  { id: 'c4', name: 'David Hernández', phone: '555-0105', vehicle: 'auto', available: true },
];

export function AssignCourierModalSimple({
  isOpen,
  onClose,
  onAssign,
  orderNumber,
}: AssignCourierModalSimpleProps) {
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  const handleAssign = () => {
    if (selectedCourier) {
      onAssign(selectedCourier.id, selectedCourier.name);
      setSelectedCourier(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCourier(null);
    onClose();
  };

  const vehicleIcons = {
    moto: 'Bike',
    bicicleta: 'Bike',
    auto: 'Car',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <LucideIcons.UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Asignar Repartidor
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Pedido {orderNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                >
                  <LucideIcons.X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_COURIERS.filter(c => c.available).map((courier) => {
                    const isSelected = selectedCourier?.id === courier.id;
                    const VehicleIcon = LucideIcons[vehicleIcons[courier.vehicle] as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

                    return (
                      <motion.button
                        key={courier.id}
                        onClick={() => setSelectedCourier(courier)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-4 rounded-xl border-2 transition-all text-left
                          ${isSelected
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center
                              ${isSelected 
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                : 'bg-slate-100 dark:bg-slate-700'
                              }
                            `}>
                              <LucideIcons.User className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                            </div>
                            <div>
                              <h4 className={`font-semibold ${isSelected ? 'text-purple-900 dark:text-purple-300' : 'text-slate-900 dark:text-white'}`}>
                                {courier.name}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {courier.phone}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <LucideIcons.CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>

                        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          <VehicleIcon className="w-4 h-4" />
                          <span className="text-xs font-semibold capitalize">
                            {courier.vehicle}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedCourier}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-semibold transition-all"
                >
                  Asignar Repartidor
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
