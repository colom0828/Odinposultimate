# 🔌 ODIN POS - Backend API Specification

## 📚 Multi-Tenant DB-per-Tenant Architecture

Esta documentación define los endpoints que el frontend espera del backend ASP.NET Core para funcionar con la arquitectura multi-tenant.

---

## 🏗️ Arquitectura

### Bases de Datos

1. **Master Database** (`odin_master`)
   - Almacena: tenants, usuarios, configuración global
   - Connection string fijo en `appsettings.json`

2. **Tenant Databases** (`odin_<tenant_id>`)
   - Una BD por tenant (DB-per-Tenant)
   - Almacena: productos, ventas, inventario, caja, etc.
   - Connection string dinámico por request

### Flujo de Request

```
Cliente → JWT con tenant_id → TenantMiddleware → TenantResolver 
→ TenantContext → DbContext dinámico → Base de datos del tenant
```

---

## 🔐 Autenticación

### POST `/api/auth/login`

Inicia sesión y retorna JWT con `tenant_id`.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123",
  "tenantId": "spa_001"  // Opcional si usuario tiene un solo tenant
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@spa.com",
    "nombre": "Administrador",
    "rol": "admin",
    "tenantId": "spa_001",
    "availableTenants": ["spa_001", "spa_002"]  // Si tiene acceso a múltiples
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tenantId": "spa_001"
}
```

**JWT Claims obligatorios:**
```json
{
  "sub": "user-uuid",
  "email": "admin@spa.com",
  "name": "Administrador",
  "role": "admin",
  "tenant_id": "spa_001",  // ⭐ CRÍTICO
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Usuario o contraseña incorrectos"
}
```

---

### POST `/api/auth/switch-tenant`

Cambia el tenant activo del usuario (si tiene acceso a múltiples tenants).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "tenantId": "rest_002"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cambiado a tenant: rest_002",
  "user": { /* usuario actualizado */ },
  "token": "nuevo_jwt_con_tenant_id_rest_002",
  "tenantId": "rest_002"
}
```

**Response (403):**
```json
{
  "success": false,
  "message": "No tienes acceso a este tenant"
}
```

---

## 🏢 Gestión de Tenants (Admin Master)

### GET `/api/tenants`

Lista todos los tenants del sistema (solo admin master).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Params:**
```
page=1
pageSize=50
status=active  // active, inactive, all
```

**Response (200):**
```json
{
  "tenants": [
    {
      "id": "uuid",
      "tenantId": "spa_001",
      "name": "Spa Relax & Beauty",
      "businessType": "spa",
      "dbName": "odin_spa_001",
      "dbHost": "localhost",
      "dbPort": 5432,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-02-26T10:00:00Z",
      "contactEmail": "admin@spa.com",
      "contactPhone": "+1 809-555-0101",
      "config": {
        "enabledModules": ["appointments", "customers"],
        "locale": "es-DO",
        "timezone": "America/Santo_Domingo",
        "currency": "DOP",
        "features": {
          "eInvoicing": true
        }
      }
    }
  ],
  "total": 25,
  "page": 1,
  "pageSize": 50
}
```

---

### GET `/api/tenants/:tenantId`

Obtiene información de un tenant específico.

**Response (200):**
```json
{
  "id": "uuid",
  "tenantId": "spa_001",
  "name": "Spa Relax & Beauty",
  ...
}
```

**Response (404):**
```json
{
  "message": "Tenant no encontrado"
}
```

---

### POST `/api/tenants/provision`

Crea un nuevo tenant (solo admin master).

**Headers:**
```
Authorization: Bearer <token_master_admin>
Content-Type: application/json
```

**Request:**
```json
{
  "tenantId": "cafe_004",
  "name": "Cafetería El Aroma",
  "businessType": "cafe",
  "contactEmail": "admin@cafe.com",
  
  // Opcionales (usar defaults si no vienen)
  "dbHost": "localhost",
  "dbPort": 5432,
  "locale": "es-DO",
  "timezone": "America/Santo_Domingo",
  
  // Usuario administrador inicial
  "adminUser": {
    "email": "admin@cafe.com",
    "password": "Temporal123!",
    "name": "Admin Café"
  }
}
```

**Backend debe:**
1. Validar que `tenantId` sea único
2. `INSERT` en `odin_master.tenants`
3. `CREATE DATABASE odin_cafe_004`
4. Ejecutar migraciones EF Core en la nueva BD
5. Crear usuario admin inicial
6. Retornar credenciales temporales

