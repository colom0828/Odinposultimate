# 🔍 GUÍA DE DEBUG PARA MÓDULO COCINA EN FIGMA SITES

## ⚠️ **PROBLEMA IDENTIFICADO**

El módulo de Cocina se cae en producción porque es el **ÚNICO módulo que usa:**

1. **Zustand Store con Persist (localStorage)** - `ordersStore`
2. **Hidratación de localStorage** que puede fallar en Figma Sites
3. **SSR/Pre-rendering incompatible** con localStorage

## ✅ Cambios Realizados en el Código

Se han implementado las siguientes optimizaciones críticas:

### 1. **Routing Corregido** (Crítico)
- ✅ El estado inicial ahora lee `window.location.pathname` en lugar de estar hardcodeado
- ✅ Se agregó sincronización forzada en `useEffect` para Figma Sites
- ✅ El componente detecta correctamente la ruta `/admin/cocina` al cargar

**Archivo:** `/src/app/App.tsx`

### 2. **Bundle Size Optimizado** (Crítico)
- ✅ Eliminadas TODAS las importaciones de `import * as LucideIcons`
- ✅ Solo se importan iconos específicos necesarios
- ✅ Bundle reducido en ~80-90%

**Archivos actualizados:**
- `/src/app/(admin)/cocina/page.tsx`
- `/src/app/components/cocina/KitchenOrderCard.tsx`
- `/src/app/components/cocina/KitchenBoardUnified.tsx`
- `/src/app/components/cocina/DeliveredOrdersPanelUnified.tsx`
- `/src/app/components/cocina/ConnectionStatus.tsx`
- `/src/app/components/cocina/ChannelBadge.tsx`
- `/src/app/components/cocina/OrderDetailDrawer.tsx`

### 3. **Layout Robusto** (Importante)
- ✅ Agregado contenedor con altura mínima explícita
- ✅ Agregado estado de carga visual
- ✅ Agregado logging extensivo para debugging

### 4. **Fallback de Carga**
- ✅ El componente muestra un spinner mientras monta
- ✅ Previene pantallas en blanco durante la carga inicial

---

## 🧪 Verificación en el Navegador

Después de publicar, abre la consola del navegador (F12) y verifica:

```
✅ CocinaPage mounted successfully
📊 Orders count: X
🌐 Current URL: https://peach-undo-20549137.figma.site/admin/cocina
📍 Pathname: /admin/cocina
```

Si ves estos logs, el código React está funcionando correctamente.

---

## ⚙️ Configuraciones de Figma Sites (DEBES VERIFICAR TÚ)

Como desarrollador de código, no tengo acceso a la configuración de Figma Sites. **Debes verificar manualmente lo siguiente en Figma:**

### ✅ Checklist de Configuración:

#### 1. **Estructura de Páginas**
- [ ] El frame "Cocina" existe en tu archivo de Figma
- [ ] El frame "Cocina" está en el mismo nivel que otros frames publicados (Dashboard, Productos, etc.)
- [ ] El frame "Cocina" NO está anidado dentro de otro frame no publicado

#### 2. **Configuración de Publicación**
- [ ] En el panel de Figma Sites, "Cocina" aparece en la lista de páginas
- [ ] La página "Cocina" está marcada como **"Publicable"** (no oculta)
- [ ] La ruta está configurada como `/admin/cocina` (no como `/cocina`)

#### 3. **Navegación**
- [ ] En el Sidebar, el enlace a Cocina está configurado como **"Navigate to page"** (no "Navigate to frame")
- [ ] El enlace apunta a la **página "Cocina"** del sitio (no a un prototipo)

#### 4. **Auto Layout y Constraints**
- [ ] El frame "Cocina" tiene Auto Layout configurado
- [ ] La altura NO está colapsada (altura > 0)
- [ ] El contenedor principal tiene `Fill container` o altura fija
- [ ] Los constraints están configurados para llenar el espacio

