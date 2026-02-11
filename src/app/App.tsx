'use client';

import { useState, useEffect } from 'react';

// Auth pages
import LoginPage from './(auth)/login/page';

// Admin pages
import DashboardPage from './(admin)/dashboard/page';
import ProductosPage from './(admin)/productos/page';
import InventarioPage from './(admin)/inventario/page';
import ProveedoresPage from './(admin)/proveedores/page';
import OrdenesPage from './(admin)/ordenes/page';
import ImpresorasPage from './(admin)/impresoras/page';
import CajaPage from './(admin)/caja/page';
import VentasPage from './(admin)/ventas/page';
import ClientesPage from './(admin)/clientes/page';
import EmpleadosPage from './(admin)/empleados/page';
import UsuariosPage from './(admin)/usuarios/page';
import ConfiguracionPage from './(admin)/configuracion/page';

// Layouts
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

// Función para obtener el tema inicial de forma SÍNCRONA (antes del render)
function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  
  const savedTheme = localStorage.getItem('odin-theme') as 'dark' | 'light' | null;
  return savedTheme || 'dark';
}

// Aplicar tema al HTML de forma SÍNCRONA
function applyThemeToDOM(theme: 'dark' | 'light') {
  if (typeof window === 'undefined') return;
  
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('dark');
  }
}

// Aplicar tema INMEDIATAMENTE al cargar (antes del render)
if (typeof window !== 'undefined') {
  applyThemeToDOM(getInitialTheme());
}

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

    // Escuchar eventos de cambio de tema
    const handleThemeChange = (e: CustomEvent) => {
      applyThemeToDOM(e.detail.theme);
    };
    
    window.addEventListener('theme-change' as any, handleThemeChange);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('theme-change' as any, handleThemeChange);
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
        case '/admin/productos':
          PageComponent = ProductosPage;
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
        case '/admin/ventas':
          PageComponent = VentasPage;
          break;
        case '/admin/clientes':
          PageComponent = ClientesPage;
          break;
        case '/admin/empleados':
          PageComponent = EmpleadosPage;
          break;
        case '/admin/usuarios':
          PageComponent = UsuariosPage;
          break;
        case '/admin/configuracion':
          PageComponent = ConfiguracionPage;
          break;
        default:
          PageComponent = DashboardPage;
      }

      return (
        <div className="min-h-screen bg-[#F5F7FB] text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white transition-colors duration-300">
          {/* Sidebar - FIXED */}
          <AdminSidebar />

          {/* Main content area - with left margin for sidebar */}
          <div className="ml-64">
            {/* Header - STICKY */}
            <AdminHeader />

            {/* Content area - SCROLLABLE - Fondo TRANSPARENTE */}
            <main className="p-6 bg-transparent">
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