**Response (201):**
```json
{
  "success": true,
  "message": "Tenant 'cafe_004' creado exitosamente",
  "tenant": { /* TenantInfo completo */ },
  "adminCredentials": {
    "email": "admin@cafe.com",
    "temporaryPassword": "Temporal123!"
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "El tenant 'cafe_004' ya existe"
}
```

---

### PUT `/api/tenants/:tenantId`

Actualiza información del tenant.

**Request:**
```json
{
  "name": "Spa Relax Premium",
  "contactEmail": "nuevo@spa.com",
  "config": {
    "features": {
      "advancedReports": true
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tenant actualizado",
  "tenant": { /* TenantInfo actualizado */ }
}
```

---

### DELETE `/api/tenants/:tenantId`

Desactiva un tenant (NO borra la BD).

**Response (200):**
```json
{
  "success": true,
  "message": "Tenant desactivado"
}
```

---

### POST `/api/tenants/:tenantId/migrate`

Aplica migraciones pendientes a un tenant específico.

**Response (200):**
```json
{
  "success": true,
  "message": "Migraciones aplicadas exitosamente",
  "migrationsApplied": ["20250226_AddPrintTemplates", "20250226_UpdateInvoices"]
}
```

---

### POST `/api/tenants/migrate-all`

Aplica migraciones a TODOS los tenants activos (solo admin master).

**Response (200):**
```json
{
  "success": true,
  "message": "Migraciones aplicadas a 15 tenants",
  "results": [
    { "tenantId": "spa_001", "success": true },
    { "tenantId": "rest_002", "success": true },
    { "tenantId": "ferre_003", "success": false, "error": "Connection timeout" }
  ]
}
```

---

## 🛒 Endpoints de Negocio (con tenant_id en JWT)

Todos estos endpoints operan sobre la **BD del tenant** extraído del JWT.

### Ejemplo: GET `/api/products`

**Headers:**
```
Authorization: Bearer <token_con_tenant_id>
```

**Backend debe:**
1. Leer `tenant_id` del claim JWT
2. Resolver connection string del tenant desde `odin_master`
3. Conectar `TenantDbContext` a `odin_spa_001` (por ejemplo)
4. Ejecutar query: `SELECT * FROM products WHERE ...`
5. Retornar productos **SOLO de ese tenant**

**Response (200):**
```json
{
  "products": [
    { "id": "1", "name": "Shampoo Premium", ... }
  ],
  "total": 15
}
```

**Response (401) - Sin tenant_id en JWT:**
```json
{
  "message": "Token inválido: falta claim tenant_id"
}
```

**Response (403) - Tenant inactivo:**
```json
{
  "message": "Tenant desactivado. Contacte al administrador."
}
```

---

