/**
 * ODIN POS - Sistema de Configuración Dinámica
 * Define los tipos para el sistema modular y escalable
 */

// ========================================
// TIPOS DE NEGOCIO SOPORTADOS
// ========================================

export enum BusinessType {
  // Comercio y Retail
  RETAIL = 'retail',                    // Venta minorista general
  HARDWARE = 'hardware',                // Ferretería ⭐ NUEVO
  WHOLESALE = 'wholesale',              // Venta mayorista
  
  // Restauración y Alimentos
  RESTAURANT = 'restaurant',            // Restaurante con mesas ⭐ PRINCIPAL
  BAR = 'bar',                          // Bar con bebidas
  CAFE = 'cafe',                        // Cafetería
  FAST_FOOD = 'fast_food',             // Comida rápida sin mesas
  DELIVERY_ONLY = 'delivery_only',      // Solo delivery
  
  // Servicios
  SPA = 'spa',                          // Salón / Spa / Uñas ⭐ NUEVO
  TECH_SERVICE = 'tech_service',        // Servicio técnico
  
  // Híbrido
  MULTI_VERTICAL = 'multi_vertical',    // Negocio híbrido
}

// ========================================
// MÓDULOS DEL SISTEMA
// ========================================

export enum SystemModule {
  // Core (siempre activos)
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  SALES = 'sales',
  
  // Gestión
  CUSTOMERS = 'customers',
  SUPPLIERS = 'suppliers',
  EMPLOYEES = 'employees',
  PURCHASE_ORDERS = 'purchase_orders',
  
  // Operacionales
  CASH_REGISTER = 'cash_register',
  PRINTERS = 'printers',
  PRINT_TEMPLATES = 'print_templates',  // ⭐ NUEVO - Editor de plantillas de impresión
  
  // Específicos por industria
  TABLES = 'tables',                    // Mesas (restaurante)
  KITCHEN = 'kitchen',                  // Cocina (restaurante)
  DELIVERY = 'delivery',                // Delivery
  APPOINTMENTS = 'appointments',        // Citas (servicios)
  TECHNICAL_ORDERS = 'technical_orders', // Órdenes técnicas
  SCHEDULED_ORDERS = 'scheduled_orders', // Pedidos programados
  
  // Administrativos
  REPORTS = 'reports',
  SETTINGS = 'settings',
  
  // Avanzados
  MULTI_CURRENCY = 'multi_currency',    // Conversión de monedas
  MULTI_BRANCH = 'multi_branch',        // Multi-sucursales
  ANALYTICS = 'analytics',              // Analítica avanzada
}

// ========================================
// PLANES DE LICENCIA
// ========================================

export enum LicensePlan {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

export enum LicenseStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  CANCELLED = 'cancelled',
}

// ========================================
// TIPOS DE ORDEN UNIVERSAL
// ========================================

export enum OrderType {
  IMMEDIATE_SALE = 'immediate_sale',      // Venta inmediata
  OPEN_ORDER = 'open_order',              // Orden abierta (mesa)
  SCHEDULED_ORDER = 'scheduled_order',     // Pedido programado
  DELIVERY_ORDER = 'delivery_order',       // Orden delivery
  TECHNICAL_SERVICE = 'technical_service', // Servicio técnico
  WHOLESALE_ORDER = 'wholesale_order',     // Orden mayorista
  QUOTE = 'quote',                         // Cotización
}

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ========================================
// MONEDAS Y CONVERSIÓN
// ========================================

export interface Currency {
  code: string;              // USD, COP, EUR, etc.
  name: string;              // Dólar, Peso Colombiano, Euro
  symbol: string;            // $, €, £
  isDefault: boolean;        // Moneda por defecto del negocio
  exchangeRate?: number;     // Tasa de cambio (procesada en backend)
  lastUpdate?: string;       // Fecha última actualización
}

export interface ConversionInfo {
  originalCurrency: string;
  originalAmount: number;
  targetCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
  conversionDate: string;
  margin?: number;           // Margen aplicado (%)
}

// ========================================
// CONFIGURACIÓN DE MÓDULOS
// ========================================

export interface ModuleConfig {
  id: SystemModule;
  enabled: boolean;
  label: string;
  icon: string;              // Nombre del icono de lucide-react
  route: string;             // Ruta de navegación
  requiredPlan?: LicensePlan; // Plan mínimo requerido
  order: number;             // Orden en el menú
  children?: ModuleConfig[]; // Sub-módulos
}

// ========================================
// CONFIGURACIÓN DE LICENCIA
// ========================================

export interface LicenseConfig {
  plan: LicensePlan;
  status: LicenseStatus;
  startDate: string;
  expirationDate: string;
  maxBranches: number;
  maxUsers: number;
  maxProducts: number;
  maxMonthlyOrders: number;
  enabledModules: SystemModule[];
  features: {
    multiCurrency: boolean;
    multiBranch: boolean;
    advancedReports: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
  };
}

// ========================================
// CONFIGURACIÓN DE SUCURSAL
// ========================================

export interface BranchConfig {
  id: string;
  name: string;
  code: string;
  businessType: BusinessType;
  isHeadquarters: boolean;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  currency: Currency;
  enabledModules: SystemModule[];
  createdAt: string;
}

// ========================================
// CONFIGURACIÓN GLOBAL DEL SISTEMA
// ========================================

export interface SystemConfig {
  // Empresa
  companyId: string;
  companyName: string;
  
  // Negocio
  businessType: BusinessType;
  
  // Licencia
  license: LicenseConfig;
  
  // Sucursal actual
  currentBranch: BranchConfig;
  
  // Todas las sucursales (si tiene acceso)
  branches?: BranchConfig[];
  
  // Módulos habilitados dinámicamente
  enabledModules: ModuleConfig[];
  
  // Tipos de orden disponibles
  availableOrderTypes: OrderType[];
  
  // Estados de orden configurados
  orderStatuses: OrderStatus[];
  
  // Monedas habilitadas
  currencies: Currency[];
  
  // Margen global de conversión (%)
  globalConversionMargin: number;
  
  // Usuario actual
  user: {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen';
    permissions: string[];
  };
  
  // Metadata
  lastSync: string;
  version: string;
}

// ========================================
// RESPUESTA DE API DE CONFIGURACIÓN
// ========================================

export interface ConfigApiResponse {
  success: boolean;
  data: SystemConfig;
  message?: string;
  timestamp: string;
}

// ========================================
// HELPERS DE TIPOS
// ========================================

export type ModulePermission = {
  module: SystemModule;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export type OrderTypeConfig = {
  type: OrderType;
  enabled: boolean;
  requiredFields: string[];
  optionalFields: string[];
  allowedStatuses: OrderStatus[];
};