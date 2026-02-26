# Guía: Eliminar directivas 'use client' restantes

## 📋 Resumen

Durante la conversión de Next.js a Vite, quedaron **86 archivos** con la directiva `'use client'` que es incompatible con Vite y causa problemas de carga infinita en los módulos.

## ✅ Archivos ya corregidos (22/86)

### Core System
- ✅ `/src/app/(admin)/print-templates/page.tsx`
- ✅ `/src/app/(admin)/layout.tsx`
- ✅ `/src/app/page.tsx`
- ✅ `/src/app/components/RouteGuard.tsx`
- ✅ `/src/app/components/AdminSidebar.tsx`
- ✅ `/src/app/components/AdminHeader.tsx`
- ✅ `/src/app/components/PageTransition.tsx`
- ✅ `/src/app/components/LoadingScreen.tsx`
- ✅ `/src/app/components/BusinessModeSwitcher.tsx`
- ✅ `/src/app/components/DevPanel.tsx`
- ✅ `/src/app/contexts/ThemeContext.tsx`

### Admin Pages
- ✅ `/src/app/(admin)/dashboard/page.tsx`
- ✅ `/src/app/(admin)/productos/page.tsx`
- ✅ `/src/app/(admin)/ventas/page.tsx`
- ✅ `/src/app/(admin)/reportes/page.tsx`
- ✅ `/src/app/(admin)/empleados/page.tsx`
- ✅ `/src/app/(admin)/configuracion/page.tsx`

### Components
- ✅ `/src/app/components/reportes/ReportesHome.tsx`
- ✅ `/src/app/components/reportes/ReportCard.tsx`
- ✅ `/src/app/components/reportes/ReportDetail.tsx`
- ✅ `/src/app/components/dashboard/RealTimeOperations.tsx`
- ✅ `/src/app/components/dashboard/DailyPerformance.tsx`
- ✅ `/src/app/components/dashboard/OperationalAlerts.tsx`
- ✅ `/src/app/components/dashboard/StaffStatus.tsx`

## ⏳ Archivos pendientes (64 restantes)

### Páginas Admin (11)
- `/src/app/(admin)/clientes/page.tsx`
- `/src/app/(admin)/usuarios/page.tsx`
- `/src/app/(admin)/inventario/page.tsx`
- `/src/app/(admin)/proveedores/page.tsx`
- `/src/app/(admin)/ordenes/page.tsx`
- `/src/app/(admin)/impresoras/page.tsx`
- `/src/app/(admin)/caja/page.tsx`
- `/src/app/(admin)/mesa/plano/page.tsx`
- `/src/app/(admin)/mesa/page.tsx`
- `/src/app/(admin)/delivery/page.tsx`
- `/src/app/(admin)/citas/page.tsx`
- `/src/app/(admin)/servicios/page.tsx`
- `/src/app/(admin)/ordenes-servicio/page.tsx`

### Componentes Mesa (6)
- `/src/app/components/mesa/MesaItem.tsx`
- `/src/app/components/mesa/MesaToolbar.tsx`
- `/src/app/components/mesa/MesaSidebar.tsx`
- `/src/app/components/mesa/MesaProperties.tsx`
- `/src/app/components/mesa/MesaCanvas.tsx`
- `/src/app/components/mesa/AreaDialog.tsx`

### Componentes Cocina (9)
- `/src/app/components/cocina/KitchenFilters.tsx`
- `/src/app/components/cocina/OrderCard.tsx`
- `/src/app/components/cocina/KitchenBoard.tsx`
- `/src/app/components/cocina/DeliveredOrdersPanel.tsx`
- `/src/app/components/cocina/KitchenOrderCard.tsx`
- `/src/app/components/cocina/KitchenBoardUnified.tsx`
- `/src/app/components/cocina/DeliveredOrdersPanelUnified.tsx`
- `/src/app/components/cocina/KitchenListSection.tsx`
- `/src/app/components/cocina/ChannelBadge.tsx`
- `/src/app/components/cocina/OrderDetailDrawer.tsx`

### Componentes Delivery (7)
- `/src/app/components/delivery/DeliveryFilters.tsx`
- `/src/app/components/delivery/AssignCourierModal.tsx`
- `/src/app/components/delivery/DeliveryOrderCard.tsx`
- `/src/app/components/delivery/DeliveryBoard.tsx`
- `/src/app/components/delivery/DeliveryOrderCardUnified.tsx`
- `/src/app/components/delivery/DeliveryBoardUnified.tsx`
- `/src/app/components/delivery/AssignCourierModalSimple.tsx`

