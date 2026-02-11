'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
import { formatCurrency } from '../../utils/formatters';
import { useSales } from '../../hooks/useSales';

const topProducts = [
  { name: 'Laptop Dell XPS 15', sold: 24, revenue: 28800 },
  { name: 'Mouse Logitech MX Master', sold: 45, revenue: 4500 },
  { name: 'Teclado Mecánico Keychron', sold: 32, revenue: 3840 },
  { name: 'Monitor LG 27"', sold: 18, revenue: 7200 },
  { name: 'Auriculares Sony WH-1000XM4', sold: 28, revenue: 8400 },
];

export default function DashboardPage() {
  const { sales, getTodaySales, getRecentSales, getTotalSales, isLoading } = useSales();
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayOrders: 0,
    todayItems: 0,
    activeCustomers: 0,
  });

  // Calcular estadísticas del día
  useEffect(() => {
    const todaySales = getTodaySales();
    const completedToday = todaySales.filter(s => s.status === 'completed');
    
    setStats({
      todayTotal: getTotalSales(sale => {
        const saleDate = new Date(sale.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return saleDate >= today;
      }),
      todayOrders: completedToday.length,
      todayItems: completedToday.reduce((sum, sale) => sum + sale.items, 0),
      activeCustomers: new Set(completedToday.map(s => s.customer)).size,
    });
  }, [sales]);

  // Actualizar ventas recientes
  useEffect(() => {
    const recent = getRecentSales(5);
    setRecentSales(recent);
  }, [sales]);

  // Escuchar actualizaciones de ventas
  useEffect(() => {
    const handleSalesUpdate = () => {
      const recent = getRecentSales(5);
      setRecentSales(recent);
    };

    window.addEventListener('sales-updated', handleSalesUpdate);
    return () => window.removeEventListener('sales-updated', handleSalesUpdate);
  }, []);

  // Función para calcular tiempo relativo
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  const statsData = [
    {
      title: 'Ventas de Hoy',
      value: stats.todayTotal,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      iconBg: 'from-green-500 to-emerald-500',
      isCurrency: true,
    },
    {
      title: 'Órdenes Totales',
      value: stats.todayOrders,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      iconBg: 'from-blue-500 to-cyan-500',
      isCurrency: false,
    },
    {
      title: 'Productos Vendidos',
      value: stats.todayItems,
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      iconBg: 'from-purple-500 to-pink-500',
      isCurrency: false,
    },
    {
      title: 'Clientes Activos',
      value: stats.activeCustomers,
      change: stats.activeCustomers > 0 ? '+5.2%' : '0%',
      trend: stats.activeCustomers > 0 ? 'up' : 'down',
      icon: Users,
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
      iconBg: 'from-orange-500 to-red-500',
      isCurrency: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--odin-text-secondary)]">Cargando dashboard...</p>
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
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Dashboard</h1>
        <p className="text-[var(--odin-text-secondary)]">Resumen general del sistema</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const displayValue = stat.isCurrency ? formatCurrency(stat.value) : stat.value.toString();
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Card className={`bg-[var(--odin-bg-card)] ${stat.gradient} backdrop-blur-sm border ${stat.border} p-6 transition-colors duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-[var(--odin-text-secondary)] mb-1">{stat.title}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">{displayValue}</p>
                  <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent sales */}
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--odin-text-primary)]">Ventas Recientes</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              En tiempo real
            </span>
          </div>
          <div className="space-y-4">
            {recentSales.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-[var(--odin-text-secondary)] opacity-50" />
                <p className="text-[var(--odin-text-secondary)]">No hay ventas registradas</p>
                <p className="text-sm text-[var(--odin-text-secondary)] mt-1">Las ventas aparecerán aquí automáticamente</p>
              </div>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)] hover:bg-purple-500/10 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--odin-text-primary)]">{sale.customer}</p>
                    <p className="text-sm text-[var(--odin-text-secondary)]">Venta #{sale.id} • {getRelativeTime(sale.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--odin-text-primary)]">{formatCurrency(sale.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sale.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : sale.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {sale.status === 'completed' ? 'Completado' : sale.status === 'pending' ? 'Pendiente' : 'Reembolsado'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top products */}
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-[var(--odin-text-primary)] mb-4">Productos Más Vendidos</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                  index === 0 ? 'from-yellow-500 to-orange-500' :
                  index === 1 ? 'from-blue-500 to-purple-500' :
                  'from-purple-500 to-pink-500'
                } flex items-center justify-center font-bold text-white text-sm`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--odin-text-primary)]">{product.name}</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">{product.sold} unidades vendidas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--odin-text-primary)]">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}