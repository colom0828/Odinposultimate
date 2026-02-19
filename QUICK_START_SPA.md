# 🚀 GUÍA RÁPIDA - ACTIVAR MODO SPA

## ✅ TODO ESTÁ IMPLEMENTADO

La arquitectura multi-vertical para Spa/Salón ya está **100% implementada y funcional**. Solo necesitas **activar el modo Spa**.

---

## 🎯 CÓMO ACTIVAR MODO SPA

### **Método 1: Business Mode Switcher (RECOMENDADO)**

1. **Inicia sesión** en ODIN POS
2. Verás un **botón flotante morado en la esquina inferior derecha** 
3. **Haz clic** en el botón flotante
4. Se abrirá un **panel lateral** con todos los tipos de negocio
5. **Selecciona "Spa / Salón"**
6. La página se recargará automáticamente
7. **¡Listo!** Ahora verás el dashboard y módulos de Spa

### **Método 2: Cambiar Mock Config (Para desarrollo)**

Si prefieres que arranque directo en modo Spa:

1. Abre `/src/app/services/configService.ts`
2. Busca la línea:
   ```typescript
   businessType: BusinessType.RESTAURANT,
   ```
3. Cámbiala a:
   ```typescript
   businessType: BusinessType.SPA,
   ```
4. Guarda el archivo
5. La aplicación se recargará en modo Spa

---

## 🧖 QUÉ VERÁS EN MODO SPA

### **Dashboard Spa:**
✅ **6 Cards de Métricas:**
- Citas de Hoy
- En Curso
- Próximas 2 Horas
- Canceladas Hoy
- Personal Activo
- Ocupación Agenda (%)

✅ **4 Secciones:**
1. **Agenda del Día**: Lista de próximas citas
2. **Servicios Más Solicitados**: Top 5 por cantidad
3. **Alertas Operativas**: Citas retrasadas, huecos, técnicos sobrecargados
4. **Estado del Personal**: Técnicos con disponibilidad y eficiencia

### **Módulo Citas (/admin/citas):**
✅ Vista lista funcional
✅ 5 KPIs (Total, Confirmadas, En Curso, Completadas, Canceladas)
✅ Filtros por fecha, técnico, estado
✅ 6 Estados de cita
✅ Cambio de estado inline
✅ Modal de detalles
✅ 13 citas mock del día actual
✅ Persistencia en localStorage

### **Módulo Servicios (/admin/servicios):**
✅ Grid de servicios por categoría
✅ 20+ servicios organizados
✅ Filtros por búsqueda y categoría
✅ **Precios OCULTOS para rol Supervisor**
✅ Toggle activo/inactivo
✅ Modal de detalles
✅ Persistencia en localStorage

### **Sidebar Dinámico:**
Verás solo los módulos relevantes para Spa:
- ✅ Dashboard
- ✅ Citas / Agenda
- ✅ Servicios
- ✅ Clientes
- ✅ Inventario (productos de belleza)
- ✅ Empleados (técnicos)
- ✅ Reportes
- ✅ Configuración

**NO verás:**
- ❌ Mesas
- ❌ Cocina
- ❌ Delivery

---

## 🔄 CÓMO VOLVER A RESTAURANT

1. Haz clic en el **botón flotante**
2. Selecciona **"Restaurante"**
3. La página se recargará
4. Volverás al dashboard de Restaurant

---

## 🎨 BUSINESS MODE SWITCHER

El botón flotante te permite cambiar entre **7 tipos de negocio**:

1. **Restaurante** 🍽️ - Mesas, cocina, delivery
2. **Spa / Salón** 💅 - Citas, servicios, técnicos
3. **Ferretería** 🔧 - Retail, inventario
4. **Retail** 🛍️ - Venta minorista
5. **Café** ☕ - Cafetería
6. **Bar** 🍷 - Bar / Bebidas
7. **Servicio Técnico** 💻 - Reparaciones

---

## 📊 DATOS MOCK INCLUIDOS

### **Citas:**
- 13 citas del día con diferentes estados
- 6 técnicos asignados
- Horarios desde 10:30 hasta 16:00
- Estados: Programada, Confirmada, En Curso, Completada, Cancelada, No se presentó

### **Servicios:**
- 20+ servicios organizados en categorías:
  - Cabello (5 servicios)
  - Uñas (5 servicios)
  - Masajes (3 servicios)
  - Facial (3 servicios)
  - Depilación (2 servicios)
  - Maquillaje (2 servicios)

### **Personal:**
- 6 técnicos con especialidades
- Eficiencia del 88% al 100%
- Estados: Disponible, Ocupado, Descanso

---

## 🚦 VERIFICACIÓN RÁPIDA

Para confirmar que estás en modo Spa:

1. **Dashboard**: Debes ver "Citas de Hoy" en lugar de "Órdenes Activas"
2. **Sidebar**: Debes ver "Citas / Agenda" en lugar de "Mesas"
3. **Header**: El badge de modo debe decir "Spa / Salón"
4. **Métricas**: Sin menciones de cocina, delivery o mesas

---

## 🔐 CONTROL DE VISIBILIDAD

### **Rol Supervisor:**
✅ **VE:**
- Conteos (citas, técnicos)
- Estados (confirmada, en curso)
- Tiempos (duración, ocupación)
- Métricas operativas

❌ **NO VE:**
- Precios de servicios
- Costos
- Montos financieros

### **Rol Admin/Cashier:**
✅ **VE TODO** (incluyendo precios)

---

## 🛠️ FUNCIONALIDADES LISTAS

### **Citas:**
- [x] Listar por fecha
- [x] Filtrar por técnico
- [x] Filtrar por estado
- [x] Cambiar estado (Confirmar → Iniciar → Completar)
- [x] Ver detalles
- [x] Validación de solapamientos (en service)
- [x] Persistencia localStorage

### **Servicios:**
- [x] Listar por categoría
- [x] Buscar por nombre
- [x] Activar/Desactivar
- [x] Ver detalles
- [x] Ocultar precios para supervisor
- [x] Persistencia localStorage

### **Dashboard:**
- [x] Métricas en tiempo real
- [x] Separación total por vertical
- [x] Refresh cada 30s
- [x] Type-safe

---

## 📱 RESPONSIVE

Toda la UI es responsive:
- Mobile: Vista compacta
- Tablet: Vista intermedia
- Desktop: Vista completa

---

## 🔌 PREPARADO PARA API

Todos los servicios tienen funciones async listas:

```typescript
// Dashboard
fetchDashboardData(businessType, role)

// Citas
AppointmentsService.list({ date, technicianId })
AppointmentsService.create(data)
AppointmentsService.update(data)

// Servicios
ServicesService.list({ category, isActive })
ServicesService.create(data)
ServicesService.update(data)
```

Solo necesitas:
1. Crear endpoints en tu backend
2. Descomentar las llamadas fetch
3. Remover los datos mock

---

## 🎉 DISFRUTA!

**Todo está listo.** Solo activa el modo Spa usando el botón flotante y explora:

1. 🏠 **Dashboard Spa** → `/admin/dashboard`
2. 📅 **Citas** → `/admin/citas`
3. ✨ **Servicios** → `/admin/servicios`
4. 👥 **Empleados** (Técnicos) → `/admin/empleados`
5. 📊 **Reportes** → `/admin/reportes`

---

**¿Preguntas?** Revisa `/SPA_ARCHITECTURE.md` para documentación completa.

**Desarrollado con ❤️ para ODIN POS**