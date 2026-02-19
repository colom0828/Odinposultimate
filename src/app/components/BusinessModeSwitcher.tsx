'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Utensils,
  Sparkles,
  Wrench,
  ShoppingBag,
  Coffee,
  Wine,
  Laptop,
  ChevronRight,
  CheckCircle2,
  Loader2,
  X,
  Info
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useConfig } from '../contexts/ConfigContext';
import { BusinessType } from '../types/config.types';
import { switchBusinessType } from '../services/configService';

// Mapa de iconos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Store,
  Utensils,
  Sparkles,
  Wrench,
  ShoppingBag,
  Coffee,
  Wine,
  Laptop,
};

const BUSINESS_TYPES = [
  {
    type: BusinessType.RESTAURANT,
    label: 'Restaurante',
    icon: 'Utensils',
    color: 'purple',
    description: 'Mesas, cocina, delivery',
  },
  {
    type: BusinessType.SPA,
    label: 'Spa / Salón',
    icon: 'Sparkles',
    color: 'pink',
    description: 'Citas, servicios, estilistas',
  },
  {
    type: BusinessType.HARDWARE,
    label: 'Ferretería',
    icon: 'Wrench',
    color: 'orange',
    description: 'Retail, inventario',
  },
  {
    type: BusinessType.RETAIL,
    label: 'Retail',
    icon: 'ShoppingBag',
    color: 'blue',
    description: 'Venta minorista',
  },
  {
    type: BusinessType.CAFE,
    label: 'Café',
    icon: 'Coffee',
    color: 'amber',
    description: 'Cafetería',
  },
  {
    type: BusinessType.BAR,
    label: 'Bar',
    icon: 'Wine',
    color: 'rose',
    description: 'Bar / Bebidas',
  },
  {
    type: BusinessType.TECH_SERVICE,
    label: 'Servicio Técnico',
    icon: 'Laptop',
    color: 'cyan',
    description: 'Reparaciones',
  },
];

export function BusinessModeSwitcher() {
  const { config, refreshConfig } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentBusinessType = config?.businessType || BusinessType.RESTAURANT;
  const currentBusiness = BUSINESS_TYPES.find(b => b.type === currentBusinessType) || BUSINESS_TYPES[0];

  const handleSwitch = async (type: BusinessType) => {
    if (type === currentBusinessType || isChanging) return;
    
    setIsChanging(true);
    try {
      await switchBusinessType(type);
      await refreshConfig();
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Cerrar panel con animación
      setTimeout(() => {
        setIsOpen(false);
        setIsChanging(false);
        
        // Ocultar mensaje después de cerrar panel
        setTimeout(() => setShowSuccess(false), 2000);
      }, 800);
    } catch (error) {
      console.error('Error switching business type:', error);
      setIsChanging(false);
    }
  };

  const IconComponent = ICON_MAP[currentBusiness.icon] || Store;

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Cambiar modo de negocio"
      >
        <IconComponent className="w-6 h-6 text-white" />
      </motion.button>

      {/* Panel flotante */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">Modo de Negocio</h2>
                    <p className="text-sm text-muted-foreground">Selecciona el tipo de negocio</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Modo actual */}
                <Card className={`bg-gradient-to-br from-${currentBusiness.color}-500/20 to-${currentBusiness.color}-600/10 border-${currentBusiness.color}-500/30 p-4`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-3 bg-${currentBusiness.color}-500/20 rounded-xl`}>
                      <IconComponent className={`w-6 h-6 text-${currentBusiness.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Modo Actual</p>
                      <p className="text-lg font-bold text-foreground">{currentBusiness.label}</p>
                    </div>
                    <Badge className={`bg-${currentBusiness.color}-500/20 text-${currentBusiness.color}-400 border-${currentBusiness.color}-500/30`}>
                      Activo
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentBusiness.description}</p>
                </Card>

                {/* Separador */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-4">Cambiar a:</p>
                </div>

                {/* Lista de modos */}
                <div className="space-y-3">
                  {BUSINESS_TYPES.filter(b => b.type !== currentBusinessType).map((business) => {
                    const Icon = ICON_MAP[business.icon] || Store;
                    
                    return (
                      <motion.button
                        key={business.type}
                        onClick={() => handleSwitch(business.type)}
                        disabled={isChanging}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 bg-card border border-border rounded-xl hover:border-${business.color}-500/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 bg-${business.color}-500/10 rounded-lg`}>
                            <Icon className={`w-5 h-5 text-${business.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{business.label}</p>
                            <p className="text-sm text-muted-foreground">{business.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Info */}
                <Card className="bg-blue-500/10 border-blue-500/30 p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400 mb-1">Información</p>
                      <p className="text-xs text-muted-foreground">
                        Al cambiar el modo, el dashboard y los módulos se adaptarán automáticamente sin recargar la página.
                      </p>
                    </div>
                  </div>
                </Card>

                {isChanging && (
                  <div className="flex items-center justify-center space-x-3 p-4">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    <p className="text-sm text-muted-foreground">Cambiando modo...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notificación de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="bg-green-500/20 border-green-500/50 p-4 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-400">¡Modo cambiado!</p>
                  <p className="text-sm text-muted-foreground">Dashboard actualizado</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}