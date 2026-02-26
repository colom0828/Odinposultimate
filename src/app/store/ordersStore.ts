/**
 * ODIN POS - Store de Órdenes (Zustand)
 * Store compartido entre Cocina, Delivery y otros módulos
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Order, 
  OrderType, 
  KitchenStatus, 
  DeliveryStatus,
  Priority,
} from '../types/orders.types';

// ========================================
// INTERFACES DEL STORE
// ========================================

interface OrdersStore {
  orders: Order[];
  
  // Actions
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  setKitchenStatus: (orderId: string, status: KitchenStatus) => void;
  setDeliveryStatus: (orderId: string, status: DeliveryStatus) => void;
  assignCourier: (orderId: string, courierId: string, courierName: string) => void;
  markAsDelivered: (orderId: string) => void;
  sendToDelivery: (orderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  
  // Getters (removed to avoid infinite loops - filter in components instead)
  getOrderById: (orderId: string) => Order | undefined;
}

// ========================================
// HELPERS
// ========================================

// Generar número de orden único
let orderCounter = 1;
const generateOrderNumber = (): string => {
  const number = orderCounter.toString().padStart(4, '0');
  orderCounter++;
  return `#${number}`;
};

// Generar ID único
const generateId = (): string => {
  return `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ========================================
// STORE
// ========================================

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],

      // Agregar nueva orden
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: generateId(),
          orderNumber: generateOrderNumber(),
          createdAt: new Date().toISOString(),
          
          // Si es DELIVERY, inicializar deliveryStatus
          deliveryStatus: orderData.type === OrderType.DELIVERY 
            ? DeliveryStatus.PENDIENTE_ASIGNAR 
            : undefined,
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
        }));

        console.log('✅ Nueva orden creada:', newOrder.orderNumber, newOrder);
      },

      // Cambiar estado de cocina
      setKitchenStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            
            // ✅ FIX: Agregar timestamps según el estado
            const updates: Partial<Order> = { kitchenStatus: status };
            
            if (status === KitchenStatus.PREPARANDO && !order.kitchenStartedAt) {
              updates.kitchenStartedAt = new Date().toISOString();
            }
            
            if (status === KitchenStatus.LISTA && !order.kitchenReadyAt) {
              updates.kitchenReadyAt = new Date().toISOString();
            }
            
            return { ...order, ...updates };
          }),
        }));
        console.log(`✅ Kitchen status cambiado: ${orderId} → ${status}`);
      },

      // Cambiar estado de delivery
      setDeliveryStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, deliveryStatus: status }
              : order
          ),
        }));
        console.log(`✅ Delivery status cambiado: ${orderId} → ${status}`);
      },

      // Asignar courier
      assignCourier: (orderId, courierId, courierName) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  assignedCourier: { id: courierId, name: courierName },
                  deliveryStatus: DeliveryStatus.EN_RUTA, // ✅ FIX: Corregido de EN_CAMINO a EN_RUTA
                }
              : order
          ),
        }));
        console.log(`✅ Courier asignado: ${orderId} → ${courierName}`);
      },

      // Marcar como entregada
      markAsDelivered: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { 
                  ...order, 
                  kitchenStatus: KitchenStatus.ENTREGADA,
                  deliveredAt: new Date().toISOString(),
                }
              : order
          ),
        }));
        console.log(`✅ Orden marcada como entregada: ${orderId}`);
      },

      // Enviar a delivery
      sendToDelivery: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { 
                  ...order, 
                  kitchenStatus: KitchenStatus.ENTREGADA,
                  deliveryStatus: DeliveryStatus.PENDIENTE_ASIGNAR,
                }
              : order
          ),
        }));
        console.log(`✅ Orden enviada a delivery: ${orderId}`);
      },

      // Cancelar orden
      cancelOrder: (orderId, reason) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { 
                  ...order, 
                  canceledAt: new Date().toISOString(),
                  cancelReason: reason,
                }
              : order
          ),
        }));
        console.log(`✅ Orden cancelada: ${orderId} - Razón: ${reason}`);
      },

      // Eliminar orden
      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
        console.log(`✅ Orden eliminada: ${orderId}`);
      },

      // Limpiar todas las órdenes
      clearAllOrders: () => {
        set({ orders: [] });
        console.log('✅ Todas las órdenes eliminadas');
      },

      // Obtener orden por ID
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'odin-orders-storage', // Nombre en localStorage
      partialize: (state) => ({ orders: state.orders }), // Solo persistir orders
      // ✅ FIX: Protección contra SSR - solo hidratar en el cliente
      skipHydration: typeof window === 'undefined',
    }
  )
);

// ========================================
// HELPER PARA CREAR ÓRDENES MOCK
// ========================================

export const createMockDeliveryOrder = () => {
  const store = useOrdersStore.getState();
  
  const mockOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt'> = {
    type: OrderType.DELIVERY,
    customer: {
      name: `Cliente ${Math.floor(Math.random() * 100)}`,
      phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    delivery: {
      address: 'Av. Reforma',
      addressNumber: `${Math.floor(100 + Math.random() * 900)}`,
      reference: 'Edificio azul, depto 301',
      neighborhood: 'Centro',
      city: 'Santo Domingo',
      deliveryCost: 40,
    },
    items: [
      { id: '1', name: 'Pizza Margarita', qty: 1, price: 150 },
      { id: '2', name: 'Refresco 1L', qty: 1, price: 30 },
    ],
    notes: 'Tocar el timbre 2 veces',
    subtotal: 180,
    total: 220,
    paymentMethod: 'EFECTIVO',
    kitchenStatus: KitchenStatus.NUEVA,
    priority: Priority.NORMAL,
    integration: {
      channel: 'ODIN',
      receivedAt: new Date().toISOString(),
      syncStatus: 'SYNCED',
      lastSyncAt: new Date().toISOString(),
    },
  };

  store.addOrder(mockOrder);
  console.log('🧪 Orden mock de delivery creada');
};

export const createMockMesaOrder = () => {
  const store = useOrdersStore.getState();
  
  const mockOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt'> = {
    type: OrderType.MESA,
    area: 'salon',
    tableNumber: `${Math.floor(1 + Math.random() * 20)}`,
    items: [
      { id: '1', name: 'Hamburguesa Clásica', qty: 2, price: 120 },
      { id: '2', name: 'Papas Fritas', qty: 1, price: 50 },
    ],
    notes: 'Sin cebolla',
    subtotal: 290,
    total: 290,
    kitchenStatus: KitchenStatus.NUEVA,
    priority: Priority.NORMAL,
    integration: {
      channel: 'ODIN',
      receivedAt: new Date().toISOString(),
      syncStatus: 'SYNCED',
      lastSyncAt: new Date().toISOString(),
    },
  };

  store.addOrder(mockOrder);
  console.log('🧪 Orden mock de mesa creada');
};