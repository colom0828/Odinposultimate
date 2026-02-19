'use client';

import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { PageTransition } from '../components/PageTransition';
import { DevPanel } from '../components/DevPanel';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inicializar tema de forma SÍNCRONA antes del primer render
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(() => {
    const initialTheme = getInitialTheme();
    // Aplicar inmediatamente al DOM
    applyThemeToDOM(initialTheme);
    return initialTheme;
  });

  useEffect(() => {
    // Escuchar cambios de tema desde otros componentes
    const handleStorageChange = () => {
      const theme = localStorage.getItem('odin-theme') as 'dark' | 'light' | null;
      if (theme) {
        setCurrentTheme(theme);
        applyThemeToDOM(theme);
      }
    };

    // Escuchar eventos de storage (cambios desde otras pestañas)
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar eventos personalizados de cambio de tema (mismo tab)
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail.theme as 'dark' | 'light';
      setCurrentTheme(newTheme);
      applyThemeToDOM(newTheme);
    };
    
    window.addEventListener('theme-change' as any, handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-change' as any, handleThemeChange);
    };
  }, []);

  return (
    <>
      {/* WRAPPER PRINCIPAL - Controla TODO el fondo del admin */}
      <div className="min-h-screen bg-[#F5F7FB] text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white transition-colors duration-300">
        {/* Sidebar - FIXED */}
        <AdminSidebar />

        {/* Main content area - with left margin for sidebar */}
        <div className="ml-64">
          {/* Header - STICKY */}
          <AdminHeader />

          {/* Content area - SCROLLABLE - Fondo TRANSPARENTE para que se vea el wrapper */}
          <main className="p-6 min-h-screen bg-transparent">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right" 
          theme={currentTheme}
          toastOptions={{
            style: {
              background: currentTheme === 'dark' ? 'rgb(30 41 59 / 0.9)' : 'rgb(255 255 255 / 0.95)',
              border: currentTheme === 'dark' ? '1px solid rgb(139 92 246 / 0.2)' : '1px solid rgb(226 232 240)',
              color: currentTheme === 'dark' ? 'white' : 'rgb(30 41 59)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />

        {/* Dev Panel - Solo visible en desarrollo */}
        <DevPanel />
      </div>
    </>
  );
}