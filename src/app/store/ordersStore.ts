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

      // Cambiar estado en cocina
      setKitchenStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId) {
              const updated: Order = { ...order, kitchenStatus: status };

              // Registrar timestamps
              if (status === KitchenStatus.PREPARANDO && !order.kitchenStartedAt) {
                updated.kitchenStartedAt = new Date().toISOString();
              } else if (status === KitchenStatus.LISTA && !order.kitchenReadyAt) {
                updated.kitchenReadyAt = new Date().toISOString();
                
                // ⭐ REGLA DE NEGOCIO IMPORTANTE:
                // Si es DELIVERY y pasa a LISTA, activar deliveryStatus
                if (order.type === OrderType.DELIVERY && !order.deliveryStatus) {
                  updated.deliveryStatus = DeliveryStatus.PENDIENTE_ASIGNAR;
                  console.log('🚚 Orden lista para delivery:', order.orderNumber);
                }
              }

              console.log('🍳 Estado cocina actualizado:', order.orderNumber, status);
              return updated;
            }
            return order;
          }),
        }));
      },

      // Cambiar estado en delivery
      setDeliveryStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId && order.type === OrderType.DELIVERY) {
              const updated: Order = { ...order, deliveryStatus: status };

              // Registrar timestamps
              if (status === DeliveryStatus.EN_RUTA && !order.deliveryStartedAt) {
                updated.deliveryStartedAt = new Date().toISOString();
              } else if (status === DeliveryStatus.ENTREGADO && !order.deliveryCompletedAt) {
                updated.deliveryCompletedAt = new Date().toISOString();
              } else if (status === DeliveryStatus.CANCELADO && !order.canceledAt) {
                updated.canceledAt = new Date().toISOString();
              }

              console.log('🚚 Estado delivery actualizado:', order.orderNumber, status);
              return updated;
            }
            return order;
          }),
        }));
      },

      // Asignar repartidor
      assignCourier: (orderId, courierId, courierName) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId && order.type === OrderType.DELIVERY) {
              const updated: Order = {
                ...order,
                delivery: {
                  ...order.delivery!,
                  courierId,
                  courierName,
                },
                deliveryAssignedAt: new Date().toISOString(),
              };

              console.log('👤 Repartidor asignado:', order.orderNumber, courierName);
              return updated;
            }
            return order;
          }),
        }));
      },

      // Marcar como entregada (para MESA y PARA_LLEVAR)
      markAsDelivered: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId) {
              const updated: Order = {
                ...order,
                kitchenStatus: KitchenStatus.ENTREGADA,
                deliveryCompletedAt: new Date().toISOString(),
              };

              console.log('✅ Orden marcada como entregada:', order.orderNumber);
              return updated;
            }
            return order;
          }),
        }));
      },

      // Enviar a delivery (solo para órdenes DELIVERY en estado LISTA)
      sendToDelivery: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId && order.type === OrderType.DELIVERY && order.kitchenStatus === KitchenStatus.LISTA) {
              const updated: Order = {
                ...order,
                kitchenStatus: KitchenStatus.ENTREGADA, // ✅ Marcar como entregada en cocina
                deliveryStatus: DeliveryStatus.PENDIENTE_ASIGNAR, // Activar en módulo delivery
                deliveryCompletedAt: new Date().toISOString(), // Timestamp de entrega desde cocina
              };

              console.log('🚚 Orden enviada a módulo de delivery y marcada como entregada:', order.orderNumber);
              return updated;
            }
            return order;
          }),
        }));
      },

      // Cancelar orden
      cancelOrder: (orderId, reason) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId) {
              const updated: Order = {
                ...order,
                canceledAt: new Date().toISOString(),
                cancelReason: reason,
              };

              // Si es delivery, marcar como cancelado
              if (order.type === OrderType.DELIVERY) {
                updated.deliveryStatus = DeliveryStatus.CANCELADO;
              }

              console.log('❌ Orden cancelada:', order.orderNumber, reason);
              return updated;
            }
            return order;
          }),
        }));
      },

      // Eliminar orden (solo para órdenes entregadas/canceladas)
      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
        console.log('🗑️ Orden eliminada:', orderId);
      },

      // Limpiar todas las órdenes (solo para desarrollo)
      clearAllOrders: () => {
        set({ orders: [] });
        orderCounter = 1;
        console.log('🧹 Todas las órdenes eliminadas');
      },

      // Obtener orden por ID
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      // Obtener órdenes para cocina (todas excepto las delivery entregadas/canceladas)
      getKitchenOrders: () => {
        return get().orders.filter((order) => {
          // No mostrar delivery entregados o cancelados en cocina
          if (order.type === OrderType.DELIVERY) {
            return (
              order.deliveryStatus !== DeliveryStatus.ENTREGADO &&
              order.deliveryStatus !== DeliveryStatus.CANCELADO
            );
          }
          return true;
        });
      },

      // Obtener órdenes para delivery (solo DELIVERY con kitchenStatus === LISTA)
      getDeliveryOrders: () => {
        return get().orders.filter(
          (order) =>
            order.type === OrderType.DELIVERY &&
            order.kitchenStatus === KitchenStatus.LISTA
        );
      },
    }),
    {
      name: 'odin-orders-storage', // Nombre en localStorage
      partialize: (state) => ({ orders: state.orders }), // Solo persistir orders
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
      city: 'CDMX',
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