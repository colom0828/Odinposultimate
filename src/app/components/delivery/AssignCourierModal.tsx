import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { DeliveryCourier, COURIER_VEHICLE_CONFIG } from '../../types/delivery.types';

interface AssignCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (courier: DeliveryCourier) => void;
  orderNumber: string;
  couriers: DeliveryCourier[];
}

export function AssignCourierModal({
  isOpen,
  onClose,
  onAssign,
  orderNumber,
  couriers,
}: AssignCourierModalProps) {
  const [selectedCourier, setSelectedCourier] = useState<DeliveryCourier | null>(null);

  const handleAssign = () => {
    if (selectedCourier) {
      onAssign(selectedCourier);
      setSelectedCourier(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCourier(null);
    onClose();
  };

  // Filtrar solo repartidores disponibles
  const availableCouriers = couriers.filter(c => c.disponible);

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
                {availableCouriers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <LucideIcons.UserX className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      No hay repartidores disponibles
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Todos los repartidores están ocupados en este momento
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableCouriers.map((courier) => {
                      const isSelected = selectedCourier?.id === courier.id;
                      const VehicleIcon = LucideIcons[COURIER_VEHICLE_CONFIG[courier.vehiculo].icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

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
                                  {courier.nombre}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {courier.telefono}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <LucideIcons.CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${COURIER_VEHICLE_CONFIG[courier.vehiculo].color} ${isSelected ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700'}`}>
                              <VehicleIcon className="w-4 h-4" />
                              <span className="text-xs font-semibold">
                                {COURIER_VEHICLE_CONFIG[courier.vehiculo].label}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {courier.pedidosActivos} pedidos activos
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
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