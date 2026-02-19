# 📝 ACTUALIZACIÓN DE TERMINOLOGÍA - SPA/SALÓN

## ✅ CAMBIOS REALIZADOS

### **ANTES:**
❌ "Técnicos Activos"
❌ "Todos los técnicos"
❌ "Técnico sobrecargado"
❌ "Técnico" (en detalles de cita)

### **DESPUÉS:**
✅ "Personal Activo"
✅ "Todo el personal"
✅ "Personal sobrecargado"
✅ "Estilista / Especialista" (en detalles de cita)

---

## 📦 ARCHIVOS MODIFICADOS (5)

### 1. `/src/app/components/dashboard/spa/SpaRealTimeMetrics.tsx`
```typescript
// Card actualizada
{
  id: 'active_staff',
  label: 'Personal Activo',  // ✅ Cambio
  value: metrics.activeStaff,
  icon: LucideIcons.Users,
  color: 'green',
}
```

### 2. `/src/app/components/dashboard/spa/DailySchedule.tsx`
```typescript
// Comentario actualizado
{/* Estilista/Especialista */}  // ✅ Cambio
<div className="hidden lg:flex items-center space-x-2 min-w-[180px]">
  ...
  <p className="text-sm font-medium">{apt.technicianName}</p>
</div>
```

### 3. `/src/app/components/dashboard/spa/SpaOperationalAlerts.tsx`
```typescript
// Alerta actualizada (sin cambios de código, solo datos)
// La alerta "OVERBOOKED_TECHNICIAN" ahora dice "Personal sobrecargado"
```

### 4. `/src/app/(admin)/citas/page.tsx`
```typescript
// Filtro actualizado
<label>Estilista / Especialista</label>  // ✅ Cambio
<select>
  <option value="">Todo el personal</option>  // ✅ Cambio
  {technicians.map(...)}
</select>

// Modal de detalles actualizado
<p className="text-sm text-muted-foreground mb-1">
  Estilista / Especialista  // ✅ Cambio
</p>
<p>{selectedAppointment.technicianName}</p>
```

### 5. `/src/app/data/mockSpaMetrics.ts`
```typescript
// Alerta actualizada
{
  id: 'alert-spa-3',
  type: 'OVERBOOKED_TECHNICIAN',
  severity: 'high',
  title: 'Personal sobrecargado',  // ✅ Cambio
  description: 'Valentina Cruz tiene 7 citas consecutivas sin descanso.',
  ...
}
```

---

## 🎯 ROLES ESPECÍFICOS USADOS

En el sistema de Spa/Salón, el personal tiene roles específicos:

### **Roles de Personal:**
- ✅ **Estilista Senior** - Especialista en cabello
- ✅ **Manicurista** - Especialista en uñas
- ✅ **Masajista** - Especialista en masajes
- ✅ **Cosmetóloga** - Especialista en facial/maquillaje
- ✅ **Barbero** - Especialista en cortes masculinos
- ✅ **Pedicurista** - Especialista en pedicure
- ✅ **Recepcionista** - Atención al cliente

### **En el Código:**
```typescript
// Filtro de empleados
const technicians = getEmployeesByBusinessType(BusinessType.SPA).filter(e => 
  e.role === 'estilista' || 
  e.role === 'manicurista' || 
  e.role === 'masajista' || 
  e.role === 'cosmetologo'
);
```

---

## 💡 TERMINOLOGÍA CORRECTA

### **EN LA UI:**
| Contexto | Término Correcto |
|----------|------------------|
| Card de métrica | **Personal Activo** |
| Filtro dropdown | **Estilista / Especialista** |
| Opción "Todos" | **Todo el personal** |
| Detalles de cita | **Estilista / Especialista** |
| Alertas | **Personal sobrecargado** |

### **EN COMENTARIOS DE CÓDIGO:**
```typescript
// ✅ CORRECTO
{/* Estilista/Especialista */}
{/* Personal */}

// ❌ EVITAR
{/* Técnico */}
```

---

## 📊 IMPACTO VISUAL

### **Dashboard:**
```
┌─────────────────────────────────────┐
│ [24 Citas] [6 En Curso] [8 Próx]   │
│ [2 Cancel] [8 Personal] [78% Ocup] │ ← "Personal Activo"
└─────────────────────────────────────┘
```

### **Filtro de Citas:**
```
┌──────────────────────────────────────┐
│ Estilista / Especialista      [▼]   │ ← Label actualizado
│ ├─ Todo el personal                 │ ← Opción actualizada
│ ├─ Daniela Rojas (Estilista)        │
│ ├─ Valentina Cruz (Manicurista)     │
│ └─ Andrea Morales (Masajista)       │
└──────────────────────────────────────┘
```

### **Alertas:**
```
⚠️ Personal sobrecargado              ← Título actualizado
   Valentina Cruz tiene 7 citas...
```

---

## 🔍 VERIFICACIÓN

Para confirmar que los cambios están activos:

1. **Dashboard Spa:**
   - Busca la card que dice "Personal Activo" (no "Técnicos Activos")

2. **Módulo Citas:**
   - El filtro debe decir "Estilista / Especialista"
   - La opción debe decir "Todo el personal"

3. **Detalles de Cita:**
   - Al ver una cita, debe decir "Estilista / Especialista"

4. **Alertas:**
   - Las alertas deben decir "Personal sobrecargado"

---

## ✅ CONSISTENCIA

**Regla General:**
- En Spa/Salón, NO usar "técnico" genéricamente
- Usar roles específicos cuando sea posible (Estilista, Manicurista, etc.)
- Cuando sea genérico, usar "Personal" o "Estilista / Especialista"

---

**Actualizado:** Febrero 2026
**Versión:** 1.1
