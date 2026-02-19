'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { PAYMENT_METHOD_CONFIG, PaymentMethod } from '../../types/sales.types';

interface PaymentMethodData {
  method: PaymentMethod;
  amount: number;
  count: number;
}

interface PaymentMethodsChartProps {
  data: PaymentMethodData[];
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
          <LucideIcons.PieChart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Métodos de Pago</h2>
          <p className="text-sm text-slate-400">Distribución de ventas por método</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const config = PAYMENT_METHOD_CONFIG[item.method];
          const Icon = LucideIcons[config.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
          const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;

          return (
            <motion.div
              key={item.method}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{config.label}</p>
                    <p className="text-xs text-slate-400">{item.count} transacciones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-slate-400">{percentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className={`h-full ${config.bg}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Total</span>
          <span className="text-lg font-bold text-white">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
