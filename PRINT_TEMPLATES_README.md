# 📋 EDITOR DE PLANTILLAS DE IMPRESIÓN - ODIN POS

## ✅ IMPLEMENTACIÓN COMPLETA

Sistema completo de gestión y edición de plantillas de impresión para facturas, tickets y comandas.

---

## 📦 1. ESTRUCTURA DEL PROYECTO

```
/src/app/
├── types/
│   └── print-templates.types.ts       # Tipos TypeScript completos
├── services/
│   └── print-templates.service.ts     # API Service (simula backend)
├── utils/
│   └── print-mock-data.ts             # Datos mock para testing
├── database/
│   └── print-templates-schema.sql     # Schema PostgreSQL
├── (admin)/
│   └── print-templates/
│       └── page.tsx                   # Página principal del editor
└── components/
    └── print-templates/
        ├── TemplateEditor.tsx         # Editor con Drag & Drop
        ├── SortableBlockItem.tsx      # Item arrastrable
        ├── BlockConfigPanel.tsx       # Panel de configuración
        └── TemplatePreview.tsx        # Preview en tiempo real
```

---

## 🗄️ 2. DISEÑO DE BASE DE DATOS

### Tablas Principales

#### `print_templates`
```sql
- id (UUID)
- name (VARCHAR 200)
- description (TEXT)
- type (VARCHAR 50) - ticket, invoice, kitchen_order, etc.
- paper_width (INTEGER) - 58mm, 80mm, 110mm
- paper_type (VARCHAR 20) - thermal, a4, letter
- blocks (JSONB) - Array de bloques configurados
- is_default (BOOLEAN)
- is_active (BOOLEAN)
- created_at, updated_at
```

#### `client_template_overrides`
```sql
- id (UUID)
- client_id (UUID FK)
- template_id (UUID FK)
- overrides (JSONB) - Solo diferencias
- is_active (BOOLEAN)
- created_at, updated_at
```

#### `template_history`
```sql
- id (UUID)
- template_id (UUID FK)
- snapshot (JSONB) - Snapshot completo
- changed_by (UUID FK)
- changed_at (TIMESTAMP)
- change_description (TEXT)
```

### Índices Optimizados
- GIN index en campos JSONB para búsqueda eficiente
- Índices en campos frecuentemente consultados
- Triggers automáticos para `updated_at`

---

## 🎯 3. TIPOS DE BLOQUES SOPORTADOS

| Tipo | Descripción | Requerido | Configurable |
|------|-------------|-----------|--------------|
| `header` | Encabezado con logo y nombre | ❌ | ✅ |
| `business_info` | Datos del negocio | ❌ | ✅ |
| `customer_info` | Datos del cliente | ❌ | ✅ |
| `items` | Lista de productos/servicios | ✅ | ✅ |
| `subtotals` | Subtotales y cálculos | ❌ | ✅ |
| `totals` | Totales finales | ✅ | ✅ |
| `payment_info` | Información de pago | ❌ | ✅ |
| `footer` | Pie de página | ❌ | ✅ |
| `custom_text` | Texto personalizado | ❌ | ✅ |
| `separator` | Línea separadora | ❌ | ✅ |
| `qr_code` | Código QR | ❌ | ✅ |
| `barcode` | Código de barras | ❌ | ✅ |
| `image` | Imagen personalizada | ❌ | ✅ |

---

## ⚙️ 4. CONFIGURACIÓN POR BLOQUE

Cada bloque tiene las siguientes opciones:

### Configuración General
- ✅ **Etiqueta**: Nombre personalizado
- ✅ **Visible**: Mostrar/Ocultar
- ✅ **Orden**: Drag & Drop para reordenar

### Estilos
- ✅ **Alineación**: Izquierda, Centro, Derecha
- ✅ **Tamaño de Fuente**: XS, SM, MD, LG, XL
- ✅ **Peso de Fuente**: Normal, Negrita
- ✅ **Espaciado Superior**: 0-10mm
- ✅ **Espaciado Inferior**: 0-10mm

### Configuración Específica (según tipo)

#### Bloque `header`
- Mostrar/Ocultar Logo
- Mostrar/Ocultar Nombre del Negocio

