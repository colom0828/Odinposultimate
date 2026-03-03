# 🎁 Módulo de Giftcards / Tarjetas de Regalo - ODIN POS

## 📋 Implementación Completa

✅ **ESTADO:** Módulo 100% funcional e integrado en ODIN POS

---

## 🎯 **Objetivo**

Sistema completo de Giftcards que permite emitir, vender, recargar, redimir y auditar tarjetas de regalo (digital y física), con integración directa al flujo de ventas/caja.

---

## 📂 **Archivos Creados**

### **1. Tipos TypeScript**
- `/src/app/types/giftcard.types.ts` - Tipos completos del módulo

### **2. Servicio Mock**
- `/src/app/services/giftcard.service.ts` - Servicio con LocalStorage

### **3. Página Principal**
- `/src/app/(admin)/giftcards/page.tsx` - Listado + KPIs

### **4. Componentes Modales**
- `/src/app/components/giftcards/GiftcardCreateModal.tsx` - Crear giftcard
- `/src/app/components/giftcards/GiftcardRedeemModal.tsx` - Redimir
- `/src/app/components/giftcards/GiftcardRechargeModal.tsx` - Recargar
- `/src/app/components/giftcards/GiftcardVoidModal.tsx` - Anular
- `/src/app/components/giftcards/GiftcardDetailModal.tsx` - Detalle + Historial

---

## 📂 **Archivos Modificados**

### **1. Tipos del Sistema**
- `/src/app/types/config.types.ts`
  - Agregado `GIFTCARDS` al enum `SystemModule`

### **2. Configuración de Módulos**
- `/src/app/services/configService.ts`
  - Agregado módulo de Giftcards en:
    - `getRestaurantModules()` → "Giftcards"
    - `getSpaModules()` → "Tarjetas de Regalo"
    - `getHardwareModules()` → "Giftcard / Crédito"
    - `getRetailModules()` → "Giftcards"
    - `getTechServiceModules()` → "Giftcards"

### **3. Rutas de la Aplicación**
- `/src/app/App.tsx`
  - Importado `GiftcardsPage`
  - Agregado case `/admin/giftcards`

---

## 🎨 **Integración en Sidebar**

El módulo aparece automáticamente en **TODOS** los tipos de negocio con labels dinámicos:

| Tipo de Negocio | Label en Sidebar |
|------------------|------------------|
| Restaurant / Bar / Café | **Giftcards** |
| Spa / Salón / Uñas | **Tarjetas de Regalo** |
| Ferretería / Retail / Mayorista | **Giftcard / Crédito** |
| Servicio Técnico | **Giftcards** |

**Icono:** `Gift` (de lucide-react)  
**Ruta:** `/admin/giftcards`  
**Orden:** Después de "Caja registradora"

---

## 💾 **Persistencia de Datos**

El módulo utiliza **LocalStorage** con las siguientes claves:

- `odin-giftcards` → Lista de todas las giftcards
- `odin-giftcard-movements` → Historial de movimientos

**Estructura API-Ready:** Todos los servicios están listos para conectarse a un backend ASP.NET Core.

---

## 📊 **KPIs Principales**

1. **Saldo Total Pendiente** (Liability)
2. **Giftcards Vendidas (Mes)**
3. **Redenciones (Mes)** (monto)
4. **Recargas (Mes)** (monto)

---

## 🔢 **Estados de Giftcard**

| Estado | Descripción |
|--------|-------------|
| `ACTIVE` | Activa con saldo disponible |
| `DEPLETED` | Saldo agotado (balance = 0) |
| `EXPIRED` | Fecha de expiración superada |
| `VOIDED` | Anulada (irreversible) |

---

## 🎫 **Tipos de Giftcard**

- **DIGITAL** → Se envía por Email/WhatsApp
- **PHYSICAL** → Tarjeta impresa

---

## 📝 **Funcionalidades Implementadas**

### **1. Crear Giftcard** ✅
- Monto inicial
- Tipo (Digital/Física)
- Beneficiario (nombre, teléfono, email)
- Mensaje personalizado
- Fecha de expiración (opcional)
- Vender ahora o solo registrar

### **2. Redimir Giftcard** ✅
- Escanear/ingresar código
- Validar saldo y estado
- Redención parcial permitida
- Botones de monto rápido (25%, 50%, Todo)
- Mensajes de error claros

### **3. Recargar Giftcard** ✅
- Dos modos:
  - **Venta en caja** → Genera transacción
  - **Ajuste administrativo** → Requiere razón

### **4. Anular Giftcard** ✅
- Advertencia de acción irreversible
- Requiere razón obligatoria
- Pérdida de saldo pendiente

