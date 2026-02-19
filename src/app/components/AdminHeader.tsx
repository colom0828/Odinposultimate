'use client';

import { useState } from 'react';
import { LogOut, Bell, User, X, CheckCheck, Clock, ShoppingCart, Package, Trash2, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { OdinLogo } from './OdinLogo';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useConfig } from '../contexts/ConfigContext';

interface Notification {
  id: number;
  type: 'sale' | 'inventory' | 'order' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'sale',
    title: 'Nueva Venta',
    message: 'Venta #007 completada por $450.00',
    time: 'Hace 5 min',
    read: false
  },
  {
    id: 2,
    type: 'inventory',
    title: 'Stock Bajo',
    message: 'Webcam Logitech C920 tiene stock bajo (0 unidades)',
    time: 'Hace 15 min',
    read: false
  },
  {
    id: 3,
    type: 'order',
    title: 'Orden Aprobada',
    message: 'Orden de compra OC-002 ha sido aprobada',
    time: 'Hace 1 hora',
    read: true
  },
  {
    id: 4,
    type: 'sale',
    title: 'Venta Completada',
    message: 'Venta #006 completada por $280.00',
    time: 'Hace 2 horas',
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: 'Actualización',
    message: 'Sistema actualizado a la versión 2.1.0',
    time: 'Hace 3 horas',
    read: true
  }
];

export function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleLogout = () => {
    // Navegación sin recarga de página
    window.history.pushState({}, '', '/auth/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    if (confirm('¿Estás seguro de eliminar todas las notificaciones?')) {
      setNotifications([]);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="w-5 h-5 text-green-400" />;
      case 'inventory':
        return <Package className="w-5 h-5 text-yellow-400" />;
      case 'order':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  const config = useConfig();

  // Helper para obtener la etiqueta del tipo de negocio
  const getBusinessModeLabel = () => {
    const labels: Record<string, string> = {
      restaurant: 'Restaurante',
      spa: 'Spa/Salón',
      hardware: 'Ferretería',
      retail: 'Tienda',
      tech_service: 'Servicio Técnico',
      bar: 'Bar',
      cafe: 'Cafetería',
      fast_food: 'Comida Rápida',
      wholesale: 'Mayorista',
      delivery_only: 'Delivery',
      multi_vertical: 'Multi-vertical',
    };
    return labels[config.config?.businessType || ''] || 'Comercio';
  };

  // Helper para obtener el color del badge según tipo de negocio
  const getBusinessModeColor = () => {
    const colors: Record<string, string> = {
      restaurant: 'from-orange-500 to-red-500',
      spa: 'from-pink-500 to-purple-500',
      hardware: 'from-gray-600 to-gray-800',
      retail: 'from-blue-500 to-cyan-500',
      tech_service: 'from-purple-500 to-pink-500',
    };
    return colors[config.config?.businessType || ''] || 'from-blue-500 to-purple-500';
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-slate-200 dark:bg-gradient-to-r dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-950/80 dark:border-purple-500/20 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <OdinLogo size="sm" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">ODIN POS</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Sistema de Punto de Venta</p>
        </div>
        
        {/* Badge de Modo de Negocio */}
        {config.config && (
          <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getBusinessModeColor()} bg-opacity-10 border border-white/20 flex items-center space-x-2`}>
            <Store className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium text-white">
              Modo: {getBusinessModeLabel()}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              </>
            )}
          </button>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                
                {/* Panel */}
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-12 w-96 max-h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-lg shadow-2xl overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {unreadCount} nuevas
                        </Badge>
                      )}
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-b border-slate-200 dark:border-purple-500/10 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center space-x-1 transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Marcar como leídas</span>
                      </button>
                      <button 
                        onClick={clearAllNotifications}
                        className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar todas</span>
                      </button>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="overflow-y-auto max-h-[400px]">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`group p-4 border-b border-slate-200 dark:border-purple-500/10 transition-colors relative ${
                            notification.read 
                              ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' 
                              : 'bg-purple-50 dark:bg-purple-500/5 hover:bg-purple-100 dark:hover:bg-purple-500/10'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div 
                              onClick={() => markAsRead(notification.id)}
                              className="mt-0.5 cursor-pointer"
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div 
                              onClick={() => markAsRead(notification.id)}
                              className="flex-1 min-w-0 cursor-pointer"
                            >
                              <div className="flex items-start justify-between">
                                <p className={`text-sm font-medium pr-2 ${
                                  notification.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 dark:text-slate-400 dark:hover:text-red-400 rounded transition-all"
                              title="Eliminar notificación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400">No hay notificaciones</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-3 px-3 py-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-slate-200 dark:border-purple-500/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <p className="text-slate-900 dark:text-white font-medium">Admin</p>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Administrador</p>
          </div>
        </div>

        {/* Logout button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-slate-300 bg-slate-100 text-slate-700 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white hover:border-transparent dark:border-purple-500/30 dark:bg-slate-800/30 dark:text-slate-300 transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
}