#### Bloque `items`
- Mostrar/Ocultar Imágenes
- Mostrar/Ocultar Precios Unitarios
- Mostrar/Ocultar Cantidad
- Mostrar/Ocultar Subtotal

#### Bloque `totals`
- Mostrar/Ocultar Subtotal
- Mostrar/Ocultar IVA/Impuestos
- Mostrar/Ocultar Descuento
- Mostrar/Ocultar Total

#### Bloque `custom_text`
- Editor de texto libre

#### Bloque `qr_code`
- Datos (URL o texto)
- Tamaño (50-200px)

#### Bloque `barcode`
- Datos numéricos
- Altura (30-100px)

#### Bloque `image`
- URL de la imagen
- Altura (20-200px)

---

## 🔄 5. FLUJO COMPLETO DEL SISTEMA

### A. Creación de Plantilla Base

```typescript
// 1. Crear plantilla
const newTemplate = await createTemplate({
  name: 'Ticket Térmico Personalizado',
  description: 'Para ventas en mostrador',
  type: 'ticket',
  paperWidth: 80,
  paperType: 'thermal',
  blocks: [...defaultBlocks]
});

// 2. Guardar
await saveTemplate(newTemplate);
```

### B. Edición Visual

```typescript
// 1. Cargar plantilla
const template = await getTemplateById(templateId);

// 2. Arrastrar bloques para reordenar (Drag & Drop)
// 3. Seleccionar bloque para configurar
// 4. Modificar propiedades en el panel
// 5. Ver preview en tiempo real

// 6. Guardar cambios
await saveTemplate(updatedTemplate);
```

### C. Override por Cliente

```typescript
// 1. Crear override personalizado
await createOverride({
  clientId: 'client-123',
  templateId: 'template-001',
  overrides: [
    {
      blockId: 'block-footer',
      changes: {
        content: {
          text: 'Texto personalizado para este cliente'
        }
      }
    }
  ]
});

// 2. Al renderizar, se aplica automáticamente
```

### D. Renderizado Final

```typescript
// 1. Solicitar renderizado
const result = await renderTemplate({
  templateId: 'template-001',
  clientId: 'client-123', // Opcional - aplica overrides
  data: {
    business: {...},
    customer: {...},
    items: [...],
    totals: {...}
  },
  format: 'html' // 'html', 'pdf', 'raw' (ESC/POS)
});

// 2. Imprimir o descargar
console.log(result.content); // HTML generado
```

---

## 🛡️ 6. VALIDACIONES IMPLEMENTADAS

### Validación de Plantilla
```typescript
validateTemplate(template);
// ✅ Verifica que existe bloque 'items'
// ✅ Verifica que existe bloque 'totals'
// ⚠️ Warning si hay múltiples bloques de items
// ⚠️ Warning si hay órdenes duplicados
// ❌ Error si falta nombre de plantilla
```

### Validación de Datos
```typescript
validatePrintData(data);
// ✅ Verifica que hay al menos 1 item
// ✅ Verifica que existen totales
// ✅ Verifica que existe info del negocio
// ⚠️ Warning si totales no coinciden con suma de items
```

### Protecciones
- ❌ **NO se pueden eliminar bloques requeridos** (`items`, `totals`)
- ✅ Se pueden ocultar pero deben existir
- ✅ Se reordenan automáticamente si hay duplicados
- ✅ Validación antes de guardar

---

## 🎨 7. CARACTERÍSTICAS DEL EDITOR

### Drag & Drop
- ✅ Implementado con `@dnd-kit`
- ✅ Visual feedback al arrastrar
- ✅ Actualización automática de orden
- ✅ Restricciones por tipo de bloque

### Preview en Tiempo Real
- ✅ Se actualiza al modificar cualquier propiedad
- ✅ Simula ticket térmico real
- ✅ Ancho configurable (58mm, 80mm, 110mm)
- ✅ Botones de Imprimir y Descargar HTML

### Panel de Configuración
- ✅ Se abre al seleccionar un bloque
- ✅ Opciones específicas por tipo
- ✅ Sliders para espaciados
- ✅ Switches para mostrar/ocultar elementos

### Toolbar Principal
- ✅ Selector de plantilla activa
- ✅ Botón Guardar con loading state
- ✅ Botón Preview
- ✅ Botón Duplicar plantilla
- ✅ Botón Eliminar (protegido para plantillas por defecto)
- ✅ Botón Nueva Plantilla

