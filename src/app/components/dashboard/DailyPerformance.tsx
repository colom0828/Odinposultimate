import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { DailyPerformance as DailyPerformanceType } from '../../types/dashboard.types';

interface DailyPerformanceProps {
  performance: DailyPerformanceType;
}

export function DailyPerformance({ performance }: DailyPerformanceProps) {
  // Validaciones de seguridad
  if (!performance || !performance.topProducts || !performance.topCategory) {
    return null;
  }

  const { topProducts, topCategory } = performance;

  // Calcular total de órdenes de todas las categorías
  const totalOrders = topCategory.orders || 0;
  const categoryPercentage = 100; // La categoría top siempre es 100%

  // Datos mock para otras categorías top (esto debería venir de props en producción)
  const topCategories = [
    { name: topCategory.name || 'Sin datos', orders: topCategory.orders || 0, icon: topCategory.icon || '📦', percentage: 100 },
    { name: 'Hamburguesas', orders: 51, icon: '🍔', percentage: 76 },
    { name: 'Pastas', orders: 38, icon: '🍝', percentage: 57 },
    { name: 'Bebidas', orders: 29, icon: '🥤', percentage: 43 },
  ];

  // Horario pico (mock data - debería venir de props)
  const peakHour = {
    time: '20:00 - 21:00',
    orders: 23,
    percentage: 85,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
          <LucideIcons.TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Rendimiento del Día</h2>
          <p className="text-sm text-muted-foreground">Top performers y estadísticas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Izquierda: Productos Más Vendidos */}
        <div className="bg-card/50 rounded-2xl border border-border p-6">
          <div className="flex items-center space-x-2 mb-5">
            <LucideIcons.Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-base font-bold text-foreground">Productos Más Vendidos</h3>
          </div>

          <div className="space-y-3">
            {topProducts.map((product, index) => {
              const isFirst = index === 0;
              const medalColors = ['bg-yellow-500', 'bg-slate-400', 'bg-orange-600', 'bg-slate-600', 'bg-slate-600'];
              const trendIcons = {
                up: LucideIcons.TrendingUp,
                down: LucideIcons.TrendingDown,
                neutral: LucideIcons.Minus,
              };
              const TrendIcon = trendIcons[product.trend];
              const trendColors = {
                up: 'text-green-400',
                down: 'text-red-400',
                neutral: 'text-slate-400',
              };

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    isFirst
                      ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {/* Posición */}
                  <div
                    className={`w-8 h-8 rounded-lg ${medalColors[index] || 'bg-muted'} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                  </div>

                  {/* Info del Producto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>

                  {/* Unidades */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{product.units}</p>
                    <p className="text-xs text-muted-foreground">unidades</p>
                  </div>

                  {/* Trend */}
                  <TrendIcon className={`w-4 h-4 ${trendColors[product.trend]} flex-shrink-0`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Categorías + Horario Pico */}
        <div className="space-y-6">
          {/* Top Categorías */}
          <div className="bg-card/50 rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <LucideIcons.BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-foreground">Top Categorías</h3>
              </div>
              <span className="text-xs text-muted-foreground">{totalOrders} órdenes totales</span>
            </div>

            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-semibold text-foreground">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground">{category.orders}</span>
                      <span className="text-xs text-muted-foreground">órdenes</span>
                    </div>
                  </div>
                  {/* Barra de progreso */}
                  <div className="relative h-2 bg-secondary/70 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        index === 0
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                          : index === 1
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                          : index === 2
                          ? 'bg-gradient-to-r from-green-600 to-green-500'
                          : 'bg-gradient-to-r from-orange-600 to-orange-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Horario Pico */}
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl border border-orange-500/30 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <LucideIcons.Clock className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-orange-600 dark:text-orange-300 font-semibold uppercase mb-1">Horario Pico</p>
                <p className="text-2xl font-bold text-foreground mb-1">{peakHour.time}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-orange-700 dark:text-orange-200">
                    <span className="font-bold">{peakHour.orders}</span> órdenes
                  </p>
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-500/30">
                    <LucideIcons.Flame className="w-3 h-3 text-orange-600 dark:text-orange-300" />
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-300">{peakHour.percentage}% capacidad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}