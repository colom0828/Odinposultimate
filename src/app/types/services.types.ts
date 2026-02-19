/**
 * ODIN POS - Tipos para Módulo de Servicios (Spa)
 */

export type ServiceCategory = 
  | 'Cabello'
  | 'Uñas'
  | 'Facial'
  | 'Masajes'
  | 'Depilación'
  | 'Maquillaje'
  | 'Pestañas'
  | 'Cejas'
  | 'Tratamientos'
  | 'Otros';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number; // minutos
  description?: string;
  price?: number; // Solo visible para admin/cashier, NO para supervisor
  cost?: number; // Solo visible para admin, NO para supervisor ni cashier
  isActive: boolean;
  requiresProducts?: string[]; // IDs de productos/insumos
  technicians?: string[]; // IDs de técnicos que pueden realizar el servicio
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServiceDTO {
  name: string;
  category: ServiceCategory;
  duration: number;
  description?: string;
  price?: number;
  cost?: number;
  requiresProducts?: string[];
  technicians?: string[];
  imageUrl?: string;
}

export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {
  id: string;
  isActive?: boolean;
}

export interface ServiceFilters {
  category?: ServiceCategory;
  isActive?: boolean;
  technicianId?: string;
  searchTerm?: string;
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  byCategory: Record<ServiceCategory, number>;
}