---

## 🚀 8. ENDPOINTS SIMULADOS (API Service)

### Templates
```typescript
getAllTemplates()              // GET /api/templates
getTemplateById(id)            // GET /api/templates/:id
getTemplatesByType(type)       // GET /api/templates?type=ticket
createTemplate(dto)            // POST /api/templates
updateTemplate(dto)            // PUT /api/templates/:id
deleteTemplate(id)             // DELETE /api/templates/:id
duplicateTemplate(id, name)    // POST /api/templates/:id/duplicate
```

### Overrides
```typescript
getAllOverrides()                         // GET /api/overrides
getOverrideByClientAndTemplate(c, t)      // GET /api/overrides?client=X&template=Y
createOverride(dto)                       // POST /api/overrides
deleteOverride(id)                        // DELETE /api/overrides/:id
```

### Render
```typescript
renderTemplate(request)         // POST /api/templates/render
// Devuelve HTML, PDF o ESC/POS commands
```

---

## 📊 9. DATOS MOCK INCLUIDOS

### Escenarios Pre-configurados
1. ✅ **Restaurante**: Orden con propina sugerida
2. ✅ **Cocina**: Comanda de cocina con notas especiales
3. ✅ **Spa**: Factura de servicios con próxima cita
4. ✅ **Ferretería**: Factura con múltiples productos
5. ✅ **General**: Ticket estándar con todos los campos

### Uso
```typescript
import { 
  getMockPrintData,
  getMockRestaurantData,
  getMockKitchenOrderData,
  getMockSpaData,
  getMockHardwareStoreData 
} from './utils/print-mock-data';

// Usar en preview
<TemplatePreview 
  template={template} 
  data={getMockRestaurantData()} 
/>
```

---

## 🔌 10. INTEGRACIÓN CON BACKEND REAL

### Para Conectar con ASP.NET Core

1. **Actualizar Service**:
```typescript
// src/app/services/print-templates.service.ts

export async function getAllTemplates(): Promise<PrintTemplate[]> {
  const response = await fetch('/api/templates', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Error al cargar plantillas');
  }
  
  return await response.json();
}
```

2. **Configurar CORS en ASP.NET Core**:
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFigmaSites",
        builder => builder
            .WithOrigins("https://your-figma-site.com")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

3. **Implementar Controllers**:
```csharp
[ApiController]
[Route("api/templates")]
public class PrintTemplatesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var templates = await _service.GetAllAsync();
        return Ok(templates);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTemplateDto dto)
    {
        var template = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = template.Id }, template);
    }
    
    // ... más endpoints
}
```

---

## 🎯 11. CASOS DE USO REALES

### Caso 1: Restaurante con Logo Personalizado
```typescript
// Override para cliente VIP
await createOverride({
  clientId: 'vip-client-001',
  templateId: 'ticket-standard',
  overrides: [
    {
      blockId: 'block-header',
      changes: {
        content: {
          showLogo: true,
          showBusinessName: true
        },
        fontSize: 'xl'
      }
    },
    {
      blockId: 'block-footer',
      changes: {
        content: {
          text: '¡Gracias por su preferencia!\n10% descuento en su próxima visita'
        }
      }
    }
  ]
});
```

### Caso 2: Comanda de Cocina Sin Precios
```typescript
const kitchenTemplate = await createTemplate({
  name: 'Comanda Cocina',
  type: 'kitchen_order',
  paperWidth: 80,
  blocks: [
    {
      type: 'header',
      fontSize: 'xl',
      fontWeight: 'bold',
      content: { showBusinessName: false }
    },
    {
      type: 'items',
      content: {
        showPrices: false,      // ❌ Sin precios
        showQuantity: true,
        showSubtotal: false     // ❌ Sin subtotales
      }
    }
    // Sin bloque de totales ni pago
  ]
});
```

### Caso 3: Ticket con QR de Factura Electrónica
```typescript
const invoiceTemplate = await createTemplate({
  name: 'Ticket con Factura Electrónica',
  type: 'invoice',
  blocks: [
    // ... otros bloques
    {
      type: 'qr_code',
      alignment: 'center',
      content: {
        data: 'https://sat.gob.mx/factura/${UUID}',
        size: 150
      }
    },
    {
      type: 'custom_text',
      alignment: 'center',
      fontSize: 'xs',
      content: {
        text: 'Escanea para descargar tu factura'
      }
    }
  ]
});
```

