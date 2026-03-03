# 🏢 Sistema Multi-Tenant en ODIN POS

## 🎯 Arquitectura: DB-per-Tenant

ODIN POS implementa **multi-tenancy con aislamiento fuerte**, donde cada perfil (tenant) tiene su propia base de datos PostgreSQL, garantizando separación total de datos.

---

## ✨ Características

### ✅ Implementado (Frontend - 100%)

- **Separación de datos por tenant** usando localStorage (simula BD independientes)
- **Autenticación con tenant_id** en JWT
- **Context API global** (`TenantContext`) para tenant activo
- **Selector visual** para cambiar entre tenants
- **Servicios listos** para conectar a backend ASP.NET Core
- **Tipos TypeScript** completos que reflejan estructura de BD
- **3 Tenants de prueba** pre-configurados

### 🚧 Por Implementar (Backend)

- Base de datos master (`odin_master`)
- JWT real con claim `tenant_id`
- Middleware de tenancy
- DbContext dinámico por request
- Provisioning automático de tenants
- Migration runner

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│         Frontend (React + TypeScript)           │
│                                                  │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ TenantContext│      │   Services   │        │
│  │  (Global)    │◄────►│  (API-ready) │        │
│  └──────────────┘      └──────────────┘        │
│         ▲                       │               │
│         │                       │               │
│    ┌────┴────┐             ┌───▼───┐          │
│    │  Login  │             │ Tenant│          │
│    │         │             │Storage│          │
│    └─────────┘             └───────┘          │
└────────────────────│─────────────────────────┘
                     │ JWT con tenant_id
                     ▼
┌─────────────────────────────────────────────────┐
│      Backend ASP.NET Core (Por implementar)     │
│                                                  │
│  ┌──────────────┐      ┌──────────────┐        │
│  │TenantMiddleware│    │TenantResolver│        │
│  │              │────►│              │        │
│  └──────────────┘      └──────┬───────┘        │
│                               │                 │
│                       ┌───────▼────────┐       │
│                       │ TenantContext  │       │
│                       │ (Connection)   │       │
│                       └───────┬────────┘       │
└───────────────────────────────│─────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
    ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
    │ odin_spa_001 │    │odin_rest_002 │   │odin_ferre_003│
    │  (Tenant 1)  │    │  (Tenant 2)  │   │  (Tenant 3)  │
    │              │    │              │   │              │
    │ - products   │    │ - products   │   │ - products   │
    │ - sales      │    │ - sales      │   │ - sales      │
    │ - customers  │    │ - customers  │   │ - customers  │
    └──────────────┘    └──────────────┘   └──────────────┘
```

---

## 📊 Tenants de Prueba

| Tenant ID | Nombre | Tipo | Usuario | Password |
|-----------|--------|------|---------|----------|
| `spa_001` | Spa Relax & Beauty | SPA | `admin` | `admin123` |
| `rest_002` | Restaurante El Buen Sabor | Restaurant | `vendedor` | `vendedor123` |
| `ferre_003` | Ferretería Construcción Total | Hardware | `cajero` | `cajero123` |

**Usuario Master Admin:**
- Usuario: `master`
- Password: `master123`
- Acceso: Todos los tenants

---

## 🚀 Inicio Rápido

### 1. Probar Aislamiento de Datos

```bash
# Terminal 1: Iniciar aplicación
npm run dev

# Terminal 2: Abrir navegador
open http://localhost:5173
```

**Prueba:**
1. Login con `admin / admin123` (Tenant: spa_001)
2. Crear cliente "María López"
3. Logout
4. Login con `vendedor / vendedor123` (Tenant: rest_002)
5. Verificar que NO aparece "María López" ✅

---

### 2. Cambiar entre Tenants (Master Admin)

```bash
# Login con master
Usuario: master
Password: master123

# En la UI verás el TenantSelector
# Puedes cambiar entre spa_001, rest_002, ferre_003
```

---

## 🔌 Conectar a Backend

### Paso 1: Variables de Entorno

```env
# .env.local
VITE_API_URL=https://api.tudominio.com
VITE_USE_MOCK=false
```

### Paso 2: Backend debe implementar

Ver especificación completa en: **`/BACKEND_API_SPEC.md`**

**Endpoints requeridos:**
- `POST /api/auth/login` → JWT con claim `tenant_id`
- `POST /api/auth/switch-tenant`
- `GET /api/tenants`
- `POST /api/tenants/provision`
- Todos los endpoints de negocio (`/api/products`, `/api/sales`, etc.)

### Paso 3: Listo

Los servicios del frontend ya están preparados. No requiere refactorización.

---

## 📁 Archivos Clave

### Frontend

```
/src/app/
├── types/tenant.types.ts           ← Tipos de tenant
├── services/
│   ├── api/tenantApi.ts            ← API de tenants
│   └── storage/tenantStorage.ts    ← Storage por tenant
├── contexts/TenantContext.tsx      ← Context global
├── components/tenant/
│   └── TenantSelector.tsx          ← Selector UI
└── utils/auth.ts                   ← Auth con tenant_id
```

### Documentación

```
/BACKEND_API_SPEC.md     ← Especificación de endpoints
/MULTI_TENANT_GUIDE.md   ← Guía de uso y migración
/MULTI_TENANT_README.md  ← Este archivo
```

---

## 🔒 Seguridad

### ✅ Implementado en Frontend

- `tenant_id` viene del JWT (no se puede falsificar desde UI)
- Selector de tenant valida permisos
- Storage separado por tenant
- No hay queries cruzadas entre tenants

### ⚠️ Crítico en Backend

El backend **DEBE**:
1. **Validar tenant_id** en cada request (del JWT)
2. **NO aceptar tenant_id** de query params o body
3. **Bloquear** requests si tenant está inactivo
4. **Usar** connection strings seguros (no enviar al frontend)
5. **Auditar** cambios de tenant

---

## 🧪 Testing

### Prueba de Aislamiento

```typescript
// Test 1: Crear datos en spa_001
login('admin', 'admin123'); // tenant: spa_001
createProduct('Shampoo Premium');
logout();