### **5. Ver Detalle + Historial** ✅
- Tarjeta visual con saldo
- Información completa
- Historial de movimientos con:
  - Tipo (Venta/Redención/Recarga/Anulación/Ajuste)
  - Monto (+/-)
  - Saldo antes/después
  - Fecha y hora
  - Usuario que realizó la acción
  - Referencias (ticket/orden)

### **6. Filtros y Búsqueda** ✅
- Búsqueda por:
  - Código
  - Nombre del cliente
  - Teléfono
- Filtros por:
  - Estado
  - Tipo (Digital/Física)
  - Rango de fechas

---

## 🏢 **Variaciones por Tipo de Negocio**

### **Restaurant / Bar**
- Label: "Giftcards"
- Copy enfocado a consumo en local y pedidos
- **Futura integración:** Aplicar a Mesa/Orden rápida/Delivery

### **Spa / Salón**
- Label: "Tarjetas de Regalo"
- Copy enfocado a regalar experiencias/servicios
- **Futura integración:** Monto libre o Paquete de servicios

### **Ferretería / Retail**
- Label: "Giftcard / Crédito"
- Copy enfocado a crédito para compras de productos
- **Futura integración:** Devolución a Giftcard (refund como crédito)

---

## 🔐 **Validaciones y Reglas**

✅ Código único generado automáticamente (ej: `GC2024ABC123`)  
✅ No permitir redimir si estado != ACTIVE  
✅ Si balance - amount <= 0 → status pasa a DEPLETED  
✅ Si expiresAt < hoy → status EXPIRED  
✅ VOID → status VOIDED (no se puede redimir/recargar)  
✅ Redención parcial permitida  
✅ Auditoría completa (usuario, fecha, referencia)

---

## 🧪 **Cómo Probar**

### **1. Acceder al módulo**
```
/admin/giftcards
```

### **2. Datos Mock Iniciales**

El módulo genera 3 giftcards de ejemplo automáticamente:

| Código | Beneficiario | Tipo | Estado | Saldo |
|--------|--------------|------|--------|-------|
| GC2024ABC123 | María González | Digital | ACTIVE | $3,500 |
| GC2024XYZ789 | Juan Pérez | Física | ACTIVE | $10,000 |
| GC2024DEF456 | Ana Martínez | Digital | DEPLETED | $0 |

### **3. Flujo de Prueba Completo**

```bash
# 1. Ver listado con KPIs
/admin/giftcards

# 2. Crear nueva giftcard
- Click en "Crear Giftcard"
- Llenar: Monto $5000, Digital, Beneficiario "Pedro López"
- Guardar

# 3. Redimir giftcard
- Click en botón de redención (icono verde)
- Ingresar monto $2000
- Confirmar
- ✅ Saldo actualizado

# 4. Ver detalle e historial
- Click en "Ver detalle" (icono de ojo)
- Ver movimientos completos
- Ver tarjeta visual

# 5. Recargar giftcard
- Click en botón de recarga (icono naranja)
- Agregar $1000
- Seleccionar modo (Venta/Ajuste)
- Confirmar

# 6. Anular giftcard
- Click en botón de anulación (icono rojo)
- Ingresar razón
- Confirmar
- ✅ Estado cambia a VOIDED

# 7. Probar filtros
- Buscar por código
- Filtrar por estado (Activa/Agotada/Expirada/Anulada)
- Filtrar por tipo (Digital/Física)
```

---

## 🎨 **UI/UX Highlights**

- ✅ **Diseño consistente** con el resto de ODIN POS
- ✅ **Tarjeta visual** con gradiente purple-to-pink
- ✅ **Badges de estado** con colores semánticos
- ✅ **Modales modernos** con backdrop blur
- ✅ **Animaciones suaves** en hover y transiciones
- ✅ **Responsive** (desktop-first)
- ✅ **Dark mode** completo
- ✅ **Iconografía** de lucide-react
- ✅ **Notificaciones** con sonner

---

## 📱 **Componentes Reutilizables**

Todos los componentes siguen el patrón del proyecto:

- `<Button>` → Botones consistentes
- `<Input>` → Campos de texto
- `<Label>` → Etiquetas
- `<Select>` → Selectores
- `<Switch>` → Toggles
- `<Textarea>` → Campos multilínea
- `toast` → Notificaciones

---

## 🚀 **Próximos Pasos (Backend ASP.NET Core)**

Cuando se implemente el backend, actualizar:

### **1. Endpoints necesarios**

