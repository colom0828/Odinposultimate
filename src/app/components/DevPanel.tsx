import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, X, Store, Utensils, Wrench, Sparkles } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { BusinessType } from '../types/config.types';
import { switchBusinessType } from '../services/configService';

/**
 * ODIN POS - Panel de Desarrollo
 * Permite cambiar el tipo de negocio para probar el renderizado dinámico
 * Solo para desarrollo - no incluir en producción
 */

interface BusinessTypeOption {
  type: BusinessType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const businessTypes: BusinessTypeOption[] = [
  {
    type: BusinessType.RESTAURANT,
    label: 'Restaurante / Bar',
    description: 'Con mesas, cocina y delivery',
    icon: Utensils,
    color: 'from-orange-500 to-red-500',
  },
  {
    type: BusinessType.SPA,
    label: 'Spa / Salón / Uñas',
    description: 'Citas, servicios y agenda',
    icon: Sparkles,
    color: 'from-pink-500 to-purple-500',
  },
  {
    type: BusinessType.HARDWARE,
    label: 'Ferretería',
    description: 'Inventario, compras y proveedores',
    icon: Wrench,
    color: 'from-gray-600 to-gray-800',
  },
  {
    type: BusinessType.RETAIL,
    label: 'Tienda Minorista',
    description: 'Venta al detalle sin mesas',
    icon: Store,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    type: BusinessType.TECH_SERVICE,
    label: 'Servicio Técnico',
    description: 'Órdenes técnicas y citas',
    icon: Wrench,
    color: 'from-purple-500 to-pink-500',
  },
];

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { config, refreshConfig } = useConfig();

  // Deshabilitado - funcionalidad duplicada con BusinessModeSwitcher
  return null;
}