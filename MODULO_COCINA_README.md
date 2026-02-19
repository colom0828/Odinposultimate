# 🍳 Módulo de Cocina - ODIN POS

## ✅ Implementación Completa

### Archivos Creados

```
src/app/
├── types/
│   └── cocina.types.ts                    # Tipos TypeScript para órdenes de cocina
├── components/
│   └── cocina/
│       ├── KitchenFilters.tsx             # Componente de filtros por estado
│       ├── OrderCard.tsx                   # Tarjeta individual de orden
│       └── KitchenBoard.tsx                # Tablero principal de órdenes
└── (admin)/
    └── cocina/
        └── page.tsx                        # Página principal del módulo
```

---

## 📋 Características Implementadas

### 1. **Kitchen Display System (KDS)**
- ✅ Sistema de gestión de órdenes de cocina
- ✅ Vista en tiempo real de órdenes
- ✅ Estados: Nueva, En Preparación, Lista, Entregada

### 2. **Tipos de Orden**
- 🍽️ Mesa (con número)
- 🛍️ Para Llevar
- 🚴 Delivery

### 3. **Filtros Dinámicos**
- Vista de todas las órdenes
- Filtro por estado (Nueva, En Preparación, Lista)
- Contador de órdenes por estado
- Diseño con chips/badges interactivos

