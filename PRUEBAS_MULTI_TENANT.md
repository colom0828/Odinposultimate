# 🧪 ODIN POS - Pruebas Multi-Tenant

## ✅ **Todo está listo para probar**

El sistema multi-tenant está 100% funcional usando localStorage. Sigue estos pasos para verificar que todo funciona correctamente.

---

## 🚀 Inicio

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd odin-pos

# 2. Inicia el servidor de desarrollo
npm run dev

# 3. Abre el navegador
# http://localhost:5173
```

---

## 🧑‍💼 Usuarios de Prueba

| # | Usuario | Contraseña | Tenant ID | Negocio | Tipo |
|---|---------|------------|-----------|---------|------|
| 1 | `admin` | `admin123` | `spa_001` | Spa Relax & Beauty | SPA |
| 2 | `vendedor` | `vendedor123` | `rest_002` | Restaurante El Buen Sabor | Restaurant |
| 3 | `cajero` | `cajero123` | `ferre_003` | Ferretería Construcción Total | Hardware |
| 4 | `master` | `master123` | `null` | Admin Master | Todos |

---

## ✅ Prueba 1: Aislamiento de Datos (SPA vs Restaurant)

### Objetivo
Verificar que los datos de un tenant **NO** aparecen en otro tenant.

### Pasos

#### A) Crear datos en SPA
```
1. Login:
   - Usuario: admin
   - Contraseña: admin123
   
2. ✅ Verificar que el header muestra: "Spa Relax & Beauty"

3. Ir a "Clientes" (sidebar)

4. Crear cliente:
   - Nombre: María López
   - Teléfono: +1 809-555-1234
   - Email: maria@example.com
   
5. ✅ El cliente aparece en la lista

6. Ir a "Servicios" (en el sidebar aparece como "Servicios")

7. Crear servicio:
   - Nombre: Manicure Premium
   - Precio: 1,500 DOP
   - Duración: 60 min
   
8. ✅ El servicio aparece en la lista

9. Logout
```

#### B) Verificar aislamiento en Restaurant
```
10. Login:
    - Usuario: vendedor
    - Contraseña: vendedor123
    
11. ✅ Verificar que el header muestra: "Restaurante El Buen Sabor"

12. Ir a "Clientes"

13. ✅ ÉXITO: La lista está VACÍA
    ❌ Si ves "María López" → FALLÓ

14. Ir a "Productos" o "Ventas"
    (En restaurant, el módulo se llama "Ventas", no "Servicios")
    
15. ✅ ÉXITO: No aparece "Manicure Premium"

16. Crear producto:
    - Nombre: Pizza Margarita
    - Precio: 450 DOP
    
17. ✅ El producto aparece en la lista del restaurante

18. Logout
```

#### C) Volver a SPA y verificar
```
19. Login nuevamente con: admin / admin123

20. Ir a "Clientes"

21. ✅ ÉXITO: "María López" SIGUE APARECIENDO

22. Ir a "Servicios"

23. ✅ ÉXITO: "Manicure Premium" SIGUE APARECIENDO
    ❌ Si ves "Pizza Margarita" → FALLÓ
```

**✅ RESULTADO ESPERADO:**
- SPA tiene: María López, Manicure Premium
- Restaurant tiene: Pizza Margarita
- NO hay cruce de datos

---

## ✅ Prueba 2: localStorage Separado por Tenant

### Objetivo
Verificar que los datos se guardan con el patrón correcto en localStorage.

### Pasos

```
1. Login con admin / admin123 (Spa)

2. Abrir DevTools (F12)

3. Ir a: Application → Local Storage → http://localhost:5173

4. ✅ Buscar keys que empiecen con "odin_tenant_spa_001__"

   Ejemplo:
   odin_tenant_spa_001__customers__data
   odin_tenant_spa_001__services__data
   odin_tenant_spa_001__sales__data

5. ✅ Buscar también:
   odin_current_tenant = "spa_001"
   odin_master_tenants = [array de tenants]

6. Logout

7. Login con vendedor / vendedor123 (Restaurant)

8. ✅ Buscar keys que empiecen con "odin_tenant_rest_002__"

   Ejemplo:
   odin_tenant_rest_002__customers__data
   odin_tenant_rest_002__products__data
   odin_tenant_rest_002__sales__data

9. ✅ Verificar que:
   odin_current_tenant = "rest_002"
```

**✅ RESULTADO ESPERADO:**
- Los datos de cada tenant tienen prefijo distinto
- `odin_current_tenant` cambia según el usuario logueado
- No hay keys "odin_products" o "odin_customers" sin prefijo de tenant

---

## ✅ Prueba 3: Selector de Tenant (Master Admin)

### Objetivo
Verificar que el usuario `master` puede cambiar entre tenants.

### Pasos

```
1. Login:
   - Usuario: master
   - Contraseña: master123
   
2. ✅ Verificar que aparece un dropdown de "Perfil actual" en el sidebar

3. Click en el dropdown

4. ✅ Debe mostrar lista de tenants:
   - Spa Relax & Beauty (spa_001)
   - Restaurante El Buen Sabor (rest_002)
   - Ferretería Construcción Total (ferre_003)

5. Seleccionar "Spa Relax & Beauty"

6. ✅ La página se recarga

7. ✅ El header/sidebar muestra: "Spa Relax & Beauty"

8. Ir a "Clientes" → Debería ver los clientes del SPA

9. Click nuevamente en el dropdown

10. Seleccionar "Restaurante El Buen Sabor"

11. ✅ La página se recarga

12. ✅ El header muestra: "Restaurante El Buen Sabor"

