/**
 * ODIN POS - Servicio de Configuración
 * Maneja la comunicación con el backend para obtener la configuración del sistema
 */

import {
  SystemConfig,
  ConfigApiResponse,
  BusinessType,
  SystemModule,
  LicensePlan,
  LicenseStatus,
  OrderType,
  OrderStatus,
  ModuleConfig,
} from '../types/config.types';

// ========================================
// CONFIGURACIÓN MOCK (Simulación de respuesta del backend)
// ========================================

/**
 * Este servicio simula la respuesta del backend.
 * En producción, estos datos vendrán del ASP.NET Core API
 */

// Módulos configurados para un RESTAURANTE
const getRestaurantModules = (): ModuleConfig[] => [
  // Core modules
  {
    id: SystemModule.DASHBOARD,
    enabled: true,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/admin/dashboard',
    order: 1,
  },
  {
    id: SystemModule.SALES,
    enabled: true,
    label: 'Ventas',
    icon: 'ShoppingCart',
    route: '/admin/ventas',
    order: 2,
  },
  {
    id: SystemModule.TABLES,
    enabled: true,
    label: 'Mesas',
    icon: 'Utensils',
    route: '/admin/mesa',
    requiredPlan: LicensePlan.BASIC,
    order: 3,
  },
  {
    id: SystemModule.KITCHEN,
    enabled: true,
    label: 'Cocina',
    icon: 'ChefHat',
    route: '/admin/cocina',
    requiredPlan: LicensePlan.BASIC,
    order: 4,
  },
  {
    id: SystemModule.INVENTORY,
    enabled: true,
    label: 'Inventario',
    icon: 'Package',
    route: '/admin/inventario',
    order: 5,
  },
  {
    id: SystemModule.SUPPLIERS,
    enabled: true,
    label: 'Proveedores',
    icon: 'ShoppingBag',
    route: '/admin/proveedores',
    order: 6,
  },
  {
    id: SystemModule.PURCHASE_ORDERS,
    enabled: true,
    label: 'Órdenes de compra',
    icon: 'ShoppingBag',
    route: '/admin/ordenes',
    order: 7,
  },
  {
    id: SystemModule.CASH_REGISTER,
    enabled: true,
    label: 'Caja registradora',
    icon: 'CreditCard',
    route: '/admin/caja',
    order: 8,
  },
  {
    id: SystemModule.PRINTERS,
    enabled: true,
    label: 'Impresoras',
    icon: 'Printer',
    route: '/admin/impresoras',
    order: 9,
  },
  {
    id: SystemModule.CUSTOMERS,
    enabled: true,
    label: 'Clientes',
    icon: 'Users',
    route: '/admin/clientes',
    order: 10,
  },
  {
    id: SystemModule.EMPLOYEES,
    enabled: true,
    label: 'Empleados',
    icon: 'UserCircle',
    route: '/admin/empleados',
    order: 11,
  },
  {
    id: SystemModule.REPORTS,
    enabled: true,
    label: 'Reportes',
    icon: 'BarChart3',
    route: '/admin/reportes',
    requiredPlan: LicensePlan.PROFESSIONAL,
    order: 12,
  },
  {
    id: SystemModule.SETTINGS,
    enabled: true,
    label: 'Configuración',
    icon: 'Settings',
    route: '/admin/configuracion',
    order: 13,
  },
];

