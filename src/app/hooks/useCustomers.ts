import { useState, useEffect } from 'react';
import { useSales } from './useSales';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'vip' | 'inactive';
  totalPurchases: number;  // Calculado automáticamente desde ventas
  visits: number;           // Calculado automáticamente desde ventas
  lastPurchase?: string;    // Fecha de última compra
}

const STORAGE_KEY = 'odin-customers';

// Datos iniciales de clientes (sin totalPurchases ni visits, se calculan automáticamente)
const initialCustomers: Omit<Customer, 'totalPurchases' | 'visits'>[] = [
  { 
    id: 1, 
    name: 'María González', 
    email: 'maria.gonzalez@email.com', 
    phone: '+506 8888-8888',
    city: 'San José',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Carlos Ruiz', 
    email: 'carlos.ruiz@email.com', 
    phone: '+506 8777-7777',
    city: 'Heredia',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Ana Martínez', 
    email: 'ana.martinez@email.com', 
    phone: '+506 8666-6666',
    city: 'Alajuela',
    status: 'vip'
  },
  { 
    id: 4, 
    name: 'Luis Fernández', 
    email: 'luis.fernandez@email.com', 
    phone: '+506 8555-5555',
    city: 'Cartago',
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Sofia López', 
    email: 'sofia.lopez@email.com', 
    phone: '+506 8444-4444',
    city: 'San José',
    status: 'vip'
  },
  { 
    id: 6, 
    name: 'Diego Ramírez', 
    email: 'diego.ramirez@email.com', 
    phone: '+506 8333-3333',
    city: 'Guanacaste',
    status: 'inactive'
  },
];

export function useCustomers() {
  const [baseCustomers, setBaseCustomers] = useState<Omit<Customer, 'totalPurchases' | 'visits'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sales } = useSales();

  // Cargar clientes base desde localStorage
  useEffect(() => {
    const loadCustomers = () => {
      try {
        const savedCustomers = localStorage.getItem(STORAGE_KEY);
        if (savedCustomers) {
          setBaseCustomers(JSON.parse(savedCustomers));
        } else {
          // Si no hay datos, usar datos iniciales
          setBaseCustomers(initialCustomers);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCustomers));
        }
      } catch (error) {
        console.error('Error loading customers:', error);
        setBaseCustomers(initialCustomers);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Calcular estadísticas de compras para cada cliente
  const calculateCustomerStats = (customerName: string) => {
    const customerSales = sales.filter(
      sale => sale.customer.toLowerCase() === customerName.toLowerCase() && 
              sale.status === 'completed'
    );

    const totalPurchases = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    const visits = customerSales.length;
    const lastPurchase = customerSales.length > 0 
      ? customerSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
      : undefined;

    return { totalPurchases, visits, lastPurchase };
  };

  // Combinar clientes base con estadísticas calculadas
  const customers: Customer[] = baseCustomers.map(customer => {
    const stats = calculateCustomerStats(customer.name);
    
    // Auto-promover a VIP si tiene más de $15,000 en compras
    let status = customer.status;
    if (stats.totalPurchases >= 15000 && customer.status !== 'vip') {
      status = 'vip';
    }
    // Auto-marcar como inactivo si no tiene compras
    if (stats.visits === 0 && customer.status !== 'inactive') {
      status = 'inactive';
    }

    return {
      ...customer,
      ...stats,
      status,
    };
  });

  // Guardar clientes base en localStorage
  const saveCustomers = (newCustomers: Omit<Customer, 'totalPurchases' | 'visits'>[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomers));
      setBaseCustomers(newCustomers);
      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new CustomEvent('customers-updated'));
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  };

  // Agregar nuevo cliente
  const addCustomer = (customer: Omit<Customer, 'id' | 'totalPurchases' | 'visits'>) => {
    const newCustomer = {
      ...customer,
      id: Math.max(...baseCustomers.map(c => c.id), 0) + 1,
    };
    const updatedCustomers = [...baseCustomers, newCustomer];
    saveCustomers(updatedCustomers);
    return newCustomer;
  };

  // Actualizar cliente existente
  const updateCustomer = (id: number, updates: Partial<Omit<Customer, 'id' | 'totalPurchases' | 'visits'>>) => {
    const updatedCustomers = baseCustomers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    );
    saveCustomers(updatedCustomers);
  };

  // Eliminar cliente
  const deleteCustomer = (id: number) => {
    const updatedCustomers = baseCustomers.filter(customer => customer.id !== id);
    saveCustomers(updatedCustomers);
  };

  // Obtener top clientes por compras
  const getTopCustomers = (limit: number = 5) => {
    return [...customers]
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, limit);
  };

  // Obtener clientes VIP
  const getVIPCustomers = () => {
    return customers.filter(c => c.status === 'vip');
  };

  // Obtener clientes activos
  const getActiveCustomers = () => {
    return customers.filter(c => c.status === 'active' || c.status === 'vip');
  };

  // Buscar cliente por nombre
  const findCustomerByName = (name: string): Customer | undefined => {
    return customers.find(c => c.name.toLowerCase() === name.toLowerCase());
  };

  // Obtener todas las compras de un cliente
  const getCustomerPurchases = (customerName: string) => {
    return sales.filter(
      sale => sale.customer.toLowerCase() === customerName.toLowerCase()
    );
  };

  return {
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getTopCustomers,
    getVIPCustomers,
    getActiveCustomers,
    findCustomerByName,
    getCustomerPurchases,
  };
}
