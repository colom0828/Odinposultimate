'use client';

import { LayoutDashboard, Package, Users, ShoppingBag, Printer, CreditCard, UserCircle, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { usePathname } from './usePathname';
import { OdinLogo } from './OdinLogo';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Inventario', href: '/admin/inventario', icon: Package },
  { name: 'Proveedores', href: '/admin/proveedores', icon: ShoppingBag },
  { name: 'Órdenes de compra', href: '/admin/ordenes', icon: ShoppingBag },
  { name: 'Impresoras', href: '/admin/impresoras', icon: Printer },
  { name: 'Caja registradora', href: '/admin/caja', icon: CreditCard },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Empleados', href: '/admin/empleados', icon: UserCircle },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-purple-500/20 flex flex-col"
    >
      {/* Logo Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-20 flex items-center px-6 border-b border-purple-500/20"
      >
        <div className="flex items-center space-x-3">
          <OdinLogo size="sm" />
          <div>
            <h1 className="text-lg font-bold text-white">ODIN POS</h1>
            <p className="text-xs text-slate-400">Panel de administración</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
            >
              <motion.a
                href={item.href}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'text-slate-400 hover:bg-purple-500/10 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </motion.a>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="p-4 border-t border-purple-500/20"
      >
        <div className="text-xs text-slate-500 text-center">
          <p>Versión 1.0.0</p>
        </div>
      </motion.div>
    </motion.aside>
  );
}