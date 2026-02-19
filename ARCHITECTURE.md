# 🏗️ ODIN POS - Arquitectura de Configuración Dinámica

## 📋 Visión General

ODIN POS implementa una arquitectura frontend **modular, dinámica y escalable** que permite adaptar la interfaz según:

- **Tipo de negocio** (restaurante, retail, servicio técnico, etc.)
- **Plan de licencia** (free, basic, professional, enterprise)
- **Módulos habilitados** (mesas, cocina, delivery, etc.)
- **Permisos del usuario** (admin, manager, cashier, etc.)

### 🎯 Principio Fundamental

> **El frontend es "tonto"**: Solo renderiza lo que el backend le indica. No toma decisiones de negocio.

---

## 📁 Estructura de Archivos

```
/src/app/
├── types/
│   └── config.types.ts          # Tipos TypeScript centralizados
├── contexts/
│   └── ConfigContext.tsx        # Context API para estado global
├── services/
│   └── configService.ts         # Servicio de comunicación con backend
├── hooks/
│   └── useConfig.ts             # Hooks de conveniencia
└── components/
    ├── AdminSidebar.tsx         # Sidebar dinámico
    └── DevPanel.tsx             # Panel de desarrollo (solo dev)
```

---

## 🔧 Componentes Principales

### 1️⃣ **Tipos TypeScript** (`config.types.ts`)

Define la estructura de datos para toda la configuración del sistema:

```typescript
// Enums
- BusinessType: tipos de negocio soportados
- SystemModule: módulos disponibles
- LicensePlan: planes de licencia
- OrderType: tipos de orden
- OrderStatus: estados de orden

// Interfaces
- SystemConfig: configuración completa del sistema
- ModuleConfig: configuración de un módulo
- LicenseConfig: información de licencia
- BranchConfig: configuración de sucursal
- Currency: información de moneda
```

### 2️⃣ **ConfigContext** (`ConfigContext.tsx`)

Context API que provee la configuración a toda la aplicación:

```typescript
const { config, loading, error } = useConfig();

// Verificar si un módulo está habilitado
const hasTables = isModuleEnabled(SystemModule.TABLES);

// Verificar permisos del usuario
const canManageSales = hasPermission('manage_sales');

// Verificar estado de licencia
const licenseValid = isLicenseValid();
```

### 3️⃣ **Config Service** (`configService.ts`)

Servicio que se comunica con el backend ASP.NET Core:

```typescript
// Obtener configuración del sistema
const response = await getSystemConfig();

// Cambiar tipo de negocio (solo desarrollo)
await switchBusinessType(BusinessType.RETAIL);

// Actualizar margen de conversión
await updateConversionMargin(2.5);
```

### 4️⃣ **AdminSidebar Dinámico** (`AdminSidebar.tsx`)

Sidebar que renderiza módulos según configuración:

- Lee `config.enabledModules`
- Renderiza solo módulos con `enabled: true`
- Muestra iconos dinámicamente desde lucide-react
- Respeta el orden definido en `module.order`
- Muestra alertas si la licencia está vencida

### 5️⃣ **DevPanel** (`DevPanel.tsx`)

Panel de desarrollo para probar diferentes configuraciones:

- Solo visible en modo desarrollo
- Permite cambiar tipo de negocio en tiempo real
- Muestra configuración actual
- Recarga automáticamente la configuración

---

## 🚀 Cómo Usar

### Verificar si un módulo está habilitado

```tsx
import { useModule } from '@/app/hooks/useConfig';
import { SystemModule } from '@/app/types/config.types';

function MyComponent() {
  const hasDelivery = useModule(SystemModule.DELIVERY);
  
  return (
    <div>
      {hasDelivery && <DeliverySection />}
    </div>
  );
}
```

### Verificar permisos del usuario

```tsx
import { usePermission } from '@/app/hooks/useConfig';

function MyComponent() {
  const canEdit = usePermission('manage_products');
  
  return (
    <button disabled={!canEdit}>
      Editar Producto
    </button>
  );
}
```

### Acceder a configuración completa

```tsx
import { useConfig } from '@/app/hooks/useConfig';

function MyComponent() {
  const { config, loading } = useConfig();
  
  if (loading) return <Skeleton />;
  
  return (
    <div>
      <h1>{config.companyName}</h1>
      <p>Tipo: {config.businessType}</p>
      <p>Plan: {config.license.plan}</p>
    </div>
  );
}
```

---

## 🔄 Flujo de Datos

```
1. App inicia
   ↓
2. ConfigProvider se monta
   ↓
3. Llama a getSystemConfig() (backend)
   ↓
4. Backend devuelve SystemConfig
   ↓
5. ConfigContext almacena config
   ↓
6. Componentes acceden vía useConfig()
   ↓
7. UI se renderiza dinámicamente
```