13. Ir a "Clientes" → Debería ver SOLO los clientes del restaurante
```

**✅ RESULTADO ESPERADO:**
- Master admin puede ver todos los tenants
- Al cambiar tenant, los datos cambian completamente
- No hay mezcla de datos

---

## ✅ Prueba 4: Módulos Diferentes por Tipo de Negocio

### Objetivo
Verificar que cada tipo de negocio tiene módulos específicos.

### Pasos

#### A) SPA
```
1. Login con: admin / admin123 (Spa)

2. ✅ En el sidebar debe aparecer:
   - Dashboard
   - Citas / Agenda ← ESPECÍFICO DEL SPA
   - Clientes
   - Servicios ← NO dice "Productos"
   - Productos
   - Caja / POS
   - Facturación / Ventas
   - Impresoras
   - Plantillas de Impresión
   - Empleados / Técnicos
   - Reportes
   - Configuración

3. ✅ NO debe aparecer:
   - Mesas
   - Cocina
   - Delivery
```

#### B) Restaurant
```
4. Logout → Login con: vendedor / vendedor123 (Restaurant)

5. ✅ En el sidebar debe aparecer:
   - Dashboard
   - Ventas
   - Mesas ← ESPECÍFICO DEL RESTAURANT
   - Cocina ← ESPECÍFICO DEL RESTAURANT
   - Inventario
   - Proveedores
   - Órdenes de compra
   - Caja registradora
   - Impresoras
   - Plantillas de Impresión
   - Clientes
   - Empleados
   - Configuración

6. ✅ NO debe aparecer:
   - Citas / Agenda
   - Servicios (dice "Ventas")
```

#### C) Ferretería
```
7. Logout → Login con: cajero / cajero123 (Ferretería)

8. ✅ En el sidebar debe aparecer:
   - Dashboard
   - Ventas / POS
   - Productos
   - Inventario
   - Proveedores / Compras ← ESPECÍFICO DE FERRETERÍA
   - Órdenes de compra
   - Caja registradora
   - Impresoras
   - Plantillas de Impresión
   - Clientes
   - Reportes
   - Configuración

9. ✅ NO debe aparecer:
   - Mesas
   - Cocina
   - Citas
   - Servicios
```

**✅ RESULTADO ESPERADO:**
- Cada tipo de negocio tiene módulos específicos
- Los módulos comunes (Caja, Clientes, Impresoras, Plantillas) aparecen en todos
- "Plantillas de Impresión" aparece en SPA, Restaurant y Ferretería ✅

---

## ✅ Prueba 5: Plantillas de Impresión en Todos los Perfiles

### Objetivo
Verificar que el módulo "Plantillas de Impresión" está en todos los tipos de negocio.

### Pasos

```
1. Login con: admin / admin123 (Spa)
2. ✅ Ver "Plantillas de Impresión" en el sidebar
3. Click → Debe abrir la página de plantillas

4. Logout → Login con: vendedor / vendedor123 (Restaurant)
5. ✅ Ver "Plantillas de Impresión" en el sidebar

6. Logout → Login con: cajero / cajero123 (Ferretería)
7. ✅ Ver "Plantillas de Impresión" en el sidebar
```

**✅ RESULTADO ESPERADO:**
- "Plantillas de Impresión" aparece en **todos** los perfiles
- El ícono es "Receipt"
- La ruta es `/admin/print-templates`

---

## 🐛 Problemas Comunes

### ❌ "No aparecen los tenants"
**Solución:**
```javascript
// DevTools Console
localStorage.clear();
location.reload();
```

### ❌ "Los datos se mezclan entre tenants"
**Solución:**
```javascript
// Verificar que el código use TenantStorage, no localStorage directo
import { TenantStorage } from '@/services/storage/tenantStorage';

// BUENO ✅
TenantStorage.setItem('customers', 'data', customers);

// MALO ❌
localStorage.setItem('customers', JSON.stringify(customers));
```

### ❌ "No puedo cambiar de tenant"
**Solución:**
- Solo el usuario `master` puede cambiar entre tenants
- Los otros usuarios están asignados a un solo tenant

### ❌ "No aparece el selector de tenant"
**Solución:**
- El selector solo aparece si el usuario tiene acceso a múltiples tenants
- Login con: `master / master123`

---

## 📊 Verificación Final

### ✅ Checklist

- [ ] ✅ Cada usuario ve solo los datos de su tenant
- [ ] ✅ Los datos NO se mezclan entre tenants
- [ ] ✅ localStorage tiene keys con formato `odin_tenant_{tenantId}__`
- [ ] ✅ Master admin puede cambiar entre tenants
- [ ] ✅ Cada tipo de negocio tiene módulos específicos
- [ ] ✅ "Plantillas de Impresión" aparece en todos los perfiles
- [ ] ✅ Al cambiar de tenant, la página se recarga
- [ ] ✅ `odin_current_tenant` en localStorage es correcto

---

## 🎯 Próximos Pasos (Cuando tengas backend)

1. Desarrollar backend ASP.NET Core siguiendo `/BACKEND_API_SPEC.md`
2. Configurar PostgreSQL (master + tenants)
3. Configurar variable de entorno:
   ```env
   VITE_API_URL=https://api.tudominio.com
   VITE_USE_MOCK=false
   ```
4. ✅ Listo. El frontend ya está preparado.

---

## 📞 Ayuda

Si algo no funciona:
1. Revisa `/MULTI_TENANT_GUIDE.md`
2. Revisa `/MULTI_TENANT_SUMMARY.md`
3. Limpia localStorage y recarga
4. Verifica que uses los usuarios correctos

---

**Versión:** 1.0.0  
**Última actualización:** 2025-02-26
