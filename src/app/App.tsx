'use client';

import { useState, useEffect } from 'react';

// Auth pages
import LoginPage from './(auth)/login/page';

// Admin pages
import DashboardPage from './(admin)/dashboard/page';
import InventarioPage from './(admin)/inventario/page';
import ProveedoresPage from './(admin)/proveedores/page';
import OrdenesPage from './(admin)/ordenes/page';
import ImpresorasPage from './(admin)/impresoras/page';
import CajaPage from './(admin)/caja/page';
import ClientesPage from './(admin)/clientes/page';
import EmpleadosPage from './(admin)/empleados/page';
import ConfiguracionPage from './(admin)/configuracion/page';

// Layouts
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/auth/login');

  useEffect(() => {
    // Simular navegación con eventos personalizados
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    // Escuchar cambios en el historial
    window.addEventListener('popstate', handleNavigation);
    
    // Interceptar clicks en enlaces
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const newPath = new URL(anchor.href).pathname;
        window.history.pushState({}, '', newPath);
        setCurrentPath(newPath);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Renderizar según la ruta
  const renderPage = () => {
    // Auth routes
    if (currentPath === '/' || currentPath === '/auth/login') {
      return <LoginPage />;
    }

    // Admin routes - con layout
    if (currentPath.startsWith('/admin')) {
      let PageComponent;
      
      switch (currentPath) {
        case '/admin/dashboard':
          PageComponent = DashboardPage;
          break;
        case '/admin/inventario':
          PageComponent = InventarioPage;
          break;
        case '/admin/proveedores':
          PageComponent = ProveedoresPage;
          break;
        case '/admin/ordenes':
          PageComponent = OrdenesPage;
          break;
        case '/admin/impresoras':
          PageComponent = ImpresorasPage;
          break;
        case '/admin/caja':
          PageComponent = CajaPage;
          break;
        case '/admin/clientes':
          PageComponent = ClientesPage;
          break;
        case '/admin/empleados':
          PageComponent = EmpleadosPage;
          break;
        case '/admin/configuracion':
          PageComponent = ConfiguracionPage;
          break;
        default:
          PageComponent = DashboardPage;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Sidebar - FIXED */}
          <AdminSidebar />

          {/* Main content area - with left margin for sidebar */}
          <div className="ml-64">
            {/* Header - STICKY */}
            <AdminHeader />

            {/* Content area - SCROLLABLE */}
            <main className="p-6">
              <PageComponent />
            </main>
          </div>
        </div>
      );
    }

    // Default: redirect to login
    return <LoginPage />;
  };

  return renderPage();
}