'use client';

import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import {
  Sale,
  SALE_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  SALE_TYPE_CONFIG,
} from '../../types/sales.types';

interface SaleDetailModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SaleDetailModal({ sale, isOpen, onClose }: SaleDetailModalProps) {
  if (!sale) return null;

  const statusConfig = SALE_STATUS_CONFIG[sale.status];
  const typeConfig = SALE_TYPE_CONFIG[sale.type];
  const StatusIcon = LucideIcons[statusConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  const TypeIcon = LucideIcons[typeConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-border pointer-events-auto"
            >
              {/* Header */}
              <div className="relative overflow-hidden bg-secondary p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">
                        {sale.saleNumber}
                      </h2>
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full ${statusConfig.bgLight} border ${statusConfig.borderColor}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.textColor}`} />
                        <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                      <span>{typeConfig.label}</span>
                      <span>•</span>
                      <span>{formatDate(sale.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                  >
                    <LucideIcons.X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Cliente */}
                  {sale.customer && (
                    <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                      <div className="flex items-center space-x-2 mb-3">
                        <LucideIcons.User className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-semibold text-foreground">Cliente</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nombre:</span>
                          <span className="text-foreground font-medium">{sale.customer.name}</span>
                        </div>
                        {sale.customer.phone && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Teléfono:</span>
                            <span className="text-foreground font-medium">{sale.customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <LucideIcons.ShoppingCart className="w-4 h-4 text-green-400" />
                      <h3 className="text-sm font-semibold text-foreground">Productos</h3>
                    </div>
                    <div className="space-y-2">
                      {sale.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} x {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            {formatCurrency(item.subtotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totales */}
                  <div className="bg-secondary/70 rounded-xl p-4 border border-border">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(sale.subtotal)}</span>
                      </div>
                      {sale.discount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Descuento:</span>
                          <span className="font-medium">-{formatCurrency(sale.discount)}</span>
                        </div>
                      )}
                      {sale.tax > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>IVA (16%):</span>
                          <span className="font-medium">{formatCurrency(sale.tax)}</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between text-foreground">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-2xl font-bold">{formatCurrency(sale.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métodos de Pago */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <LucideIcons.Wallet className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-semibold text-foreground">Métodos de Pago</h3>
                    </div>
                    <div className="space-y-2">
                      {sale.payments.map((payment, index) => {
                        const paymentConfig = PAYMENT_METHOD_CONFIG[payment.method];
                        const PaymentIcon = LucideIcons[paymentConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                        
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg ${paymentConfig.bg} flex items-center justify-center`}>
                                <PaymentIcon className={`w-4 h-4 ${paymentConfig.color}`} />
                              </div>
                              <span className="text-sm font-medium text-foreground">{paymentConfig.label}</span>
                            </div>
                            <span className="text-sm font-bold text-foreground">
                              {formatCurrency(payment.amount)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cajero:</span>
                        <span className="text-foreground font-medium">{sale.cashierName}</span>
                      </div>
                      {sale.tableNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mesa:</span>
                          <span className="text-foreground font-medium">#{sale.tableNumber}</span>
                        </div>
                      )}
                      {sale.invoiceNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Factura:</span>
                          <span className="text-foreground font-medium">{sale.invoiceNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-secondary/50 border-t border-border">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-accent text-foreground font-medium transition-all"
                  >
                    Cerrar
                  </button>
                  <button
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/50 text-white font-medium transition-all"
                  >
                    <LucideIcons.Printer className="w-4 h-4" />
                    <span>Imprimir</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}