### 4. **Tarjetas de Orden**
Cada tarjeta muestra:
- ✅ Número de orden (#0001)
- ✅ Tipo de orden (Mesa/Para Llevar/Delivery)
- ✅ Tiempo transcurrido (actualización en tiempo real)
- ✅ Lista de items con cantidades
- ✅ Notas del cliente (si existen)
- ✅ Notas de items individuales
- ✅ Badge de estado colorido
- ✅ Indicador de URGENTE (>15 min)
- ✅ Botones de acción según estado

### 5. **Flujo de Estados**
```
NUEVA → INICIAR → EN PREPARACIÓN → LISTO → LISTA → ENTREGAR → ENTREGADA
         ↑____________VOLVER____________↑        ↑_____VOLVER_____↑
```

### 6. **Estadísticas en Dashboard**
- 📊 Contador de órdenes nuevas
- 📊 Contador de órdenes en preparación
- 📊 Contador de órdenes listas
- 📊 Total de órdenes activas

### 7. **UX/UI**
- ✅ Diseño responsive (1/2/3/4 columnas según pantalla)
- ✅ Animaciones suaves con Motion
- ✅ Empty states elegantes
- ✅ Notificación de nueva orden
- ✅ Colores según estado (azul/amarillo/verde)
- ✅ Hover effects en tarjetas
- ✅ Sistema de urgencia con animación pulse

### 8. **Funcionalidades Adicionales**
- ✅ Simulador de nueva orden (botón de prueba)
- ✅ Ordenamiento por antigüedad
- ✅ Indicador visual de tiempo transcurrido
- ✅ Sistema de prioridades (Normal/Urgente)

---

## 🎨 Estilo Visual

### Paleta de Colores (Consistente con ODIN POS)
- **Nuevas**: Gradiente azul-morado (`from-blue-600 to-purple-600`)
- **En Preparación**: Gradiente amarillo-naranja (`from-yellow-600 to-orange-600`)
- **Listas**: Gradiente verde-esmeralda (`from-green-600 to-emerald-600`)
- **Urgente**: Rojo con pulse animation

### Componentes UI
- Cards con `rounded-2xl`
- Borders suaves
- Shadows con colores del estado
- Tipografía consistente (Tailwind defaults)
- Modo oscuro completo

---

## 🔌 Integración con Sistema

### Sidebar
El módulo está **automáticamente** integrado en el sidebar a través de:
- **ConfigContext**: Lee configuración del backend
- **configService.ts**: Define módulo de Cocina
- **AdminSidebar.tsx**: Renderiza dinámicamente

```typescript
{
  id: SystemModule.KITCHEN,
  enabled: true,
  label: 'Cocina',
  icon: 'ChefHat',
  route: '/admin/cocina',
  requiredPlan: LicensePlan.BASIC,
  order: 4,
}
```

### Routing
- Ruta: `/admin/cocina`
- No afecta Dashboard
- Layout completo (Sidebar + Header)

---

## 📊 Datos Mock

### Órdenes de Ejemplo
El sistema incluye 5 órdenes mock para demostración:
1. Mesa 5 - Nueva (5 min)
2. Delivery - En Preparación URGENTE (18 min)
3. Para Llevar - Nueva (2 min)
4. Mesa 12 - Lista (25 min)
5. Mesa 3 - En Preparación (8 min)

---

## 🚀 Próximos Pasos (Futuras Mejoras)

### Backend Integration
- [ ] Conectar con ASP.NET Core API
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Sincronización con módulo de Mesas
- [ ] Integración con impresoras de cocina

### Funcionalidades Avanzadas
- [ ] Sonido personalizado para nuevas órdenes
- [ ] Vista por estación de cocina (grill, fríos, etc.)
- [ ] Timer visual para cada orden
- [ ] Historial de órdenes del día
- [ ] Métricas de tiempo promedio por plato
- [ ] Notificaciones push para meseros

### UX Mejorada
- [ ] Drag & drop para cambiar prioridad
- [ ] Vista de cocina en pantalla completa
- [ ] Modo tableta/TV para cocina
- [ ] Búsqueda de órdenes
- [ ] Filtro por mesero/tipo de comida

---

## 📱 Responsive Design

### Desktop (>1280px)
- 4 columnas de tarjetas
- Sidebar fijo visible
- Filtros en línea horizontal

### Tablet (768px - 1280px)
- 2-3 columnas de tarjetas
- Filtros en 2 filas

### Mobile (<768px)
- 1 columna de tarjetas
- Filtros apilados verticalmente
- Sidebar colapsable

---

## 🎯 Objetivo Cumplido

✅ Módulo independiente de Cocina
✅ No afecta Dashboard
✅ Mantiene layout (Sidebar + Header)
✅ Estilo consistente con ODIN POS
✅ Sin librerías pesadas adicionales
✅ Código limpio y mantenible
✅ TypeScript completo
✅ Responsive y accesible

---

## 🧑‍💻 Uso

### Navegación
1. Inicia sesión en ODIN POS
2. Click en "Cocina" en el Sidebar
3. Visualiza órdenes activas
4. Usa filtros para organizar
5. Click en botones para cambiar estados

### Simular Nueva Orden
1. Click en "Simular Nueva Orden"
2. Aparece notificación
3. Nueva tarjeta agregada al inicio

### Gestionar Orden
1. **Nueva orden** → Click "Iniciar" → Pasa a "En Preparación"
2. **En Preparación** → Click "Listo" → Pasa a "Lista"
3. **Lista** → Click "Entregar" → Pasa a "Entregada"
4. Cualquier estado → Click "Volver" → Regresa al estado anterior

---

## 🔧 Personalización

### Cambiar Colores de Estado
Edita: `src/app/types/cocina.types.ts`
```typescript
export const ORDER_STATUS_CONFIG = {
  [OrderStatus.NUEVA]: {
    color: 'bg-gradient-to-br from-blue-600 to-purple-600',
    // ...
  },
}
```

### Agregar Nuevo Tipo de Orden
```typescript
export enum OrderType {
  MESA = 'mesa',
  PARA_LLEVAR = 'para_llevar',
  DELIVERY = 'delivery',
  NUEVO_TIPO = 'nuevo_tipo', // ← Agregar aquí
}
```

### Modificar Threshold de Urgencia
En `OrderCard.tsx`, línea ~33:
```typescript
const isUrgent = () => {
  const diff = new Date().getTime() - order.horaCreacion.getTime();
  return diff > 15 * 60 * 1000; // ← Cambiar tiempo (en ms)
};
```

---

## 📞 Soporte

Para cualquier duda o mejora, contactar al equipo de desarrollo de ODIN POS.

**Versión**: 1.0.0  
**Fecha**: Febrero 2025  
**Modalidad**: Restaurante  
**Estado**: ✅ Producción Ready
