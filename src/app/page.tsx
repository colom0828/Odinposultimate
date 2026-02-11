'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirigir al login
    window.location.href = '/auth/login';
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
      <p className="text-slate-600 dark:text-slate-400">Redirigiendo...</p>
    </div>
  );
}