// Módulos configurados para RETAIL (tienda minorista)
const getRetailModules = (): ModuleConfig[] => [
  {
    id: SystemModule.DASHBOARD,
    enabled: true,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/admin/dashboard',
    order: 1,
  },
  {
    id: SystemModule.SALES,
    enabled: true,
    label: 'Ventas',
    icon: 'ShoppingCart',
    route: '/admin/ventas',
    order: 2,
  },
  {
    id: SystemModule.INVENTORY,
    enabled: true,
    label: 'Inventario',
    icon: 'Package',
    route: '/admin/inventario',
    order: 3,
  },
  {
    id: SystemModule.SUPPLIERS,
    enabled: true,
    label: 'Proveedores',
    icon: 'ShoppingBag',
    route: '/admin/proveedores',
    order: 4,
  },
  {
    id: SystemModule.PURCHASE_ORDERS,
    enabled: true,
    label: 'Órdenes de compra',
    icon: 'ShoppingBag',
    route: '/admin/ordenes',
    order: 5,
  },
  {
    id: SystemModule.CASH_REGISTER,
    enabled: true,
    label: 'Caja registradora',
    icon: 'CreditCard',
    route: '/admin/caja',
    order: 6,
  },
  {
    id: SystemModule.PRINTERS,
    enabled: true,
    label: 'Impresoras',
    icon: 'Printer',
    route: '/admin/impresoras',
    order: 7,
  },
  {
    id: SystemModule.CUSTOMERS,
    enabled: true,
    label: 'Clientes',
    icon: 'Users',
    route: '/admin/clientes',
    order: 8,
  },
  {
    id: SystemModule.EMPLOYEES,
    enabled: true,
    label: 'Empleados',
    icon: 'UserCircle',
    route: '/admin/empleados',
    order: 9,
  },
  {
    id: SystemModule.SETTINGS,
    enabled: true,
    label: 'Configuración',
    icon: 'Settings',
    route: '/admin/configuracion',
    order: 10,
  },
];

// Módulos configurados para SERVICIO TÉCNICO
const getTechServiceModules = (): ModuleConfig[] => [
  {
    id: SystemModule.DASHBOARD,
    enabled: true,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/admin/dashboard',
    order: 1,
  },
  {
    id: SystemModule.TECHNICAL_ORDERS,
    enabled: true,
    label: 'Órdenes de servicio',
    icon: 'Wrench',
    route: '/admin/ordenes-servicio',
    order: 2,
  },
  {
    id: SystemModule.APPOINTMENTS,
    enabled: true,
    label: 'Citas',
    icon: 'Calendar',
    route: '/admin/citas',
    requiredPlan: LicensePlan.PROFESSIONAL,
    order: 3,
  },
  {
    id: SystemModule.INVENTORY,
    enabled: true,
    label: 'Inventario de repuestos',
    icon: 'Package',
    route: '/admin/inventario',
    order: 4,
  },
  {
    id: SystemModule.CUSTOMERS,
    enabled: true,
    label: 'Clientes',
    icon: 'Users',
    route: '/admin/clientes',
    order: 5,
  },
  {
    id: SystemModule.EMPLOYEES,
    enabled: true,
    label: 'Técnicos',
    icon: 'UserCircle',
    route: '/admin/empleados',
    order: 6,
  },
  {
    id: SystemModule.SETTINGS,
    enabled: true,
    label: 'Configuración',
    icon: 'Settings',
    route: '/admin/configuracion',
    order: 7,
  },
];

// ⭐ NUEVO - Módulos configurados para SPA / SALÓN / UÑAS
const getSpaModules = (): ModuleConfig[] => [
  {
    id: SystemModule.DASHBOARD,
    enabled: true,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/admin/dashboard',
    order: 1,
  },
  {
    id: SystemModule.APPOINTMENTS,
    enabled: true,
    label: 'Citas / Agenda',
    icon: 'Calendar',
    route: '/admin/citas',
    order: 2,
  },
  {
    id: SystemModule.CUSTOMERS,
    enabled: true,
    label: 'Clientes',
    icon: 'Users',
    route: '/admin/clientes',
    order: 3,
  },
  {
    id: SystemModule.SALES,
    enabled: true,
    label: 'Servicios',
    icon: 'Sparkles',
    route: '/admin/servicios',
    order: 4,
  },
  {
    id: SystemModule.INVENTORY,
    enabled: true,
    label: 'Productos',
    icon: 'Package',
    route: '/admin/productos',
    order: 5,
  },
  {
    id: SystemModule.CASH_REGISTER,
    enabled: true,
    label: 'Caja / POS',
    icon: 'CreditCard',
    route: '/admin/caja',
    order: 6,
  },
  {
    id: SystemModule.SALES,
    enabled: true,
    label: 'Facturación / Ventas',
    icon: 'Receipt',
    route: '/admin/ventas',
    order: 7,
  },
  {
    id: SystemModule.EMPLOYEES,
    enabled: true,
    label: 'Empleados / Técnicos',
    icon: 'UserCircle',
    route: '/admin/empleados',
    order: 8,
  },
  {
    id: SystemModule.REPORTS,
    enabled: true,
    label: 'Reportes',
    icon: 'BarChart3',
    route: '/admin/reportes',
    requiredPlan: LicensePlan.PROFESSIONAL,
    order: 9,
  },
  {
    id: SystemModule.SETTINGS,
    enabled: true,
    label: 'Configuración',
    icon: 'Settings',
    route: '/admin/configuracion',
    order: 10,
  },
];