```csharp
// Controllers/GiftcardController.cs

[HttpGet]
public async Task<ActionResult<List<Giftcard>>> GetGiftcards([FromQuery] GiftcardFilters filters)

[HttpGet("{id}")]
public async Task<ActionResult<Giftcard>> GetGiftcard(string id)

[HttpPost]
public async Task<ActionResult<Giftcard>> CreateGiftcard([FromBody] CreateGiftcardDto dto)

[HttpPost("redeem")]
public async Task<ActionResult<RedeemResult>> RedeemGiftcard([FromBody] RedeemGiftcardDto dto)

[HttpPost("recharge")]
public async Task<ActionResult<RechargeResult>> RechargeGiftcard([FromBody] RechargeGiftcardDto dto)

[HttpPost("void")]
public async Task<ActionResult> VoidGiftcard([FromBody] VoidGiftcardDto dto)

[HttpGet("{id}/movements")]
public async Task<ActionResult<List<GiftcardMovement>>> GetMovements(string id)

[HttpGet("kpis")]
public async Task<ActionResult<GiftcardKPIs>> GetKPIs()
```

### **2. Base de Datos**

```sql
-- Tabla principal
CREATE TABLE Giftcards (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    BeneficiaryName NVARCHAR(200) NOT NULL,
    BeneficiaryPhone NVARCHAR(20),
    BeneficiaryEmail NVARCHAR(200),
    Type NVARCHAR(20) NOT NULL, -- DIGITAL | PHYSICAL
    Status NVARCHAR(20) NOT NULL, -- ACTIVE | DEPLETED | EXPIRED | VOIDED
    InitialAmount DECIMAL(18,2) NOT NULL,
    Balance DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL,
    ExpiresAt DATETIME2,
    Message NVARCHAR(500),
    PackageId UNIQUEIDENTIFIER,
    PackageName NVARCHAR(200),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy NVARCHAR(200) NOT NULL,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Giftcards_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
);

-- Tabla de movimientos
CREATE TABLE GiftcardMovements (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    GiftcardId UNIQUEIDENTIFIER NOT NULL,
    Type NVARCHAR(20) NOT NULL, -- SALE | REDEEM | RECHARGE | VOID | ADJUST
    Amount DECIMAL(18,2) NOT NULL,
    BalanceBefore DECIMAL(18,2) NOT NULL,
    BalanceAfter DECIMAL(18,2) NOT NULL,
    Reference NVARCHAR(100),
    ReferenceType NVARCHAR(50),
    Reason NVARCHAR(500),
    Notes NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy NVARCHAR(200) NOT NULL,
    CONSTRAINT FK_GiftcardMovements_Giftcards FOREIGN KEY (GiftcardId) REFERENCES Giftcards(Id)
);

-- Índices
CREATE INDEX IX_Giftcards_TenantId ON Giftcards(TenantId);
CREATE INDEX IX_Giftcards_Code ON Giftcards(Code);
CREATE INDEX IX_Giftcards_Status ON Giftcards(Status);
CREATE INDEX IX_GiftcardMovements_GiftcardId ON GiftcardMovements(GiftcardId);
```

### **3. Actualizar frontend**

Reemplazar los servicios mock en `/src/app/services/giftcard.service.ts` con llamadas reales a la API:

```typescript
export async function listGiftcards(filters?: GiftcardFilters): Promise<Giftcard[]> {
  const response = await fetch('/api/giftcards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': getTenantId(),
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(filters),
  });
  
  return await response.json();
}
```

---

## ✅ **Checklist de Implementación**

- [x] Tipos TypeScript completos
- [x] Servicio mock con LocalStorage
- [x] Página principal con listado y KPIs
- [x] Modal de creación
- [x] Modal de redención
- [x] Modal de recarga
- [x] Modal de anulación
- [x] Modal de detalle con historial
- [x] Integración en Sidebar dinámico
- [x] Labels por tipo de negocio
- [x] Ruta registrada en App.tsx
- [x] Validaciones completas
- [x] Filtros y búsqueda
- [x] Estados y badges
- [x] Notificaciones con toast
- [x] Mock data inicial
- [x] Documentación completa

---

## 🎉 **Resultado Final**

El módulo de Giftcards está **100% funcional** y listo para usar. Aparece automáticamente en el sidebar de todos los tipos de negocio con labels contextuales, y toda la funcionalidad está implementada con mock data que se puede reemplazar fácilmente con llamadas reales al backend.

**Ruta de acceso:** `/admin/giftcards`

---

## 📞 **Soporte**

Para más información o dudas sobre la implementación, revisar:

- Tipos: `/src/app/types/giftcard.types.ts`
- Servicio: `/src/app/services/giftcard.service.ts`
- Página: `/src/app/(admin)/giftcards/page.tsx`
- Componentes: `/src/app/components/giftcards/`

---

**¡El módulo de Giftcards está listo para revolucionar ODIN POS! 🎁🚀**