---

## 🧪 12. TESTING

### Probar el Editor
1. Iniciar la aplicación
2. Navegar a `/admin/print-templates`
3. Crear una nueva plantilla o editar la existente
4. Arrastrar bloques para reordenar
5. Configurar propiedades en el panel derecho
6. Ver preview en tiempo real
7. Guardar y probar impresión

### Probar Validaciones
```typescript
// Intentar eliminar bloque requerido
handleBlockDelete('block-items'); 
// ❌ Alert: "No puedes eliminar un bloque obligatorio"

// Intentar guardar sin nombre
template.name = '';
await handleSaveTemplate();
// ❌ Toast error: "Validación fallida: El nombre es obligatorio"
```

---

## 📝 13. NOTAS DE IMPLEMENTACIÓN

### Decisiones de Diseño
1. **localStorage vs Backend**: Actualmente usa localStorage para desarrollo
2. **Validaciones Client-Side**: Implementadas para feedback inmediato
3. **Drag & Drop**: `@dnd-kit` por su excelente soporte TypeScript
4. **Preview Real-Time**: Se regenera en cada cambio (optimizable con debounce)

### Próximas Mejoras
- [ ] Implementar debounce en preview
- [ ] Agregar templates predefinidos por industria
- [ ] Soporte para variables dinámicas `{{variable}}`
- [ ] Export a PDF con mejor calidad
- [ ] Generación real de ESC/POS commands
- [ ] Galería de bloques pre-diseñados
- [ ] Modo oscuro en preview
- [ ] Versioning de plantillas

---

## 🔒 14. SEGURIDAD

### Validaciones Server-Side (Implementar en ASP.NET Core)
```csharp
public class TemplateValidator : AbstractValidator<CreateTemplateDto>
{
    public TemplateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);
            
        RuleFor(x => x.Blocks)
            .Must(HaveRequiredBlocks)
            .WithMessage("La plantilla debe tener bloques 'items' y 'totals'");
            
        RuleFor(x => x.PaperWidth)
            .Must(x => x == 58 || x == 80 || x == 110)
            .WithMessage("Ancho de papel inválido");
    }
    
    private bool HaveRequiredBlocks(List<BlockConfig> blocks)
    {
        return blocks.Any(b => b.Type == "items") && 
               blocks.Any(b => b.Type == "totals");
    }
}
```

### Permisos
- Solo usuarios con permiso `manage_print_templates` pueden editar
- Historial de cambios para auditoría
- Overrides por cliente requieren permiso adicional

---

## ✅ RESUMEN FINAL

### Lo que SE Implementó
✅ Tipos TypeScript completos  
✅ Schema PostgreSQL con triggers  
✅ API Service completo (simula backend)  
✅ CRUD de plantillas  
✅ Sistema de overrides por cliente  
✅ Editor visual con Drag & Drop  
✅ 13 tipos de bloques diferentes  
✅ Panel de configuración dinámico  
✅ Preview en tiempo real  
✅ Validaciones client-side  
✅ Datos mock para testing  
✅ Integración con ODIN POS  
✅ Ruta y navegación configuradas  

### Lo que FALTA (para producción con backend)
⏳ Endpoints reales de ASP.NET Core  
⏳ Autenticación y permisos  
⏳ Generación real de PDFs  
⏳ Comandos ESC/POS para impresoras térmicas  
⏳ Upload de imágenes/logos  
⏳ Historial de cambios funcional  
⏳ Tests unitarios  
⏳ Tests de integración  

---

## 📞 SOPORTE

Para implementar el backend real o resolver dudas:
1. Revisar `print-templates-schema.sql` para estructura de BD
2. Implementar controllers en ASP.NET Core
3. Conectar endpoints en `print-templates.service.ts`
4. Probar con Postman antes de integrar frontend

---

**Versión**: 1.0.0  
**Fecha**: Febrero 2026  
**Stack**: React + TypeScript + Tailwind + @dnd-kit + PostgreSQL (schema) + ASP.NET Core (pendiente)
