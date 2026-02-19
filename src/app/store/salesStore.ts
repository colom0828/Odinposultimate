/**
 * ODIN POS - Store de Ventas (Zustand)
 * Store centralizado para el módulo de ventas
 * Preparado para sincronización con API backend
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Sale,
  SaleStatus,
  PaymentMethod,
  SaleType,
  SalesFilters,
  SalesStats,
} from '../types/sales.types';

// ========================================
// INTERFACES DEL STORE
// ========================================

interface SalesStore {
  sales: Sale[];
  isLoading: boolean;
  
  // Actions básicas
  addSale: (sale: Omit<Sale, 'id' | 'saleNumber' | 'createdAt'>) => Sale;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  cancelSale: (id: string, reason: string) => void;
  refundSale: (id: string, reason: string) => void;
  
  // Filtros y búsquedas
  getSaleById: (id: string) => Sale | undefined;
  getFilteredSales: (filters: SalesFilters) => Sale[];
  searchSales: (term: string) => Sale[];
  
  // Estadísticas
  getStats: (filters?: SalesFilters) => SalesStats;
  getTodayStats: () => SalesStats;
  
  // Utilidades
  clearAllSales: () => void;
  setSales: (sales: Sale[]) => void;
  setLoading: (loading: boolean) => void;
  
  // API (preparado para backend)
  syncWithBackend: () => Promise<void>;
}

// ========================================
// HELPERS
// ========================================

// Generar número de venta único
let saleCounter = 1;
const generateSaleNumber = (): string => {
  const number = saleCounter.toString().padStart(4, '0');
  saleCounter++;
  return `V-${number}`;
};

// Generar ID único
const generateId = (): string => {
  return `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calcular totales de una venta
const calculateSaleTotals = (items: any[]): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  return { subtotal, total: subtotal };
};

// Filtrar ventas según criterios
const filterSales = (sales: Sale[], filters: SalesFilters): Sale[] => {
  return sales.filter(sale => {
    // Filtro por fecha
    if (filters.dateFrom) {
      const saleDate = new Date(sale.createdAt);
      const fromDate = new Date(filters.dateFrom);
      if (saleDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const saleDate = new Date(sale.createdAt);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Fin del día
      if (saleDate > toDate) return false;
    }
    
    // Filtro por estado
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(sale.status)) return false;
    }
    
    // Filtro por método de pago
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      const hasMethod = sale.payments.some(p => 
        filters.paymentMethod!.includes(p.method)
      );
      if (!hasMethod) return false;
    }
    
    // Filtro por tipo
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(sale.type)) return false;
    }
    
    // Filtro por cajero
    if (filters.cashierId) {
      if (sale.cashierId !== filters.cashierId) return false;
    }
    
    // Filtro por monto
    if (filters.minAmount !== undefined && sale.total < filters.minAmount) {
      return false;
    }
    
    if (filters.maxAmount !== undefined && sale.total > filters.maxAmount) {
      return false;
    }
    
    // Filtro por búsqueda de texto
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesSaleNumber = sale.saleNumber.toLowerCase().includes(term);
      const matchesCustomer = sale.customer?.name.toLowerCase().includes(term);
      const matchesInvoice = sale.invoiceNumber?.toLowerCase().includes(term);
      
      if (!matchesSaleNumber && !matchesCustomer && !matchesInvoice) {
        return false;
      }
    }
    
    return true;
  });
};

// Calcular estadísticas
const calculateStats = (sales: Sale[]): SalesStats => {
  const completedSales = sales.filter(s => s.status === SaleStatus.COMPLETADA);
  
  const stats: SalesStats = {
    totalSales: sales.length,
    totalAmount: completedSales.reduce((sum, s) => sum + s.total, 0),
    averageTicket: 0,
    totalItems: completedSales.reduce((sum, s) => sum + s.items.length, 0),
    
    completedCount: sales.filter(s => s.status === SaleStatus.COMPLETADA).length,
    pendingCount: sales.filter(s => s.status === SaleStatus.PENDIENTE).length,
    canceledCount: sales.filter(s => s.status === SaleStatus.CANCELADA).length,
    refundedCount: sales.filter(s => s.status === SaleStatus.REEMBOLSADA).length,
    
    cashAmount: 0,
    cardAmount: 0,
    transferAmount: 0,
    mixedAmount: 0,
    
    mesaCount: sales.filter(s => s.type === SaleType.MESA).length,
    paraLlevarCount: sales.filter(s => s.type === SaleType.PARA_LLEVAR).length,
    deliveryCount: sales.filter(s => s.type === SaleType.DELIVERY).length,
    mostradorCount: sales.filter(s => s.type === SaleType.MOSTRADOR).length,
  };
  
  // Calcular promedio
  stats.averageTicket = completedSales.length > 0 
    ? stats.totalAmount / completedSales.length 
    : 0;
  
  // Calcular por método de pago
  completedSales.forEach(sale => {
    sale.payments.forEach(payment => {
      switch (payment.method) {
        case PaymentMethod.EFECTIVO:
          stats.cashAmount += payment.amount;
          break;
        case PaymentMethod.TARJETA:
          stats.cardAmount += payment.amount;
          break;
        case PaymentMethod.TRANSFERENCIA:
          stats.transferAmount += payment.amount;
          break;
        case PaymentMethod.MIXTO:
          stats.mixedAmount += payment.amount;
          break;
      }
    });
  });
  
  return stats;
};

// ========================================
// STORE
// ========================================

export const useSalesStore = create<SalesStore>()(
  persist(
    (set, get) => ({
      sales: [],
      isLoading: false,

      // Agregar nueva venta
      addSale: (saleData) => {
        const newSale: Sale = {
          ...saleData,
          id: generateId(),
          saleNumber: generateSaleNumber(),
          createdAt: new Date().toISOString(),
          syncedToBackend: false,
        };

        set((state) => ({
          sales: [newSale, ...state.sales],
        }));

        console.log('✅ Nueva venta creada:', newSale.saleNumber, newSale);
        return newSale;
      },

      // Actualizar venta
      updateSale: (id, updates) => {
        set((state) => ({
          sales: state.sales.map((sale) =>
            sale.id === id ? { ...sale, ...updates } : sale
          ),
        }));
        console.log('✏️ Venta actualizada:', id);
      },

      // Eliminar venta
      deleteSale: (id) => {
        set((state) => ({
          sales: state.sales.filter((sale) => sale.id !== id),
        }));
        console.log('🗑️ Venta eliminada:', id);
      },

      // Cancelar venta
      cancelSale: (id, reason) => {
        set((state) => ({
          sales: state.sales.map((sale) =>
            sale.id === id
              ? {
                  ...sale,
                  status: SaleStatus.CANCELADA,
                  canceledAt: new Date().toISOString(),
                  cancelReason: reason,
                }
              : sale
          ),
        }));
        console.log('❌ Venta cancelada:', id, reason);
      },

      // Reembolsar venta
      refundSale: (id, reason) => {
        set((state) => ({
          sales: state.sales.map((sale) =>
            sale.id === id
              ? {
                  ...sale,
                  status: SaleStatus.REEMBOLSADA,
                  refundedAt: new Date().toISOString(),
                  refundReason: reason,
                }
              : sale
          ),
        }));
        console.log('💸 Venta reembolsada:', id, reason);
      },

      // Obtener venta por ID
      getSaleById: (id) => {
        return get().sales.find((sale) => sale.id === id);
      },

      // Obtener ventas filtradas
      getFilteredSales: (filters) => {
        return filterSales(get().sales, filters);
      },

      // Buscar ventas
      searchSales: (term) => {
        return filterSales(get().sales, { searchTerm: term });
      },

      // Obtener estadísticas
      getStats: (filters) => {
        const sales = filters ? filterSales(get().sales, filters) : get().sales;
        return calculateStats(sales);
      },

      // Obtener estadísticas del día
      getTodayStats: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySales = get().sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= today;
        });
        return calculateStats(todaySales);
      },

      // Limpiar todas las ventas (solo desarrollo)
      clearAllSales: () => {
        set({ sales: [] });
        saleCounter = 1;
        console.log('🧹 Todas las ventas eliminadas');
      },

      // Establecer ventas (para carga desde API)
      setSales: (sales) => {
        set({ sales });
        console.log('📥 Ventas cargadas:', sales.length);
      },

      // Establecer estado de carga
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Sincronizar con backend (placeholder para API)
      syncWithBackend: async () => {
        console.log('🔄 Sincronizando con backend...');
        // TODO: Implementar llamada a API
        // const unsyncedSales = get().sales.filter(s => !s.syncedToBackend);
        // await fetch('/api/sales/sync', { method: 'POST', body: JSON.stringify(unsyncedSales) });
      },
    }),
    {
      name: 'odin-sales-storage',
      partialize: (state) => ({ sales: state.sales }),
    }
  )
);

// ========================================
// HELPER PARA CREAR VENTAS MOCK
// ========================================

export const createMockSale = () => {
  const store = useSalesStore.getState();
  
  const types: SaleType[] = [SaleType.MESA, SaleType.DELIVERY, SaleType.PARA_LLEVAR, SaleType.MOSTRADOR];
  const payments: PaymentMethod[] = [PaymentMethod.EFECTIVO, PaymentMethod.TARJETA, PaymentMethod.TRANSFERENCIA];
  
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomPayment = payments[Math.floor(Math.random() * payments.length)];
  const items = [
    {
      id: '1',
      productId: 'prod-1',
      productName: 'Hamburguesa Clásica',
      quantity: 2,
      unitPrice: 120,
      subtotal: 240,
    },
    {
      id: '2',
      productId: 'prod-2',
      productName: 'Papas Fritas',
      quantity: 1,
      unitPrice: 50,
      subtotal: 50,
    },
  ];
  
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  const mockSale: Omit<Sale, 'id' | 'saleNumber' | 'createdAt'> = {
    type: randomType,
    origin: 'POS',
    customer: {
      name: `Cliente ${Math.floor(Math.random() * 100)}`,
      phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    items,
    subtotal,
    discount: 0,
    tax: subtotal * 0.16,
    total: subtotal * 1.16,
    payments: [
      {
        method: randomPayment,
        amount: subtotal * 1.16,
      },
    ],
    paymentStatus: 'PAGADO',
    status: SaleStatus.COMPLETADA,
    cashierId: 'cashier-1',
    cashierName: 'Admin',
    tableNumber: randomType === SaleType.MESA ? `${Math.floor(1 + Math.random() * 20)}` : undefined,
  };

  return store.addSale(mockSale);
};
