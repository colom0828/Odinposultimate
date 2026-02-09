'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirigir al login
    window.location.href = '/auth/login';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Redirigiendo...</p>
    </div>
  );
}
