import { useState, useEffect } from 'react';

export interface Sale {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  payment: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  status: 'completed' | 'pending' | 'refunded';
  cashier: string;
  employeeId?: string;
  products?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

const STORAGE_KEY = 'odin-sales';

// Datos iniciales de ejemplo
const initialSales: Sale[] = [
  { 
    id: '001', 
    customer: 'María González', 
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Hace 5 min
    items: 3, 
    total: 450, 
    payment: 'Tarjeta', 
    status: 'completed',
    cashier: 'Admin'
  },
  { 
    id: '002', 
    customer: 'Carlos Ruiz', 
    date: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // Hace 12 min
    items: 2, 
    total: 280, 
    payment: 'Efectivo', 
    status: 'completed',
    cashier: 'Admin'
  },
  { 
    id: '003', 
    customer: 'Ana Martínez', 
    date: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // Hace 25 min
    items: 5, 
    total: 890, 
    payment: 'Transferencia', 
    status: 'pending',
    cashier: 'Usuario1'
  },
  { 
    id: '004', 
    customer: 'Luis Fernández', 
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Hace 1 hora
    items: 1, 
    total: 320, 
    payment: 'Tarjeta', 
    status: 'completed',
    cashier: 'Admin'
  },
  { 
    id: '005', 
    customer: 'Sofia López', 
    date: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // Hace 2 horas
    items: 4, 
    total: 625, 
    payment: 'Efectivo', 
    status: 'completed',
    cashier: 'Usuario2'
  },
];

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar ventas desde localStorage
  useEffect(() => {
    const loadSales = () => {
      try {
        const savedSales = localStorage.getItem(STORAGE_KEY);
        if (savedSales) {
          setSales(JSON.parse(savedSales));
        } else {
          // Si no hay datos, usar datos iniciales
          setSales(initialSales);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSales));
        }
      } catch (error) {
        console.error('Error loading sales:', error);
        setSales(initialSales);
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, []);

  // Guardar en localStorage cada vez que cambien las ventas
  const saveSales = (newSales: Sale[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSales));
      setSales(newSales);
      // Disparar evento para que otros componentes se actualicen
      window.dispatchEvent(new CustomEvent('sales-updated', { detail: { sales: newSales } }));
    } catch (error) {
      console.error('Error saving sales:', error);
    }
  };

  // Agregar nueva venta
  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...sale,
      id: generateSaleId(),
      date: new Date().toISOString(),
    };
    const updatedSales = [newSale, ...sales];
    saveSales(updatedSales);
    return newSale;
  };

  // Actualizar venta existente
  const updateSale = (id: string, updates: Partial<Sale>) => {
    const updatedSales = sales.map(sale =>
      sale.id === id ? { ...sale, ...updates } : sale
    );
    saveSales(updatedSales);
  };

  // Eliminar venta
  const deleteSale = (id: string) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    saveSales(updatedSales);
  };

  // Obtener ventas del día
  const getTodaySales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= today;
    });
  };

  // Obtener ventas recientes (últimas 10)
  const getRecentSales = (limit: number = 10) => {
    return [...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Calcular total de ventas
  const getTotalSales = (filterFn?: (sale: Sale) => boolean) => {
    const filteredSales = filterFn ? sales.filter(filterFn) : sales;
    return filteredSales
      .filter(sale => sale.status === 'completed')
      .reduce((sum, sale) => sum + sale.total, 0);
  };

  // Calcular ventas por método de pago
  const getSalesByPaymentMethod = () => {
    const todaySales = getTodaySales();
    return {
      cash: getTotalSales(sale => 
        sale.payment === 'Efectivo' && 
        todaySales.includes(sale)
      ),
      card: getTotalSales(sale => 
        sale.payment === 'Tarjeta' && 
        todaySales.includes(sale)
      ),
      transfer: getTotalSales(sale => 
        sale.payment === 'Transferencia' && 
        todaySales.includes(sale)
      ),
    };
  };

  // Generar ID único para venta
  const generateSaleId = () => {
    const maxId = sales.reduce((max, sale) => {
      const num = parseInt(sale.id);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxId + 1).padStart(3, '0');
  };

  return {
    sales,
    isLoading,
    addSale,
    updateSale,
    deleteSale,
    getTodaySales,
    getRecentSales,
    getTotalSales,
    getSalesByPaymentMethod,
  };
}
