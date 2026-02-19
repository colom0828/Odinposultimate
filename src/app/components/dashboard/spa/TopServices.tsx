'use client';

import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { TopService } from '../../../types/dashboard.types';

interface Props {
  services: TopService[];
}

export function TopServices({ services }: Props) {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return { Icon: LucideIcons.TrendingUp, color: 'text-green-400' };
    if (trend === 'down') return { Icon: LucideIcons.TrendingDown, color: 'text-red-400' };
    return { Icon: LucideIcons.Minus, color: 'text-slate-400' };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Cabello': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Uñas': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Masajes': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Facial': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <LucideIcons.Star className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Servicios Más Solicitados</h2>
            <p className="text-sm text-muted-foreground">Top 5 del día</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const { Icon: TrendIcon, color: trendColor } = getTrendIcon(service.trend);
          const ServiceIcon = (LucideIcons as any)[service.icon] || LucideIcons.Star;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-xl hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                {/* Ranking */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 font-bold text-white">
                  #{index + 1}
                </div>

                {/* Ícono del servicio */}
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <ServiceIcon className="w-5 h-5 text-purple-400" />
                </div>

                {/* Información */}
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">{service.name}</p>
                  <Badge className={getCategoryColor(service.category)}>
                    {service.category}
                  </Badge>
                </div>

                {/* Cantidad */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{service.count}</p>
                  <p className="text-xs text-muted-foreground">servicios</p>
                </div>

                {/* Tendencia */}
                <div className="hidden lg:block">
                  <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