---

## 📦 Tipos de Negocio Soportados

### 🍽️ **RESTAURANT**
- Dashboard
- Ventas
- **Mesas** ⭐
- **Cocina** ⭐
- **Delivery** ⭐
- Inventario
- Proveedores
- Órdenes de compra
- Caja
- Impresoras
- Clientes
- Empleados
- Reportes
- Configuración

### 🏪 **RETAIL**
- Dashboard
- Ventas
- Inventario
- Proveedores
- Órdenes de compra
- Caja
- Impresoras
- Clientes
- Empleados
- Configuración

### 🔧 **TECH_SERVICE**
- Dashboard
- **Órdenes de servicio** ⭐
- **Citas** ⭐
- Inventario (repuestos)
- Clientes
- Técnicos
- Configuración

---

## 🎨 Personalización

### Agregar un nuevo módulo

1. **Definir en enums** (`config.types.ts`):
```typescript
export enum SystemModule {
  // ... existentes
  MY_NEW_MODULE = 'my_new_module',
}
```

2. **Agregar a configuración** (`configService.ts`):
```typescript
{
  id: SystemModule.MY_NEW_MODULE,
  enabled: true,
  label: 'Mi Módulo',
  icon: 'Star',
  route: '/admin/mi-modulo',
  order: 99,
}
```

3. **Crear página** (`/src/app/(admin)/mi-modulo/page.tsx`):
```tsx
export default function MyModulePage() {
  return <div>Mi nuevo módulo</div>;
}
```

### Crear un nuevo tipo de negocio

1. **Definir en enum**:
```typescript
export enum BusinessType {
  MY_BUSINESS = 'my_business',
}
```

2. **Crear configuración de módulos**:
```typescript
const getMyBusinessModules = (): ModuleConfig[] => [
  // ... módulos específicos
];
```

3. **Agregar al switch** en `getModulesByBusinessType()`.

---

## 🔐 Sistema de Permisos

Los permisos se verifican con `usePermission()`:

```typescript
// Permisos comunes
'view_dashboard'
'manage_sales'
'manage_inventory'
'manage_employees'
'manage_customers'
'manage_suppliers'
'manage_orders'
'view_reports'
'manage_settings'
```

---

## 📊 Estados de Licencia

```typescript
ACTIVE     // ✅ Licencia activa
TRIAL      // 🆓 Periodo de prueba
EXPIRED    // ❌ Licencia vencida
SUSPENDED  // ⚠️ Licencia suspendida
CANCELLED  // 🚫 Licencia cancelada
```

---

## 🎯 Próximos Pasos

Esta arquitectura de fundamentos está lista para:

1. ✅ **Módulo de Conversión de Monedas** - UI que muestre precios convertidos
2. ✅ **Núcleo Universal de Órdenes** - Renderizado dinámico de tipos de orden
3. ✅ **Panel Super Admin** - Gestión de empresas y licencias
4. ✅ **Sistema Multi-sucursales** - Gestión de múltiples ubicaciones

---

## 🛠️ Modo Desarrollo

El **DevPanel** permite cambiar el tipo de negocio en tiempo real:

1. Click en el botón de configuración (esquina inferior derecha)
2. Selecciona un tipo de negocio
3. La UI se reconfigura automáticamente
4. Los módulos cambian dinámicamente

> ⚠️ El DevPanel **NO** está visible en producción.

---

## 📝 Notas Importantes

- ✅ El frontend **NO** hace cálculos de negocio
- ✅ El frontend **NO** valida licencias localmente
- ✅ El frontend **SOLO** renderiza según configuración del backend
- ✅ Toda la lógica de negocio está en ASP.NET Core
- ✅ La configuración se actualiza desde el backend
- ✅ Los módulos se habilitan/deshabilitan dinámicamente

---

## 🔗 Integración con Backend

### Endpoint esperado

```
GET /api/config/system
```

### Respuesta esperada

```json
{
  "success": true,
  "data": {
    "companyId": "company-001",
    "businessType": "restaurant",
    "license": { ... },
    "currentBranch": { ... },
    "enabledModules": [ ... ],
    "availableOrderTypes": [ ... ],
    "currencies": [ ... ],
    "user": { ... }
  },
  "timestamp": "2025-02-17T10:00:00Z"
}
```

---

## 🎉 Resultado

Un sistema **verdaderamente modular** donde:

- ✅ La misma base de código sirve para **múltiples industrias**
- ✅ Los módulos se **habilitan/deshabilitan** dinámicamente
- ✅ La UI se **adapta automáticamente** al tipo de negocio
- ✅ El sistema es **escalable** y **mantenible**
- ✅ Preparado para **modo SaaS multi-empresa**

---

**Desarrollado con ❤️ para ODIN POS**