// ⭐ NUEVO - Módulos configurados para FERRETERÍA
const getHardwareModules = (): ModuleConfig[] => [
  {
    id: SystemModule.DASHBOARD,
    enabled: true,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/admin/dashboard',
    order: 1,
  },
  {
    id: SystemModule.SALES,
    enabled: true,
    label: 'Ventas / POS',
    icon: 'ShoppingCart',
    route: '/admin/ventas',
    order: 2,
  },
  {
    id: SystemModule.INVENTORY,
    enabled: true,
    label: 'Productos',
    icon: 'Package',
    route: '/admin/productos',
    order: 3,
  },
  {
    id: SystemModule.INVENTORY,
    enabled: true,
    label: 'Inventario',
    icon: 'Boxes',
    route: '/admin/inventario',
    order: 4,
  },
  {
    id: SystemModule.SUPPLIERS,
    enabled: true,
    label: 'Proveedores / Compras',
    icon: 'Truck',
    route: '/admin/proveedores',
    order: 5,
  },
  {
    id: SystemModule.PURCHASE_ORDERS,
    enabled: true,
    label: 'Órdenes de compra',
    icon: 'ShoppingBag',
    route: '/admin/ordenes',
    order: 6,
  },
  {
    id: SystemModule.CASH_REGISTER,
    enabled: true,
    label: 'Caja registradora',
    icon: 'CreditCard',
    route: '/admin/caja',
    order: 7,
  },
  {
    id: SystemModule.CUSTOMERS,
    enabled: true,
    label: 'Clientes',
    icon: 'Users',
    route: '/admin/clientes',
    order: 8,
  },
  {
    id: SystemModule.REPORTS,
    enabled: true,
    label: 'Reportes',
    icon: 'BarChart3',
    route: '/admin/reportes',
    requiredPlan: LicensePlan.PROFESSIONAL,
    order: 9,
  },
  {
    id: SystemModule.SETTINGS,
    enabled: true,
    label: 'Configuración',
    icon: 'Settings',
    route: '/admin/configuracion',
    order: 10,
  },
];

