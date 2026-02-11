'use client';

import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatCurrency } from '../utils/formatters';
import { useSales } from '../hooks/useSales';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashier?: string;
}

const availableProducts = [
  { id: 'P001', name: 'Laptop Dell XPS 15', price: 1200 },
  { id: 'P002', name: 'Mouse Logitech MX Master', price: 100 },
  { id: 'P003', name: 'Teclado Mecánico Keychron', price: 120 },
  { id: 'P004', name: 'Monitor LG 27"', price: 400 },
  { id: 'P005', name: 'Auriculares Sony WH-1000XM4', price: 300 },
  { id: 'P006', name: 'Webcam Logitech C920', price: 80 },
  { id: 'P007', name: 'SSD Samsung 1TB', price: 150 },
  { id: 'P008', name: 'Memoria RAM 16GB', price: 90 },
];

export function NewSaleModal({ isOpen, onClose, cashier = 'Admin' }: NewSaleModalProps) {
  const { addSale } = useSales();
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    
    const product = availableProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setProducts([...products, { ...product, quantity: 1 }]);
    }
    setSelectedProductId('');
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newQuantity = Math.max(1, p.quantity + change);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };

  const handleSubmit = () => {
    if (!customerName.trim()) {
      toast.error('Por favor ingresa el nombre del cliente');
      return;
    }

    if (products.length === 0) {
      toast.error('Por favor agrega al menos un producto');
      return;
    }

    const newSale = addSale({
      customer: customerName,
      items: products.reduce((sum, p) => sum + p.quantity, 0),
      total: calculateTotal(),
      payment: paymentMethod,
      status: 'completed',
      cashier,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
    });

    toast.success('Venta registrada exitosamente', {
      description: `Venta #${newSale.id} - ${formatCurrency(newSale.total)}`,
    });

    // Reset form
    setCustomerName('');
    setPaymentMethod('Efectivo');
    setProducts([]);
    onClose();
  };

  const total = calculateTotal();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">Nueva Venta</h2>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Cajero: {cashier}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[var(--odin-input-bg)] hover:bg-red-500/20 border border-[var(--odin-border)] hover:border-red-500/50 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-[var(--odin-text-secondary)]" />
              </button>
            </div>

            {/* Customer info */}
            <div className="mb-6 space-y-4">
              <div>
                <Label htmlFor="customer" className="text-[var(--odin-text-primary)] mb-2">Nombre del Cliente</Label>
                <Input
                  id="customer"
                  placeholder="Ingresa el nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
                />
              </div>

              <div>
                <Label htmlFor="payment" className="text-[var(--odin-text-primary)] mb-2">Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-xl">
                    <SelectItem value="Efectivo" className="text-[var(--odin-text-primary)]">💵 Efectivo</SelectItem>
                    <SelectItem value="Tarjeta" className="text-[var(--odin-text-primary)]">💳 Tarjeta</SelectItem>
                    <SelectItem value="Transferencia" className="text-[var(--odin-text-primary)]">🏦 Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add product */}
            <div className="mb-6">
              <Label className="text-[var(--odin-text-primary)] mb-2">Agregar Producto</Label>
              <div className="flex gap-2">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="flex-1 bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]">
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-xl max-h-60">
                    {availableProducts.map(product => (
                      <SelectItem key={product.id} value={product.id} className="text-[var(--odin-text-primary)]">
                        {product.name} - {formatCurrency(product.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddProduct}
                  disabled={!selectedProductId}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products list */}
            <div className="mb-6">
              <Label className="text-[var(--odin-text-primary)] mb-2">Productos ({products.length})</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {products.length === 0 ? (
                  <div className="text-center py-8 text-[var(--odin-text-secondary)]">
                    No hay productos agregados
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-[var(--odin-input-bg)] border border-[var(--odin-border)] rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[var(--odin-text-primary)]">{product.name}</p>
                        <p className="text-sm text-[var(--odin-text-secondary)]">
                          {formatCurrency(product.price)} × {product.quantity} = {formatCurrency(product.price * product.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(product.id, -1)}
                          className="w-7 h-7 rounded bg-[var(--odin-bg-card)] border border-[var(--odin-border)] hover:bg-purple-500/10 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 text-[var(--odin-text-primary)]" />
                        </button>
                        <span className="w-8 text-center font-bold text-[var(--odin-text-primary)]">{product.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                          className="w-7 h-7 rounded bg-[var(--odin-bg-card)] border border-[var(--odin-border)] hover:bg-purple-500/10 flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 text-[var(--odin-text-primary)]" />
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="w-7 h-7 rounded bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 flex items-center justify-center ml-2"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[var(--odin-text-primary)]">Total:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-red-500/10 hover:border-red-500/50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={products.length === 0 || !customerName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Registrar Venta
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
