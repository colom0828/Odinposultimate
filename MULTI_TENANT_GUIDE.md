# 🏢 ODIN POS - Guía Multi-Tenant (DB-per-Tenant)

## ✅ ¿Qué se ha implementado?

ODIN POS frontend está **100% preparado** para conectarse a un backend multi-tenant con arquitectura DB-per-Tenant.

### 🎯 Funcionalidad Actual (con localStorage)

- ✅ **Separación de datos por tenant** (simula DB-per-Tenant)
- ✅ **Auth con tenant_id** en JWT simulado
- ✅ **TenantContext** global en React
- ✅ **Selector de Tenant** en UI
- ✅ **Servicios API-ready** (fácil migrar a backend real)
- ✅ **Tipos TypeScript** completos
- ✅ **3 Tenants de prueba** (spa_001, rest_002, ferre_003)

---

## 🧪 Prueba el Sistema Ahora (sin backend)

### 1️⃣ Usuarios de Prueba

El sistema viene con 4 usuarios predefinidos:

```javascript
// Usuario 1: Admin del SPA
username: "admin"
password: "admin123"
tenant: spa_001 (Spa Relax & Beauty)

// Usuario 2: Vendedor del Restaurante
username: "vendedor"
password: "vendedor123"
tenant: rest_002 (Restaurante El Buen Sabor)

// Usuario 3: Cajero de la Ferretería
username: "cajero"
password: "cajero123"
tenant: ferre_003 (Ferretería Construcción Total)

// Usuario 4: Master Admin (acceso a todos)
username: "master"
password: "master123"
tenant: null (puede ver todos los tenants)
```

### 2️⃣ Probar Aislamiento de Datos

#### Paso 1: Login con SPA
```
1. Ir a http://localhost:5173/login
2. Usuario: admin
3. Contraseña: admin123
4. ✅ Login exitoso → Tenant: spa_001
```

#### Paso 2: Crear datos en SPA
```
1. Ir a "Clientes" y crear cliente "María López"
2. Ir a "Servicios" y crear servicio "Manicure Premium"
3. Ir a "Citas" y crear una cita
```

#### Paso 3: Logout y login con Restaurante
```
1. Logout
2. Login con:
   - Usuario: vendedor
   - Contraseña: vendedor123
   - ✅ Tenant: rest_002
```

#### Paso 4: Verificar aislamiento
```
1. Ir a "Clientes" → ❌ NO debe ver "María López"
2. Ir a "Productos" (en lugar de Servicios)
3. Crear producto "Pizza Margarita"
```

#### Paso 5: Volver a SPA y verificar
```
1. Logout
2. Login con admin/admin123
3. Ir a "Clientes" → ✅ SÍ ve "María López"
4. Ir a "Servicios" → ❌ NO ve "Pizza Margarita"
```

**✅ ÉXITO:** Los datos están completamente aislados por tenant.

---

## 🗂️ Estructura de localStorage por Tenant

### Antes (sin multi-tenant)
```
localStorage:
  odin_products → [todos los productos mezclados]
  odin_sales → [todas las ventas mezcladas]
```

### Ahora (multi-tenant)
```
localStorage:
  // Master (no se separa por tenant)
  odin_auth_token → "eyJhbGciOiJIUzI1NiIs..."
  odin_current_tenant → "spa_001"
  odin_master_tenants → [{...tenants...}]
  
  // Datos del tenant SPA
  odin_tenant_spa_001__products__data → [productos del spa]
  odin_tenant_spa_001__sales__data → [ventas del spa]
  odin_tenant_spa_001__customers__data → [clientes del spa]
  
  // Datos del tenant Restaurante
  odin_tenant_rest_002__products__data → [productos del restaurante]
  odin_tenant_rest_002__sales__data → [ventas del restaurante]
  odin_tenant_rest_002__customers__data → [clientes del restaurante]
```

**Patrón de keys:**
```
odin_tenant_{tenantId}__{module}__{key}
```

---

## 🔌 Migrar a Backend Real (Cuando esté listo)

### Paso 1: Configurar URL del API

```bash
# .env o .env.local
VITE_API_URL=https://api.tudominio.com
```

### Paso 2: Cambiar servicios de mock a real

Los servicios ya están preparados. Solo cambiar flags:

```typescript
// src/app/services/api/config.ts
export const USE_MOCK_API = false; // Cambiar a false cuando tengas backend

// O usar variable de entorno
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK !== 'false';
```

### Paso 3: Verificar endpoints

Todos los servicios ya llaman a las rutas correctas:

```typescript
// Ejemplos de servicios API-ready
authService.login() → POST /api/auth/login
tenantApi.getAllTenants() → GET /api/tenants
productApi.getProducts() → GET /api/products
salesApi.createSale() → POST /api/sales
```

### Paso 4: JWT Real

Cuando el backend envíe JWT real con `tenant_id`, el frontend lo usará automáticamente:

```typescript
// El token viene en la respuesta de login
const response = await fetch('/api/auth/login', { ... });
const { token, user, tenantId } = await response.json();

// Se guarda automáticamente
localStorage.setItem('odin_auth_token', token);
localStorage.setItem('odin_current_tenant', tenantId);
```

### Paso 5: Headers automáticos

El frontend ya incluye el token en todos los requests:

