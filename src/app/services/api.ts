/**
 * ODIN POS - API Service
 * Centraliza todas las llamadas al backend
 */

// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// Helper para manejar errores
class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Cliente HTTP base
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Wrapper para las peticiones
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  try {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetchWithTimeout(url, options);

    // Manejar respuestas sin contenido (204)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Error en la petición', data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error de conexión con el servidor');
  }
}

// ==========================================
// SERVICIOS DE API
// ==========================================

export const api = {
  // ===== AUTENTICACIÓN =====
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    logout: () =>
      apiRequest('/auth/logout', { method: 'POST' }),
    
    me: () =>
      apiRequest<any>('/auth/me'),
  },

  // ===== EMPRESA / CONFIGURACIÓN =====
  empresa: {
    get: () =>
      apiRequest<any>('/empresa'),
    
    update: (data: any) =>
      apiRequest<any>('/empresa', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // ===== PRODUCTOS =====
  productos: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      apiRequest<any>(`/productos?${new URLSearchParams(params as any)}`),
    
    getById: (id: string) =>
      apiRequest<any>(`/productos/${id}`),
    
    create: (data: any) =>
      apiRequest<any>('/productos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      apiRequest<any>(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      apiRequest<any>(`/productos/${id}`, {
        method: 'DELETE',
      }),
  },

  // ===== VENTAS =====
  ventas: {
    getAll: (params?: { page?: number; limit?: number; desde?: string; hasta?: string }) =>
      apiRequest<any>(`/ventas?${new URLSearchParams(params as any)}`),
    
    getById: (id: string) =>
      apiRequest<any>(`/ventas/${id}`),
    
    create: (data: any) =>
      apiRequest<any>('/ventas', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ===== CLIENTES =====
  clientes: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      apiRequest<any>(`/clientes?${new URLSearchParams(params as any)}`),
    
    getById: (id: string) =>
      apiRequest<any>(`/clientes/${id}`),
    
    create: (data: any) =>
      apiRequest<any>('/clientes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      apiRequest<any>(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      apiRequest<any>(`/clientes/${id}`, {
        method: 'DELETE',
      }),
  },

  // ===== USUARIOS =====
  usuarios: {
    getAll: () =>
      apiRequest<any>('/usuarios'),
    
    getById: (id: string) =>
      apiRequest<any>(`/usuarios/${id}`),
    
    create: (data: any) =>
      apiRequest<any>('/usuarios', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      apiRequest<any>(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      apiRequest<any>(`/usuarios/${id}`, {
        method: 'DELETE',
      }),
  },

  // ===== INVENTARIO =====
  inventario: {
    getAll: () =>
      apiRequest<any>('/inventario'),
    
    updateStock: (productoId: string, data: { cantidad: number; tipo: 'entrada' | 'salida'; motivo?: string }) =>
      apiRequest<any>(`/inventario/${productoId}/stock`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ===== DASHBOARD / ESTADÍSTICAS =====
  dashboard: {
    getStats: () =>
      apiRequest<any>('/dashboard/stats'),
    
    getVentasPorDia: (params?: { desde?: string; hasta?: string }) =>
      apiRequest<any>(`/dashboard/ventas-por-dia?${new URLSearchParams(params as any)}`),
    
    getProductosMasVendidos: (params?: { limit?: number }) =>
      apiRequest<any>(`/dashboard/productos-mas-vendidos?${new URLSearchParams(params as any)}`),
  },
};

// Exportar también el tipo de error
export { ApiError };
export type { };
