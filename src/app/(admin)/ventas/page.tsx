'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { useSalesStore, createMockSale } from '../../store/salesStore';
import { SaleDetailModal } from '../../components/ventas/SaleDetailModal';
import {
  Sale,
  SaleStatus,
  PaymentMethod,
  SaleType,
  SalesFilters,
  SALE_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  SALE_TYPE_CONFIG,
} from '../../types/sales.types';

export default function VentasPage() {
  const sales = useSalesStore((state) => state.sales);
  const getStats = useSalesStore((state) => state.getStats);
  const getTodayStats = useSalesStore((state) => state.getTodayStats);
  const getFilteredSales = useSalesStore((state) => state.getFilteredSales);

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [statusFilter, setStatusFilter] = useState<SaleStatus[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod[]>([]);

  // Inicializar con ventas mock (solo si no hay ventas)
  useEffect(() => {
    if (sales.length === 0) {
      // Crear algunas ventas de ejemplo
      for (let i = 0; i < 8; i++) {
        createMockSale();
      }
    }
  }, []);

  // Construir filtros
  const filters: SalesFilters = useMemo(() => {
    const f: SalesFilters = {
      searchTerm,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      paymentMethod: paymentFilter.length > 0 ? paymentFilter : undefined,
    };

    // Filtro de fecha
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      f.dateFrom = today.toISOString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      f.dateFrom = weekAgo.toISOString();
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      f.dateFrom = monthAgo.toISOString();
    }

    return f;
  }, [searchTerm, dateFilter, statusFilter, paymentFilter]);

  // Aplicar filtros
  const filteredSales = useMemo(() => {
    return getFilteredSales(filters);
  }, [filters, sales, getFilteredSales]);

  // Estadísticas del período seleccionado
  const stats = useMemo(() => {
    return getStats(filters);
  }, [filters, sales, getStats]);

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Abrir detalle
  const handleViewDetail = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  // Toggle filtro de estado
  const toggleStatusFilter = (status: SaleStatus) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Toggle filtro de pago
  const togglePaymentFilter = (method: PaymentMethod) => {
    setPaymentFilter(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Ventas</h1>
            <p className="text-muted-foreground">
              Gestión y seguimiento de todas las transacciones del POS
            </p>
          </div>

          <button
            onClick={createMockSale}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <LucideIcons.Plus className="w-5 h-5" />
            <span>Simular Venta</span>
          </button>
        </motion.div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Ventas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Total Ventas</p>
                <p className="text-4xl font-bold text-white">{formatCurrency(stats.totalAmount)}</p>
                <p className="text-blue-200 text-xs mt-2">{stats.totalSales} transacciones</p>
              </div>
              <LucideIcons.TrendingUp className="w-12 h-12 text-blue-200/50" />
            </div>
          </motion.div>

          {/* Ticket Promedio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-2">Ticket Promedio</p>
                <p className="text-4xl font-bold text-white">{formatCurrency(stats.averageTicket)}</p>
                <p className="text-purple-200 text-xs mt-2">Por transacción</p>
              </div>
              <LucideIcons.Receipt className="w-12 h-12 text-purple-200/50" />
            </div>
          </motion.div>

          {/* Completadas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Completadas</p>
                <p className="text-5xl font-bold text-white">{stats.completedCount}</p>
                <p className="text-green-200 text-xs mt-2">Ventas exitosas</p>
              </div>
              <LucideIcons.CheckCircle className="w-12 h-12 text-green-200/50" />
            </div>
          </motion.div>

          {/* Pendientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-2">Pendientes</p>
                <p className="text-5xl font-bold text-white">{stats.pendingCount}</p>
                <p className="text-orange-200 text-xs mt-2">En proceso</p>
              </div>
              <LucideIcons.Clock className="w-12 h-12 text-orange-200/50" />
            </div>
          </motion.div>
        </div>

        {/* Filtros y Búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por número de venta, cliente, factura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Filtros por período */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground">Período:</span>
              {(['today', 'week', 'month', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setDateFilter(period)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    dateFilter === period
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {period === 'today' && 'Hoy'}
                  {period === 'week' && 'Semana'}
                  {period === 'month' && 'Mes'}
                  {period === 'all' && 'Todas'}
                </button>
              ))}
            </div>

            {/* Filtros por estado */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground">Estado:</span>
              {Object.entries(SALE_STATUS_CONFIG).map(([status, config]) => {
                const Icon = LucideIcons[config.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                const isActive = statusFilter.includes(status as SaleStatus);
                
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status as SaleStatus)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      isActive
                        ? `${config.bgLight} ${config.textColor} border ${config.borderColor}`
                        : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filtros por método de pago */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground">Pago:</span>
              {Object.entries(PAYMENT_METHOD_CONFIG).map(([method, config]) => {
                const Icon = LucideIcons[config.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                const isActive = paymentFilter.includes(method as PaymentMethod);
                
                return (
                  <button
                    key={method}
                    onClick={() => togglePaymentFilter(method as PaymentMethod)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      isActive
                        ? `${config.bg} ${config.color} border border-current`
                        : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tabla de Ventas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Venta
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <LucideIcons.SearchX className="w-16 h-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-foreground">
                          No se encontraron ventas
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchTerm || statusFilter.length > 0 || paymentFilter.length > 0
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Las ventas del POS aparecerán aquí'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => {
                    const statusConfig = SALE_STATUS_CONFIG[sale.status];
                    const typeConfig = SALE_TYPE_CONFIG[sale.type];
                    const StatusIcon = LucideIcons[statusConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                    const TypeIcon = LucideIcons[typeConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                    const primaryPayment = sale.payments[0];
                    const paymentConfig = PAYMENT_METHOD_CONFIG[primaryPayment.method];
                    const PaymentIcon = LucideIcons[paymentConfig.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

                    return (
                      <tr
                        key={sale.id}
                        className="hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetail(sale)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-foreground">
                            {sale.saleNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground">
                            {sale.customer?.name || 'Cliente General'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                            <span className="text-sm text-foreground">{typeConfig.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{formatDate(sale.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-foreground">
                            {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <PaymentIcon className={`w-4 h-4 ${paymentConfig.color}`} />
                            <span className="text-sm text-foreground">{paymentConfig.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-foreground">
                            {formatCurrency(sale.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full ${statusConfig.bgLight} border ${statusConfig.borderColor}`}>
                            <StatusIcon className={`w-3 h-3 ${statusConfig.textColor}`} />
                            <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(sale);
                              }}
                              className="p-2 rounded-lg bg-secondary border border-border hover:bg-blue-600/20 hover:border-blue-500/50 text-muted-foreground hover:text-blue-400 transition-all"
                            >
                              <LucideIcons.Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-lg bg-secondary border border-border hover:bg-green-600/20 hover:border-green-500/50 text-muted-foreground hover:text-green-400 transition-all"
                            >
                              <LucideIcons.Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal de Detalle */}
      <SaleDetailModal
        sale={selectedSale}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedSale(null);
        }}
      />
    </div>
  );
}