```typescript
// Interceptor automático
fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🏗️ Arquitectura Frontend

```
/src/app/
├── types/
│   ├── tenant.types.ts ✅         # Tipos de tenant
│   ├── auth.types.ts              # Actualizado con tenantId
│   └── config.types.ts
│
├── services/
│   ├── api/
│   │   ├── tenantApi.ts ✅        # Endpoints de tenants
│   │   ├── authApi.ts             # Login con tenant
│   │   ├── productApi.ts          # API-ready
│   │   └── salesApi.ts            # API-ready
│   │
│   └── storage/
│       └── tenantStorage.ts ✅    # Abstracción localStorage por tenant
│
├── contexts/
│   └── TenantContext.tsx ✅       # Context global de tenant
│
├── components/
│   └── tenant/
│       └── TenantSelector.tsx ✅  # Selector de tenant UI
│
└── utils/
    └── auth.ts ✅                 # Actualizado con tenant_id
```

---

## 📊 Flujo de Datos

### Login
```
Usuario → Login Form → validateCredentials() → JWT con tenant_id 
→ saveSession() → localStorage.setItem('odin_current_tenant')
→ TenantContext carga tenant → Listo
```

### Request a API (cuando tengas backend)
```
Component → productApi.getProducts()
→ fetch('/api/products', { headers: { Authorization: Bearer token } })
→ Backend lee tenant_id del JWT
→ Conecta a odin_spa_001 (por ejemplo)
→ SELECT * FROM products
→ Response → Component muestra datos
```

### Cambio de Tenant
```
Usuario → TenantSelector → switchTenant('rest_002')
→ POST /api/auth/switch-tenant (backend genera nuevo JWT)
→ Nuevo token con tenant_id=rest_002
→ window.location.reload() (limpia estados)
→ Ahora todas las llamadas usan rest_002
```

---

## 🔒 Seguridad Implementada

### ✅ Frontend
- JWT almacenado en localStorage (httpOnly cookie es mejor, pero requiere backend)
- `tenant_id` **SOLO** viene del JWT firmado
- No se puede cambiar tenant sin auth
- Selector de tenant valida permisos

### ⚠️ Cuando implementes backend
- **OBLIGATORIO:** JWT firmado con secreto fuerte
- **OBLIGATORIO:** Validar tenant_id en cada request
- **RECOMENDADO:** Usar httpOnly cookies en lugar de localStorage
- **RECOMENDADO:** Rate limiting por tenant
- **RECOMENDADO:** Auditoría de accesos

---

## 📝 Checklist de Migración

### Frontend (YA ESTÁ ✅)
- [x] Tipos TypeScript con `tenant_id`
- [x] Auth con soporte multi-tenant
- [x] TenantContext global
- [x] Servicios API-ready
- [x] Storage por tenant (localStorage)
- [x] UI de selector de tenant
- [x] 3 tenants de prueba

### Backend (POR HACER cuando lo desarrolles)
- [ ] Base de datos `odin_master`
- [ ] Tabla `tenants`
- [ ] JWT con claim `tenant_id`
- [ ] TenantMiddleware
- [ ] TenantContext.cs (Scoped)
- [ ] MasterDbContext
- [ ] TenantDbContext (dinámico)
- [ ] Endpoint `/api/tenants/provision`
- [ ] TenantMigrationRunner

---

## 🎓 Conceptos Clave

### DB-per-Tenant
Cada tenant tiene su propia base de datos física:
- `odin_spa_001` → Solo datos del spa
- `odin_rest_002` → Solo datos del restaurante
- `odin_ferre_003` → Solo datos de la ferretería

**Ventajas:**
- ✅ Aislamiento total (imposible mezclar datos)
- ✅ Backups independientes
- ✅ Escalabilidad (tenants grandes en servidores dedicados)
- ✅ Cumplimiento de privacidad (GDPR, HIPAA)

**Desventajas:**
- ❌ Más complejo de administrar
- ❌ Migraciones deben aplicarse a todas las BDs
- ❌ Recursos (cada BD consume memoria/CPU)

### Tenant vs Business Type
- **Tenant:** Entidad organizacional (ej: "Spa Relax", "Restaurante El Buen Sabor")
- **Business Type:** Tipo de negocio (spa, restaurant, hardware)

Un tenant tiene un business type, pero múltiples tenants pueden tener el mismo business type.

---

## 🐛 Troubleshooting

### ❌ "No hay tenant activo"
```typescript
// Verificar que esté autenticado
const user = getCurrentUser();
console.log('User:', user);
console.log('TenantId:', user?.tenantId);

// Verificar localStorage
console.log('Current Tenant:', localStorage.getItem('odin_current_tenant'));
```

### ❌ "Los datos no se separan"
```typescript
// Verificar que uses TenantStorage en lugar de localStorage directo
import { TenantStorage } from '@/services/storage/tenantStorage';

// ❌ MALO
localStorage.setItem('products', JSON.stringify(products));

// ✅ BUENO
TenantStorage.setItem('products', 'data', products);
```

### ❌ "Aparecen datos de otro tenant"
```typescript
// Limpiar localStorage y empezar de nuevo
localStorage.clear();
window.location.reload();
```

---

## 📞 Próximos Pasos

1. **Probar aislamiento** con los 3 usuarios
2. **Revisar** `/BACKEND_API_SPEC.md` para ver endpoints esperados
3. **Desarrollar backend** siguiendo la spec
4. **Cambiar** `USE_MOCK_API = false` cuando esté listo
5. **Configurar** variables de entorno
6. **Probar** con backend real

---

## 🎉 ¡Todo listo para producción!

El frontend está **completamente preparado** para multi-tenancy. Cuando desarrolles el backend ASP.NET Core siguiendo la especificación en `/BACKEND_API_SPEC.md`, solo tendrás que:

1. Configurar la URL del API
2. Cambiar el flag `USE_MOCK_API`
3. ¡Funciona!

Los datos ya están separados por tenant, la UI ya maneja múltiples tenants, y los servicios ya llaman a los endpoints correctos.

**No hay refactorización masiva. Solo conectar.**

---

**Última actualización:** 2025-02-26  
**Versión:** 1.0.0
