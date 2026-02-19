'use client';

import { motion } from 'motion/react';
import { 
  AlertCircle,
  Circle,
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  FileText,
  Printer,
  DollarSign,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  ChefHat,
  UtensilsCrossed,
  Calendar,
  Scissors,
  Wrench,
  BarChart3,
  ClipboardList,
  Store,
  Award,
  Utensils,
  ShoppingBag,
  CreditCard,
  UserCircle,
  Boxes,
  Receipt,
  Sparkles
} from 'lucide-react';
import { usePathname } from './usePathname';
import { OdinLogo } from './OdinLogo';
import { Link } from './Link';
import { useConfig } from '../contexts/ConfigContext';
import { LicenseStatus } from '../types/config.types';

/**
 * ODIN POS - Sidebar Dinámico
 * Renderiza módulos según configuración del backend
 */

// Mapa de iconos de lucide-react
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  FileText,
  Printer,
  DollarSign,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  ChefHat,
  UtensilsCrossed,
  Calendar,
  Scissors,
  Wrench,
  BarChart3,
  ClipboardList,
  Circle,
  Utensils,
  ShoppingBag,
  CreditCard,
  UserCircle,
  Boxes,
  Receipt,
  Sparkles
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { config, loading } = useConfig();

  // Mostrar skeleton mientras carga
  if (loading || !config) {
    return <SidebarSkeleton />;
  }

  // Obtener módulos habilitados y ordenarlos
  const navItems = config.enabledModules
    .filter(module => module.enabled)
    .sort((a, b) => a.order - b.order)
    .map(module => ({
      name: module.label,
      href: module.route,
      icon: module.icon,
      requiredPlan: module.requiredPlan,
    }));

  const isLicenseValid = config.license.status === LicenseStatus.ACTIVE || 
                        config.license.status === LicenseStatus.TRIAL;

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-purple-500/20 flex flex-col shadow-xl transition-colors duration-300"
    >
      {/* Logo Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-purple-500/20"
      >
        <div className="flex items-center space-x-3">
          <OdinLogo size="sm" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">ODIN POS</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {config.currentBranch.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* License Warning */}
      {!isLicenseValid && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-500">
                {config.license.status === LicenseStatus.EXPIRED ? 'Licencia vencida' : 'Licencia suspendida'}
              </p>
              <p className="text-xs text-red-400 mt-1">
                Contacte a soporte para renovar
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          // Obtener el icono dinámicamente desde lucide-react
          const IconComponent = ICON_MAP[item.icon] || Circle;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-purple-500/10'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer with business info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="p-4 border-t border-slate-200 dark:border-purple-500/20 space-y-2"
      >
        {/* Business Type Badge */}
        <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg">
          <Store className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {getBusinessTypeLabel(config.businessType)}
          </span>
        </div>

        {/* License Plan */}
        <div className="flex items-center justify-center space-x-2">
          <Award className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Plan {config.license.plan.toUpperCase()}
          </span>
        </div>

        {/* Version */}
        <div className="text-xs text-slate-500 dark:text-slate-500 text-center">
          v{config.version}
        </div>
      </motion.div>
    </motion.aside>
  );
}

/**
 * Skeleton de carga del sidebar
 */
function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-purple-500/20 flex flex-col shadow-xl">
      {/* Logo Header Skeleton */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 px-3 py-3">
            <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </nav>

      {/* Footer Skeleton */}
      <div className="p-4 border-t border-slate-200 dark:border-purple-500/20">
        <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </aside>
  );
}

/**
 * Helper para obtener etiqueta del tipo de negocio
 */
function getBusinessTypeLabel(businessType: string): string {
  const labels: Record<string, string> = {
    retail: 'Tienda',
    hardware: 'Ferretería',
    wholesale: 'Mayorista',
    restaurant: 'Restaurante',
    bar: 'Bar',
    cafe: 'Cafetería',
    fast_food: 'Comida Rápida',
    delivery_only: 'Solo Delivery',
    spa: 'Spa/Salón',
    tech_service: 'Servicio Técnico',
    multi_vertical: 'Multi-vertical',
  };
  
  return labels[businessType] || 'Comercio';
}