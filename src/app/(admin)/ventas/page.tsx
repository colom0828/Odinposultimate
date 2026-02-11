'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Download, Filter, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useSales } from '../../hooks/useSales';
import { formatCurrency } from '../../utils/formatters';

export default function VentasPage() {
  const { sales, getTotalSales, isLoading } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState<any[]>([]);

  useEffect(() => {
    const filtered = sales.filter(sale =>
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSales(filtered);
  }, [sales, searchTerm]);

  // Escuchar actualizaciones de ventas
  useEffect(() => {
    const handleSalesUpdate = () => {
      const filtered = sales.filter(sale =>
        sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSales(filtered);
    };

    window.addEventListener('sales-updated', handleSalesUpdate);
    return () => window.removeEventListener('sales-updated', handleSalesUpdate);
  }, [sales, searchTerm]);

  const totalSales = getTotalSales();
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'refunded':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--odin-text-secondary)]">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Ventas</h1>
        <p className="text-[var(--odin-text-secondary)]">Gestión y seguimiento de todas las ventas</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total Ventas</p>
          <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{formatCurrency(totalSales)}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Ventas Completadas</p>
          <p className="text-2xl font-bold text-green-400">{completedSales}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Ventas Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingSales}</p>
        </Card>
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--odin-text-secondary)]" />
          <Input
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)]"
          />
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:border-purple-500/50 bg-[var(--odin-input-bg)]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button 
            variant="outline"
            className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:border-purple-500/50 bg-[var(--odin-input-bg)]"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Fecha
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Sales table */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm transition-colors duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--odin-input-bg)] border-b border-[var(--odin-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Pago</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Cajero</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--odin-border)]">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[var(--odin-text-secondary)]">
                      <Search className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-lg font-medium">No se encontraron ventas</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Registra tu primera venta desde la Caja Registradora'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[var(--odin-input-bg)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-[var(--odin-text-primary)]">#{sale.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-[var(--odin-text-primary)]">{sale.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--odin-text-secondary)]">{formatDate(sale.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--odin-text-primary)]">{sale.items}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[var(--odin-text-primary)]">{formatCurrency(sale.total)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--odin-text-secondary)]">{sale.payment}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--odin-text-secondary)]">{sale.cashier}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${getStatusColor(sale.status)} border`}>
                        {getStatusText(sale.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-[var(--odin-input-bg)] border border-[var(--odin-border)] hover:bg-purple-500/10 hover:border-purple-500/50 transition-all">
                          <Eye className="w-4 h-4 text-[var(--odin-text-primary)]" />
                        </button>
                        <button className="p-2 rounded-lg bg-[var(--odin-input-bg)] border border-[var(--odin-border)] hover:bg-purple-500/10 hover:border-purple-500/50 transition-all">
                          <Download className="w-4 h-4 text-[var(--odin-text-primary)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}