### Componentes Ventas (2)
- `/src/app/components/ventas/SaleDetailModal.tsx`
- `/src/app/components/ventas/PaymentMethodsChart.tsx`

### Componentes Dashboard Spa (5)
- `/src/app/components/dashboard/spa/SpaRealTimeMetrics.tsx`
- `/src/app/components/dashboard/spa/DailySchedule.tsx`
- `/src/app/components/dashboard/spa/TopServices.tsx`
- `/src/app/components/dashboard/spa/SpaOperationalAlerts.tsx`
- `/src/app/components/dashboard/spa/SpaStaffStatus.tsx`

### Componentes Reportes (3)
- `/src/app/components/reportes/ReportFilters.tsx`
- `/src/app/components/reportes/ReportExportButtons.tsx`
- `/src/app/components/reportes/ReportChart.tsx`

### Componentes Service Orders (6)
- `/src/app/components/serviceOrders/ServiceOrderCard.tsx`
- `/src/app/components/serviceOrders/ServiceOrderKanban.tsx`
- `/src/app/components/serviceOrders/ServiceOrderDetailDrawer.tsx`
- `/src/app/components/serviceOrders/NewServiceOrderModal.tsx`
- `/src/app/components/serviceOrders/AssignTechnicianModal.tsx`
- `/src/app/components/serviceOrders/EditServiceOrderModal.tsx`

### Componentes Services (1)
- `/src/app/components/services/ServiceFormModal.tsx`

### Componentes Citas (2)
- `/src/app/components/citas/AppointmentFormModal.tsx`
- `/src/app/components/citas/AppointmentDetailsModal.tsx`

### Componentes Dashboard (2)
- `/src/app/components/dashboard/AlertDetailModal.tsx`
- `/src/app/components/dashboard/AllAlertsModal.tsx`

### Componentes Modales (10)
- `/src/app/components/ThemePreviewCard.tsx`
- `/src/app/components/NewSaleModal.tsx`
- `/src/app/components/OpenCashRegisterModal.tsx`
- `/src/app/components/CloseCashRegisterModal.tsx`
- `/src/app/components/CashTransactionModal.tsx`
- `/src/app/components/CashMovementDetailsModal.tsx`
- `/src/app/components/CashRegisterLogDetailsModal.tsx`

## 🔧 Cómo eliminar las directivas

### Opción 1: Manualmente (Recomendado para archivos específicos)

Para cada archivo, simplemente eliminar la línea:
```tsx
'use client';
```

### Opción 2: Script automatizado (Recomendado para todos a la vez)

Crear un script en la raíz del proyecto llamado `remove-use-client.sh`:

```bash
#!/bin/bash

# Archivos a procesar
files=(
  "src/app/(admin)/clientes/page.tsx"
  "src/app/(admin)/usuarios/page.tsx"
  "src/app/(admin)/inventario/page.tsx"
  # ... agregar todos los archivos pendientes
)

# Eliminar 'use client'; de cada archivo
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    sed -i "1{/^'use client';$/d;}" "$file"
    echo "✓ $file"
  else
    echo "✗ $file (no encontrado)"
  fi
done

echo "¡Completado!"
```

Ejecutar con:
```bash
chmod +x remove-use-client.sh
./remove-use-client.sh
```

### Opción 3: Find & Replace en VS Code

1. Abrir VS Code
2. Presionar `Ctrl+Shift+H` (o `Cmd+Shift+H` en Mac)
3. En "Find": `'use client';\n\n`
4. En "Replace": (dejar vacío)
5. En "files to include": `src/**/*.tsx`
6. Click "Replace All"

## 🎯 Prioridad de corrección

### Alta Prioridad (Afectan funcionalidad core):
1. Todas las páginas admin (`/src/app/(admin)/*.tsx`)
2. Componentes de modales y formularios
3. Componentes de cocina y delivery (para restaurantes)

### Media Prioridad:
1. Componentes de reportes
2. Componentes de dashboard
3. Componentes de mesa

### Baja Prioridad:
1. Componentes específicos de Spa
2. Componentes de service orders

## ⚠️ Nota Importante

Después de eliminar todas las directivas 'use client':
1. Reiniciar el servidor de desarrollo (`npm run dev`)
2. Limpiar la caché del navegador
3. Verificar que todos los módulos carguen correctamente

## 📝 Verificación

Para verificar que no queden directivas 'use client', ejecutar:

```bash
grep -r "'use client'" src/app --include="*.tsx"
```

Si no devuelve resultados, la limpieza está completa.
