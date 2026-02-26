/**
 * ODIN POS - Sales API Service
 * Servicio para comunicación con el backend ASP.NET Core
 */

import { Sale, SalesFilters, SalesStats } from '../types/sales.types';

// URL base de la API (configurar en .env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========================================
// HELPERS
// ========================================

/**
 * Obtener headers con autenticación
 */
const getHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Manejar errores de la API
 */
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response;
};

/**
 * Construir query params desde filtros
 */
const buildQueryParams = (filters?: SalesFilters): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);
  if (filters.status) params.append('status', filters.status.join(','));
  if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod.join(','));
  if (filters.type) params.append('type', filters.type.join(','));
  if (filters.cashierId) params.append('cashierId', filters.cashierId);
  if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
  if (filters.searchTerm) params.append('search', filters.searchTerm);
  
  return params.toString();
};

// ========================================
// SALES API SERVICE
// ========================================

export class SalesApi {
  /**
   * Obtener todas las ventas con filtros opcionales
   */
  static async getAll(filters?: SalesFilters): Promise<Sale[]> {
    try {
      const queryParams = buildQueryParams(filters);
      const url = `${API_BASE_URL}/sales${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      return data.data || data; // Soporta {data: [...]} o [...]
    } catch (error) {
      console.error('❌ Error fetching sales:', error);
      throw error;
    }
  }

  /**
   * Obtener una venta por ID
   */
  static async getById(id: string): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      return data.data || data;
    } catch (error) {
      console.error(`❌ Error fetching sale ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva venta
   */
  static async create(sale: Omit<Sale, 'id' | 'saleNumber' | 'createdAt'>): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(sale),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      console.log('✅ Sale created:', data.data || data);
      return data.data || data;
    } catch (error) {
      console.error('❌ Error creating sale:', error);
      throw error;
    }
  }

  /**
   * Actualizar una venta existente
   */
  static async update(id: string, updates: Partial<Sale>): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      console.log('✅ Sale updated:', id);
      return data.data || data;
    } catch (error) {
      console.error(`❌ Error updating sale ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar una venta (soft delete)
   */
  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      await handleApiError(response);
      console.log('✅ Sale deleted:', id);
    } catch (error) {
      console.error(`❌ Error deleting sale ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancelar una venta
   */
  static async cancel(id: string, reason: string): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      console.log('✅ Sale canceled:', id);
      return data.data || data;
    } catch (error) {
      console.error(`❌ Error canceling sale ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reembolsar una venta
   */
  static async refund(id: string, reason: string): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}/refund`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      console.log('✅ Sale refunded:', id);
      return data.data || data;
    } catch (error) {
      console.error(`❌ Error refunding sale ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de ventas
   */
  static async getStats(filters?: SalesFilters): Promise<SalesStats> {
    try {
      const queryParams = buildQueryParams(filters);
      const url = `${API_BASE_URL}/sales/stats${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      return data.data || data;
    } catch (error) {
      console.error('❌ Error fetching sales stats:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas del día actual
   */
  static async getToday(): Promise<Sale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.getAll({
      dateFrom: today.toISOString(),
    });
  }

  /**
   * Exportar ventas a CSV/Excel
   */
  static async export(filters?: SalesFilters, format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    try {
      const queryParams = buildQueryParams(filters);
      const url = `${API_BASE_URL}/sales/export?format=${format}${queryParams ? `&${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      await handleApiError(response);
      const blob = await response.blob();
      
      console.log('✅ Sales exported:', format);
      return blob;
    } catch (error) {
      console.error('❌ Error exporting sales:', error);
      throw error;
    }
  }

  /**
   * Sincronizar ventas en batch
   */
  static async syncBatch(sales: Sale[]): Promise<{ success: number; failed: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ sales }),
      });
      
      await handleApiError(response);
      const data = await response.json();
      
      console.log('✅ Batch sync completed:', data);
      return data;
    } catch (error) {
      console.error('❌ Error syncing sales batch:', error);
      throw error;
    }
  }

  /**
   * Imprimir ticket de venta
   */
  static async printReceipt(id: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}/receipt`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      await handleApiError(response);
      const blob = await response.blob();
      
      console.log('✅ Receipt generated:', id);
      return blob;
    } catch (error) {
      console.error(`❌ Error printing receipt ${id}:`, error);
      throw error;
    }
  }
}

// ========================================
// WEBSOCKET REAL-TIME UPDATES (OPCIONAL)
// ========================================

export class SalesWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: ((sale: Sale) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  /**
   * Conectar al WebSocket
   */
  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws/sales';
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const sale: Sale = JSON.parse(event.data);
          this.listeners.forEach(listener => listener(sale));
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected. Reconnecting in 5s...');
        this.reconnectTimer = setTimeout(() => this.connect(), 5000);
      };
    } catch (error) {
      console.error('❌ Error connecting WebSocket:', error);
    }
  }

  /**
   * Escuchar nuevas ventas
   */
  onNewSale(listener: (sale: Sale) => void) {
    this.listeners.push(listener);
  }

  /**
   * Desconectar WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// ========================================
// EJEMPLO DE USO
// ========================================

/*
// En un componente React:

import { SalesApi } from '@/app/services/salesApi';
import { useSalesStore } from '@/app/store/salesStore';

// Cargar ventas
const fetchSales = async () => {
  const sales = await SalesApi.getAll({
    dateFrom: new Date().toISOString(),
    status: [SaleStatus.COMPLETADA],
  });
  useSalesStore.getState().setSales(sales);
};

// Crear venta
const createSale = async (saleData) => {
  const newSale = await SalesApi.create(saleData);
  useSalesStore.getState().addSale(newSale);
};

// WebSocket en tiempo real
const ws = new SalesWebSocket();
ws.onNewSale((sale) => {
  useSalesStore.getState().addSale(sale);
  toast.success(`Nueva venta: ${sale.saleNumber}`);
});

*/