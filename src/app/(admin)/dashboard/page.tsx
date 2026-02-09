'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { formatCurrency } from '../../utils/formatters';

const stats = [
  {
    title: 'Ventas de Hoy',
    value: 12450,
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    iconBg: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Órdenes Totales',
    value: 48,
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    iconBg: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Productos Vendidos',
    value: 186,
    change: '+15.3%',
    trend: 'up',
    icon: Package,
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    iconBg: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Clientes Activos',
    value: 32,
    change: '-2.4%',
    trend: 'down',
    icon: Users,
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    iconBg: 'from-orange-500 to-red-500',
  },
];

const recentSales = [
  { id: '001', customer: 'María González', amount: 450, time: 'Hace 5 min', status: 'completed' },
  { id: '002', customer: 'Carlos Ruiz', amount: 280, time: 'Hace 12 min', status: 'completed' },
  { id: '003', customer: 'Ana Martínez', amount: 890, time: 'Hace 25 min', status: 'pending' },
  { id: '004', customer: 'Luis Fernández', amount: 320, time: 'Hace 1 hora', status: 'completed' },
  { id: '005', customer: 'Sofia López', amount: 625, time: 'Hace 2 horas', status: 'completed' },
];

const topProducts = [
  { name: 'Laptop Dell XPS 15', sold: 24, revenue: 28800 },
  { name: 'Mouse Logitech MX Master', sold: 45, revenue: 4500 },
  { name: 'Teclado Mecánico Keychron', sold: 32, revenue: 3840 },
  { name: 'Monitor LG 27"', sold: 18, revenue: 7200 },
  { name: 'Auriculares Sony WH-1000XM4', sold: 28, revenue: 8400 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Resumen general del sistema</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const displayValue = stat.title === 'Ventas de Hoy' ? formatCurrency(stat.value) : stat.value.toString();
          
          return (
            <Card key={stat.title} className={`bg-gradient-to-br from-slate-900/50 ${stat.gradient} backdrop-blur-sm border ${stat.border} p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-2">{displayValue}</p>
                <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent sales */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ventas Recientes</h3>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-purple-500/20 hover:bg-purple-500/10 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-white">{sale.customer}</p>
                  <p className="text-sm text-slate-400">Venta #{sale.id} • {sale.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(sale.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sale.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {sale.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top products */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/20 border-blue-500/20 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Productos Más Vendidos</h3>
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
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-slate-400">{product.sold} unidades vendidas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}