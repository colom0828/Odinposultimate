/**
 * ODIN POS - Services Service
 * Servicio para gestión de servicios de Spa (mock + preparado para API)
 */

import {
  Service,
  CreateServiceDTO,
  UpdateServiceDTO,
  ServiceFilters,
  ServiceStats,
} from '../types/services.types';
import { mockServices } from '../data/mockServicesData';

// ========================================
// STORAGE KEY
// ========================================

const STORAGE_KEY = 'odin_services';

// ========================================
// LOCAL STORAGE HELPERS
// ========================================

function getServicesFromStorage(): Service[] {
  if (typeof window === 'undefined') return mockServices;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading services from storage:', error);
  }
  
  // Si no hay datos, guardar los mock
  saveServicesToStorage(mockServices);
  return mockServices;
}

function saveServicesToStorage(services: Service[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  } catch (error) {
    console.error('Error saving services to storage:', error);
  }
}

// ========================================
// CRUD OPERATIONS
// ========================================

export const ServicesService = {
  /**
   * Listar todos los servicios
   */
  list(filters?: ServiceFilters): Service[] {
    let services = getServicesFromStorage();
    
    if (filters) {
      if (filters.category) {
        services = services.filter(svc => svc.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        services = services.filter(svc => svc.isActive === filters.isActive);
      }
      if (filters.technicianId) {
        services = services.filter(svc => 
          svc.technicians?.includes(filters.technicianId!)
        );
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        services = services.filter(svc =>
          svc.name.toLowerCase().includes(term) ||
          svc.description?.toLowerCase().includes(term)
        );
      }
    }
    
    // Ordenar por categoría y nombre
    return services.sort((a, b) => {
      const catCompare = a.category.localeCompare(b.category);
      if (catCompare !== 0) return catCompare;
      return a.name.localeCompare(b.name);
    });
  },

  /**
   * Obtener servicio por ID
   */
  getById(id: string): Service | undefined {
    const services = getServicesFromStorage();
    return services.find(svc => svc.id === id);
  },

  /**
   * Crear nuevo servicio
   */
  create(data: CreateServiceDTO): Service {
    const services = getServicesFromStorage();
    
    const newService: Service = {
      id: `serv-${Date.now()}`,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    services.push(newService);
    saveServicesToStorage(services);
    
    return newService;
  },

  /**
   * Actualizar servicio existente
   */
  update(data: UpdateServiceDTO): Service | null {
    const services = getServicesFromStorage();
    const index = services.findIndex(svc => svc.id === data.id);
    
    if (index === -1) return null;
    
    const updatedService: Service = {
      ...services[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    services[index] = updatedService;
    saveServicesToStorage(services);
    
    return updatedService;
  },

  /**
   * Activar/Desactivar servicio
   */
  toggleActive(id: string): Service | null {
    const services = getServicesFromStorage();
    const service = services.find(svc => svc.id === id);
    
    if (!service) return null;
    
    return this.update({
      id,
      isActive: !service.isActive,
    });
  },

  /**
   * Eliminar servicio
   */
  delete(id: string): boolean {
    const services = getServicesFromStorage();
    const filtered = services.filter(svc => svc.id !== id);
    
    if (filtered.length === services.length) return false;
    
    saveServicesToStorage(filtered);
    return true;
  },

  /**
   * Obtener estadísticas
   */
  getStats(): ServiceStats {
    const services = getServicesFromStorage();
    
    const stats: ServiceStats = {
      total: services.length,
      active: services.filter(s => s.isActive).length,
      inactive: services.filter(s => !s.isActive).length,
      byCategory: {
        'Cabello': 0,
        'Uñas': 0,
        'Facial': 0,
        'Masajes': 0,
        'Depilación': 0,
        'Maquillaje': 0,
        'Pestañas': 0,
        'Cejas': 0,
        'Tratamientos': 0,
        'Otros': 0,
      },
    };
    
    services.forEach(service => {
      stats.byCategory[service.category]++;
    });
    
    return stats;
  },

  /**
   * Obtener servicios por categoría
   */
  getByCategory(category: Service['category']): Service[] {
    return this.list({ category, isActive: true });
  },

  /**
   * Obtener servicios activos
   */
  getActive(): Service[] {
    return this.list({ isActive: true });
  },

  /**
   * Buscar servicios
   */
  search(term: string): Service[] {
    return this.list({ searchTerm: term, isActive: true });
  },
};

// ========================================
// API INTEGRATION (PREPARADO PARA FUTURO)
// ========================================

/**
 * Funciones preparadas para integración con API real
 */
export async function fetchServices(filters?: ServiceFilters): Promise<Service[]> {
  try {
    // TODO: Reemplazar con llamada real a API
    // const response = await fetch(`/api/services?${new URLSearchParams(filters)}`);
    // return await response.json();
    
    return ServicesService.list(filters);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}