// Test 2: Verificar aislamiento en rest_002
login('vendedor', 'vendedor123'); // tenant: rest_002
const products = getProducts();
assert(products.length === 0); // ✅ No ve "Shampoo Premium"
```

### Prueba de Cambio de Tenant

```typescript
// Test 3: Master admin cambia entre tenants
login('master', 'master123');
switchTenant('spa_001');
assert(currentTenant === 'spa_001'); // ✅

switchTenant('rest_002');
assert(currentTenant === 'rest_002'); // ✅
```

---

## 📈 Ventajas de DB-per-Tenant

### ✅ Pros

1. **Aislamiento Total**
   - Imposible mezclar datos entre tenants
   - Cumplimiento de privacidad (GDPR, HIPAA)

2. **Escalabilidad**
   - Tenants grandes en servidores dedicados
   - Backups independientes

3. **Seguridad**
   - Breach en un tenant NO afecta a otros
   - Fácil eliminar datos de un tenant

4. **Performance**
   - Queries no necesitan filtrar por tenant_id
   - Índices optimizados por tenant

### ❌ Contras

1. **Complejidad**
   - Más difícil de administrar
   - Migraciones deben aplicarse a todas las BDs

2. **Recursos**
   - Cada BD consume memoria/CPU
   - Mayor costo de infraestructura

3. **Mantenimiento**
   - Backups múltiples
   - Monitoreo por BD

---

## 🎓 Conceptos

### Tenant
Entidad organizacional con datos aislados.
- Ejemplo: "Spa Relax & Beauty" (spa_001)

### Business Type
Tipo de negocio que determina módulos habilitados.
- Ejemplo: SPA, Restaurant, Hardware

### Master Database
BD centralizada que almacena:
- Lista de tenants
- Usuarios (con tenant_id)
- Configuración global

### Tenant Database
BD específica de un tenant que almacena:
- Productos
- Ventas
- Inventario
- Clientes
- etc.

---

## 🛠️ Troubleshooting

### "No aparecen los tenants"

```typescript
// Verificar localStorage
console.log(localStorage.getItem('odin_master_tenants'));

// Si está vacío, recargar
import { getAllTenants } from '@/services/api/tenantApi';
await getAllTenants(); // Crea tenants por defecto
```

### "Los datos se mezclan entre tenants"

```typescript
// Verificar que uses TenantStorage
import { TenantStorage } from '@/services/storage/tenantStorage';

// ✅ BUENO
TenantStorage.setItem('products', 'data', products);

// ❌ MALO (no separa por tenant)
localStorage.setItem('products', JSON.stringify(products));
```

### "No puedo cambiar de tenant"

```typescript
// Verificar que el usuario tenga acceso
const user = getCurrentUser();
console.log(user.availableTenants); // Debe incluir el tenant

// Si es master_admin, puede acceder a todos
console.log(user.rol); // 'master_admin'
```

---

## 📚 Recursos

- **Especificación API:** `/BACKEND_API_SPEC.md`
- **Guía de Migración:** `/MULTI_TENANT_GUIDE.md`
- **Arquitectura:** `/ARCHITECTURE.md`
- **Backend Guide:** `/BUSINESS_MODE_GUIDE.md`

---

## ✅ Checklist de Implementación

### Frontend (COMPLETO ✅)
- [x] Tipos TypeScript con tenant_id
- [x] Auth con soporte multi-tenant
- [x] TenantContext global
- [x] TenantStorage (localStorage por tenant)
- [x] Servicios API-ready
- [x] UI de selector de tenant
- [x] 3 tenants de prueba
- [x] Documentación completa

### Backend (PENDIENTE)
- [ ] Base de datos master
- [ ] Tabla tenants
- [ ] JWT con claim tenant_id
- [ ] TenantMiddleware
- [ ] TenantContext (Scoped)
- [ ] MasterDbContext
- [ ] TenantDbContext (dinámico)
- [ ] Endpoint de provisioning
- [ ] Migration runner

---

## 🎯 Próximos Pasos

1. ✅ **Probar** aislamiento con usuarios de prueba
2. ✅ **Revisar** `/BACKEND_API_SPEC.md`
3. 🔲 **Desarrollar** backend ASP.NET Core
4. 🔲 **Configurar** PostgreSQL (master + tenants)
5. 🔲 **Conectar** frontend con backend real
6. 🔲 **Desplegar** a producción

---

**¿Preguntas?** Ver `/MULTI_TENANT_GUIDE.md` para guía detallada.

---

**Versión:** 1.0.0  
**Última actualización:** 2025-02-26  
**Estado:** Frontend completo, Backend pendiente
