import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { RealTimeMetrics } from '../../types/dashboard.types';

interface RealTimeOperationsProps {
  metrics: RealTimeMetrics;
}

export function RealTimeOperations({ metrics }: RealTimeOperationsProps) {
  const cards = [
    {
      title: 'Órdenes Activas',
      value: metrics.activeOrders,
      icon: LucideIcons.ShoppingCart,
      gradient: 'from-blue-600 to-blue-700',
      iconColor: 'text-blue-200',
      description: 'En proceso',
    },
    {
      title: 'En Cocina',
      value: metrics.ordersInKitchen,
      icon: LucideIcons.ChefHat,
      gradient: 'from-orange-600 to-red-600',
      iconColor: 'text-orange-200',
      description: 'Preparando',
    },
    {
      title: 'Delivery en Ruta',
      value: metrics.deliveriesInRoute,
      icon: LucideIcons.Bike,
      gradient: 'from-purple-600 to-purple-700',
      iconColor: 'text-purple-200',
      description: 'En camino',
    },
    {
      title: 'Mesas Ocupadas',
      value: metrics.tablesOccupied,
      icon: LucideIcons.Users,
      gradient: 'from-green-600 to-emerald-600',
      iconColor: 'text-green-200',
      description: `${metrics.tablesFree} libres`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/50">
          <LucideIcons.Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Operación en Tiempo Real</h2>
          <p className="text-sm text-muted-foreground">Estado actual del restaurante</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-xl`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/80 mb-1">{card.title}</p>
                  <p className="text-4xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-white/60 mt-1">{card.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>

              {/* Decoración de fondo */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}