// Configuración mock del sistema
const mockSystemConfig: SystemConfig = {
  companyId: 'company-001',
  companyName: 'Restaurante El Buen Sabor',
  
  businessType: BusinessType.RESTAURANT,
  
  license: {
    plan: LicensePlan.PROFESSIONAL,
    status: LicenseStatus.ACTIVE,
    startDate: '2024-01-01',
    expirationDate: '2025-12-31',
    maxBranches: 3,
    maxUsers: 15,
    maxProducts: 1000,
    maxMonthlyOrders: 10000,
    enabledModules: [
      SystemModule.DASHBOARD,
      SystemModule.SALES,
      SystemModule.TABLES,
      SystemModule.KITCHEN,
      SystemModule.INVENTORY,
      SystemModule.SUPPLIERS,
      SystemModule.PURCHASE_ORDERS,
      SystemModule.CASH_REGISTER,
      SystemModule.PRINTERS,
      SystemModule.CUSTOMERS,
      SystemModule.EMPLOYEES,
      SystemModule.REPORTS,
      SystemModule.SETTINGS,
    ],
    features: {
      multiCurrency: true,
      multiBranch: true,
      advancedReports: true,
      apiAccess: true,
      whiteLabel: false,
      customIntegrations: true,
    },
  },
  
  currentBranch: {
    id: 'branch-001',
    name: 'Sucursal Centro',
    code: 'CEN',
    businessType: BusinessType.RESTAURANT,
    isHeadquarters: true,
    address: 'Calle 123 #45-67, Bogotá',
    phone: '+57 300 123 4567',
    email: 'centro@buensabor.com',
    timezone: 'America/Bogota',
    currency: {
      code: 'COP',
      name: 'Peso Colombiano',
      symbol: '$',
      isDefault: true,
      exchangeRate: 1,
      lastUpdate: '2025-02-17T10:00:00Z',
    },
    enabledModules: [
      SystemModule.DASHBOARD,
      SystemModule.SALES,
      SystemModule.TABLES,
      SystemModule.KITCHEN,
      SystemModule.INVENTORY,
      SystemModule.SUPPLIERS,
      SystemModule.PURCHASE_ORDERS,
      SystemModule.CASH_REGISTER,
      SystemModule.PRINTERS,
      SystemModule.CUSTOMERS,
      SystemModule.EMPLOYEES,
      SystemModule.REPORTS,
      SystemModule.SETTINGS,
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  enabledModules: getRestaurantModules(),
  
  availableOrderTypes: [
    OrderType.IMMEDIATE_SALE,
    OrderType.OPEN_ORDER,
    OrderType.DELIVERY_ORDER,
    OrderType.SCHEDULED_ORDER,
  ],
  
  orderStatuses: [
    OrderStatus.DRAFT,
    OrderStatus.PENDING,
    OrderStatus.IN_PROGRESS,
    OrderStatus.READY,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
  ],
  
  currencies: [
    {
      code: 'COP',
      name: 'Peso Colombiano',
      symbol: '$',
      isDefault: true,
      exchangeRate: 1,
      lastUpdate: '2025-02-17T10:00:00Z',
    },
    {
      code: 'USD',
      name: 'Dólar Estadounidense',
      symbol: 'US$',
      isDefault: false,
      exchangeRate: 0.00025,
      lastUpdate: '2025-02-17T10:00:00Z',
    },
  ],
  
  globalConversionMargin: 2.5,
  
  user: {
    id: 'user-001',
    name: 'Admin Principal',
    email: 'admin@buensabor.com',
    role: 'admin',
    permissions: [
      'view_dashboard',
      'manage_sales',
      'manage_inventory',
      'manage_employees',
      'manage_customers',
      'manage_suppliers',
      'manage_orders',
      'view_reports',
      'manage_settings',
      'manage_cash_register',
      'manage_printers',
      'manage_tables',
      'manage_kitchen',
      'manage_delivery',
    ],
  },
  
  lastSync: '2025-02-17T10:30:00Z',
  version: '1.0.0',
};

// ========================================
// FUNCIONES DEL SERVICIO
// ========================================

/**
 * Obtiene la configuración del sistema desde el backend
 * En producción, esto hará una llamada real al API de ASP.NET Core
 */
export async function getSystemConfig(): Promise<ConfigApiResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Reemplazar con llamada real al backend
  // const response = await fetch('/api/config/system');
  // const data = await response.json();
  
  return {
    success: true,
    data: mockSystemConfig,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Obtiene módulos según tipo de negocio
 * Utilidad para pruebas y desarrollo
 */
export function getModulesByBusinessType(businessType: BusinessType): ModuleConfig[] {
  switch (businessType) {
    case BusinessType.RESTAURANT:
    case BusinessType.BAR:
    case BusinessType.CAFE:
      return getRestaurantModules();
    
    case BusinessType.RETAIL:
    case BusinessType.WHOLESALE:
      return getRetailModules();
    
    case BusinessType.TECH_SERVICE:
      return getTechServiceModules();
    
    case BusinessType.SPA:
      return getSpaModules();
    
    case BusinessType.HARDWARE:
      return getHardwareModules();
    
    default:
      return getRestaurantModules();
  }
}

/**
 * Actualiza el margen de conversión global
 * En producción, enviará la actualización al backend
 */
export async function updateConversionMargin(margin: number): Promise<ConfigApiResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // TODO: Implementar llamada real al backend
  // const response = await fetch('/api/config/conversion-margin', {
  //   method: 'PUT',
  //   body: JSON.stringify({ margin }),
  // });
  
  mockSystemConfig.globalConversionMargin = margin;
  
  return {
    success: true,
    data: mockSystemConfig,
    message: 'Margen de conversión actualizado correctamente',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Cambia el tipo de negocio (solo para pruebas)
 * Esto permite ver cómo cambia la UI según el tipo de negocio
 */
export async function switchBusinessType(businessType: BusinessType): Promise<ConfigApiResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  mockSystemConfig.businessType = businessType;
  mockSystemConfig.enabledModules = getModulesByBusinessType(businessType);
  
  return {
    success: true,
    data: mockSystemConfig,
    message: `Tipo de negocio cambiado a ${businessType}`,
    timestamp: new Date().toISOString(),
  };
}