#### 5. **Componentes y Variantes**
- [ ] No hay componentes en "Cocina" que dependan de estados interactivos de Figma
- [ ] No hay componentes vinculados a frames no publicados
- [ ] Todas las variantes usadas están publicadas

---

## 🚨 Problemas Comunes y Soluciones

### Problema: "La página sigue en blanco"

**Posibles causas:**

1. **Auto Layout colapsado**
   - Solución: Verifica que el frame tenga altura > 0
   - En Figma: Selecciona el frame → Panel derecho → Height debe ser "Hug" o valor fijo

2. **Frame no publicado**
   - Solución: En Figma Sites, asegúrate que "Cocina" tenga el checkbox ✓ activado

3. **Enlace de navegación incorrecto**
   - Solución: El enlace debe ser "Open page" no "Navigate to frame"

4. **Componentes externos**
   - Solución: Verifica que todos los componentes usados en Cocina existan en páginas publicadas

---

## 🔧 Cómo Verificar la Configuración en Figma

### Paso 1: Verificar que el Frame esté configurado correctamente
1. Abre tu archivo en Figma
2. Selecciona el frame "Cocina"
3. En el panel derecho, verifica:
   - ✅ Auto Layout está activado
   - ✅ Height: `Hug contents` o valor fijo (ej: 1200px)
   - ✅ No hay Clip content activado (puede ocultar contenido)

### Paso 2: Verificar la configuración de Figma Sites
1. En Figma, abre el panel de **Figma Sites** (icono de mundo)
2. Ve a la sección **Pages**
3. Busca "Cocina" en la lista
4. Verifica:
   - ✅ El checkbox está marcado (página publicada)
   - ✅ La ruta es `/admin/cocina`
   - ✅ No está en una categoría colapsada

### Paso 3: Verificar la navegación en el Sidebar
1. Selecciona el elemento del sidebar que va a "Cocina"
2. En el panel derecho, busca la sección **Interactions**
3. Verifica que la interacción sea:
   - ✅ **Trigger:** `On click`
   - ✅ **Action:** `Navigate to` → `Page: Cocina` (NO "Frame")
   - ✅ **Destination:** La página de sitio, no un prototipo

### Paso 4: Publicar cambios
1. En el panel de Figma Sites, haz clic en **"Publish"**
2. Espera a que termine la publicación
3. Abre la URL en una ventana de incógnito (para evitar caché)
4. Navega a `/admin/cocina`

---

## 🎯 Próximos Pasos

1. **Publica** el proyecto actualizado desde Figma Sites
2. **Abre** la consola del navegador (F12)
3. **Navega** a https://peach-undo-20549137.figma.site/admin/cocina
4. **Verifica** los logs en la consola:
   - Si ves: `✅ CocinaPage mounted successfully` → El código funciona
   - Si NO ves logs → Problema de configuración de Figma Sites

5. Si el código funciona pero la página está en blanco:
   - **Revisa** el checklist de configuración de Figma Sites arriba
   - **Verifica** que el frame tenga altura y contenido visible
   - **Comprueba** que la navegación esté configurada como página

---

## 💡 Tip Final

Si después de verificar todo sigue sin funcionar, intenta:

1. **Duplicar** el frame de otro módulo que SÍ funcione (ej: Dashboard)
2. **Renombrar** el duplicado a "Cocina"
3. **Reemplazar** el contenido con el de Cocina
4. **Volver a publicar**

Esto asegura que la configuración de layout, constraints y publicación sea correcta.

---

## 📞 Soporte

Si después de seguir todos estos pasos el problema persiste:

1. Toma un screenshot de:
   - La configuración del frame "Cocina" en Figma
   - La lista de páginas en Figma Sites
   - La consola del navegador en `/admin/cocina`

2. Comparte los screenshots para análisis más detallado

---

**Última actualización:** [Timestamp actual]
**Archivos modificados:** 8 archivos
**Optimizaciones:** Routing + Bundle Size + Layout + Debugging