### Ejemplo: POST `/api/sales`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "customerId": "123",
  "items": [
    { "productId": "456", "quantity": 2, "price": 500 }
  ],
  "total": 1000
}
```

Backend inserta en `odin_spa_001.sales` (si el JWT tiene `tenant_id=spa_001`).

**Response (201):**
```json
{
  "success": true,
  "saleId": "sale-uuid",
  "message": "Venta registrada"
}
```

---

## 🔒 Seguridad (CRÍTICO)

### ⛔ Reglas Obligatorias

1. **NUNCA aceptar `tenant_id` del body o query params**
   - ❌ `POST /api/products?tenantId=spa_001`
   - ✅ Solo del JWT firmado

2. **Validar tenant en cada request**
   - Si falta `tenant_id` claim → `401 Unauthorized`
   - Si tenant no existe → `403 Forbidden`
   - Si tenant `status != active` → `403 Forbidden`

3. **Connection strings seguros**
   - NUNCA enviar connection strings al frontend
   - Usar secretos/variables de entorno
   - Pooling configurado correctamente

4. **Middleware orden correcto**
   ```
   Authentication → TenantMiddleware → Authorization → Endpoint
   ```

5. **Rutas públicas excluidas**
   - `/api/auth/login`
   - `/health`
   - `/api/tenants/provision` (con auth master)

---

## 📁 Estructura de Archivos (Backend ASP.NET Core)

```
Backend/
├── Infrastructure/
│   ├── Tenancy/
│   │   ├── TenantInfo.cs
│   │   ├── TenantContext.cs (Scoped)
│   │   ├── ITenantResolver.cs
│   │   ├── TenantResolver.cs
│   │   └── TenantMiddleware.cs
│   │
│   └── Persistence/
│       ├── MasterDbContext.cs (odin_master)
│       └── TenantDbContext.cs (dinámico por tenant)
│
├── Features/
│   ├── Tenants/
│   │   ├── TenantsController.cs
│   │   ├── TenantProvisioningService.cs
│   │   └── TenantMigrationRunner.cs
│   │
│   ├── Auth/
│   │   └── AuthController.cs (emite JWT con tenant_id)
│   │
│   └── Products/
│       └── ProductsController.cs (usa TenantDbContext)
│
└── Program.cs
```

---

## 🎯 Checklist de Implementación

### Fase 1: Base Master
- [ ] Crear BD `odin_master`
- [ ] Tabla `tenants` con todos los campos
- [ ] `MasterDbContext` funcionando
- [ ] Seed de 2 tenants de prueba

### Fase 2: Autenticación
- [ ] Login emite JWT con claim `tenant_id`
- [ ] Endpoint `/api/auth/switch-tenant`
- [ ] Refresh token (opcional)

### Fase 3: Tenancy Infrastructure
- [ ] `TenantInfo.cs` + `TenantContext.cs`
- [ ] `ITenantResolver.cs` + `TenantResolver.cs`
- [ ] `TenantMiddleware.cs` registrado
- [ ] Excluir rutas públicas

### Fase 4: DbContext Dinámico
- [ ] `TenantDbContext` con factory
- [ ] Registrar en DI con connection string dinámico
- [ ] Probar con endpoint de productos

### Fase 5: Provisioning
- [ ] Endpoint `/api/tenants/provision`
- [ ] `TenantProvisioningService`
- [ ] CREATE DATABASE funcionando
- [ ] Migraciones aplicadas automáticamente

### Fase 6: Migration Runner
- [ ] `TenantMigrationRunner`
- [ ] Endpoint `/api/tenants/migrate-all`
- [ ] Logs de migraciones

---

## 🧪 Pruebas de Aislamiento

### Test 1: Aislamiento de Datos
```bash
# Login con spa_001
POST /api/auth/login
{ "username": "admin", "password": "admin123" }

# Crear producto
POST /api/products
{ "name": "Shampoo", "price": 500 }

# Login con rest_002
POST /api/auth/login
{ "username": "vendedor", "password": "vendedor123" }

# Listar productos (NO debe ver "Shampoo")
GET /api/products
# Response: { "products": [] }
```

### Test 2: Cambio de Tenant
```bash
# Usuario con múltiples tenants
POST /api/auth/login
{ "username": "master" }

# Cambiar a spa_001
POST /api/auth/switch-tenant
{ "tenantId": "spa_001" }

# Crear venta (va a odin_spa_001)
POST /api/sales
{ ... }

# Cambiar a rest_002
POST /api/auth/switch-tenant
{ "tenantId": "rest_002" }

# Listar ventas (NO debe ver las de spa_001)
GET /api/sales
```

### Test 3: Seguridad
```bash
# Intentar falsificar tenant_id
GET /api/products?tenantId=otro_tenant
# Response: 401 (el query param debe ser ignorado)

# Token sin tenant_id
GET /api/products
# Response: 401 "Token inválido: falta claim tenant_id"

# Tenant desactivado
GET /api/products
# Response: 403 "Tenant desactivado"
```

---

## 🚀 Variables de Entorno

```env
# appsettings.json o .env

# Master Database
MASTER_DB_HOST=localhost
MASTER_DB_PORT=5432
MASTER_DB_NAME=odin_master
MASTER_DB_USER=odin_master_user
MASTER_DB_PASSWORD=SecurePassword123!

# Tenant Databases (defaults para provisioning)
TENANT_DB_HOST=localhost
TENANT_DB_PORT=5432
TENANT_DB_USER=odin_tenant_user
TENANT_DB_PASSWORD=SecurePassword123!

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_ISSUER=odinpos-api
JWT_AUDIENCE=odinpos-frontend
JWT_EXPIRATION_HOURS=24

# Otros
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📞 Soporte

Para dudas sobre la implementación del backend:
- Ver ejemplos de código en `/Backend/Examples/`
- Documentación de arquitectura en `/ARCHITECTURE.md`
- Issues en el repositorio

---

**Última actualización:** 2025-02-26
**Versión API:** 1.0.0
