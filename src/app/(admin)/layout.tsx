'use client';

import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { PageTransition } from '../components/PageTransition';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Sidebar - FIXED */}
        <AdminSidebar />

        {/* Main content area - with left margin for sidebar */}
        <div className="ml-64">
          {/* Header - STICKY */}
          <AdminHeader />

          {/* Content area - SCROLLABLE */}
          <main className="p-6">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgb(30 41 59 / 0.9)',
              border: '1px solid rgb(139 92 246 / 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </div>
    </>
  );
}