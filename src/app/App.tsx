import { useState, useEffect } from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import { useInactivityTimeout, isSessionExpired, clearSession } from './hooks/useInactivityTimeout';
import { InactivityWarningModal } from './components/InactivityWarningModal';
import { Toaster } from 'sonner';

// Auth pages
import LoginPage from './(auth)/login/page';

// Admin pages
import DashboardPage from './(admin)/dashboard/page';
import ProductosPage from './(admin)/productos/page';
import InventarioPage from './(admin)/inventario/page';
import ProveedoresPage from './(admin)/proveedores/page';
import OrdenesPage from './(admin)/ordenes/page';
import ImpresorasPage from './(admin)/impresoras/page';
import PrintTemplatesPage from './(admin)/print-templates/page';
import CajaPage from './(admin)/caja/page';
import ConfiguracionFacturacionPage from './(admin)/caja/configuracion-facturacion/page';
import VentasPage from './(admin)/ventas/page';
import ClientesPage from './(admin)/clientes/page';
import EmpleadosPage from './(admin)/empleados/page';
import UsuariosPage from './(admin)/usuarios/page';
import ConfiguracionPage from './(admin)/configuracion/page';
import MesaPage from './(admin)/mesa/page';
import PlanoMesaPage from './(admin)/mesa/plano/page';
import CocinaPage from './(admin)/cocina/page';
import ReportesPage from './(admin)/reportes/page';
import CitasPage from './(admin)/citas/page';
import ServiciosPage from './(admin)/servicios/page';
import OrdenesServicioPage from './(admin)/ordenes-servicio/page';

// Layouts
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { DevPanel } from './components/DevPanel';
import { BusinessModeSwitcher } from './components/BusinessModeSwitcher';

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
  // Inicializar con la ruta actual del navegador en lugar de hardcodear
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/auth/login';
  });

  // Estado para el modal de advertencia
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Manejar logout por inactividad
  const handleInactivityLogout = () => {
    setShowWarningModal(false); // Cerrar modal si está abierto
    clearSession();
    
    // Redirigir al login
    window.history.pushState({}, '', '/auth/login');
    setCurrentPath('/auth/login');
    
    // Notificar al usuario
    console.log('⏱️ Sesión cerrada por inactividad (10 minutos)');
  };

  // Manejar advertencia de inactividad (faltan 2 minutos)
  const handleInactivityWarning = () => {
    setShowWarningModal(true);
    console.log('⚠️ Advertencia: faltan 2 minutos para cerrar sesión');
  };

  // Activar el hook de inactividad solo si está autenticado
  const isAuthenticated = typeof window !== 'undefined' 
    ? localStorage.getItem('odin-isAuthenticated') === 'true'
    : false;

  // Hook de inactividad (10 minutos = 600,000 ms, warning a los 8 minutos)
  const { resetTimer, timeRemaining } = useInactivityTimeout({
    onInactive: handleInactivityLogout,
    onWarning: handleInactivityWarning,
    timeout: 10 * 60 * 1000, // 10 minutos
    warningTime: 2 * 60 * 1000, // Warning 2 minutos antes
  });

  // Manejar "Continuar Sesión" desde el modal
  const handleContinueSession = () => {
    setShowWarningModal(false);
    resetTimer();
    console.log('✅ Sesión extendida por el usuario');
  };

  useEffect(() => {
    // ✅ VERIFICACIÓN DE SESIÓN AL INICIO
    // Si la sesión expiró, limpiar y redirigir a login
    if (isSessionExpired(10 * 60 * 1000)) {
      clearSession();
      window.history.pushState({}, '', '/auth/login');
      setCurrentPath('/auth/login');
      console.log('🔒 Sesión expirada. Redirigiendo a login...');
      return;
    }

    // Forzar sincronización con la URL actual al montar (importante para Figma Sites)
    setCurrentPath(window.location.pathname);
    
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
        case '/admin/print-templates':
          PageComponent = PrintTemplatesPage;
          break;
        case '/admin/caja':
          PageComponent = CajaPage;
          break;
        case '/admin/caja/configuracion-facturacion':
          PageComponent = ConfiguracionFacturacionPage;
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
        case '/admin/mesa':
          PageComponent = MesaPage;
          break;
        case '/admin/mesa/plano':
          PageComponent = PlanoMesaPage;
          break;
        case '/admin/cocina':
          PageComponent = CocinaPage;
          break;
        case '/admin/reportes':
          PageComponent = ReportesPage;
          break;
        case '/admin/citas':
          PageComponent = CitasPage;
          break;
        case '/admin/servicios':
          PageComponent = ServiciosPage;
          break;
        case '/admin/ordenes-servicio':
          PageComponent = OrdenesServicioPage;
          break;
        default:
          PageComponent = DashboardPage;
      }

      return (
        <div className="min-h-screen bg-[#F5F7FB] text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white transition-colors duration-300">
          {/* Sidebar - FIXED */}
          <AdminSidebar />

          {/* Main content area - with left margin for sidebar */}
          <div className="ml-64 min-h-screen">
            {/* Header - STICKY */}
            <AdminHeader />

            {/* Content area - SCROLLABLE - Fondo TRANSPARENTE con altura mínima explícita */}
            <main className="p-6 bg-transparent min-h-[calc(100vh-73px)]">
              <div className="w-full h-full">
                <PageComponent />
              </div>
            </main>
          </div>

          {/* Dev Panel - Solo visible en desarrollo */}
          <DevPanel />
          
          {/* Business Mode Switcher - Botón flotante para cambiar vertical */}
          <BusinessModeSwitcher />
        </div>
      );
    }

    // Default: redirect to login
    return <LoginPage />;
  };

  return (
    <ConfigProvider>
      {renderPage()}
      
      {/* Modal de advertencia de inactividad */}
      <InactivityWarningModal
        isOpen={showWarningModal}
        timeRemaining={timeRemaining}
        onContinue={handleContinueSession}
        onLogout={handleInactivityLogout}
      />
      
      {/* Toaster para notificaciones */}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        theme="dark"
      />
    </ConfigProvider>
  );
}