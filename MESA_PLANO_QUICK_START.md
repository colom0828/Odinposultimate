# 🚀 Constructor de Plano de Mesas - Quick Start

## ⚡ Inicio Rápido

### 1️⃣ Acceder al Módulo

```
1. Cambiar a modo "Restaurante" (DevPanel ⚙️)
2. Ir a sidebar → "Mesas"
3. Click en "Abrir Constructor de Plano"
```

### 2️⃣ Crear tu Primera Mesa

**Opción A - Drag & Drop:**
```
1. Arrastra un tipo de mesa desde la barra izquierda
2. Suelta en el plano
3. ¡Listo!
```

**Opción B - Click:**
```
1. Click en un tipo de mesa (barra izquierda)
2. La mesa aparece en el centro
3. Arrástrala a su posición
```

### 3️⃣ Organizar Mesas

```
✅ Arrastra para mover
✅ Click para editar
✅ Toggle "Grid" para alinear automáticamente
```

### 4️⃣ Crear Áreas

```
1. Click "Nueva Área" (sidebar derecha)
2. Se crea "Área 2"
3. Click en el área para cambiar
```

### 5️⃣ Guardar

```
Click en "GUARDAR PLANO DE MESAS" (botón inferior central)
```

---

## 🎯 Atajos y Tips

| Acción | Cómo hacerlo |
|--------|--------------|
| **Mover mesa** | Click y arrastra |
| **Editar mesa** | Click en la mesa |
| **Eliminar mesa** | Click → Editar → Ícono papelera |
| **Cambiar estado** | Click → Editar → Selector de estado |
| **Alinear al grid** | Toggle "Ajustar a cuadrícula" ON |
| **Cambiar área** | Click en área (sidebar derecha) |
| **Ver todas las mesas** | Contador en esquina superior derecha |

---

## 📐 Grid System

```
Grid Size: 20px x 20px
Canvas: 1200px x 800px

Con "Snap to Grid" ON:
  ✅ Las mesas se alinean perfectamente
  ✅ Más fácil organización

Con "Snap to Grid" OFF:
  ✅ Posicionamiento libre pixel por pixel
```

---

## 🎨 Estados de Mesa

```
🟢 LIBRE     → Verde  → Mesa disponible
🔴 OCUPADA   → Rojo   → Mesa con clientes
🟡 RESERVADA → Amarillo → Mesa reservada
🔵 PAGANDO   → Azul   → En proceso de pago
```

Para cambiar el estado:
```
1. Click en la mesa
2. En el panel de edición, click en el estado deseado
3. Click "Guardar"
```

---

## 🏗️ Tipos de Mesa

| Forma | Icono | Capacidad | Uso Típico |
|-------|-------|-----------|------------|
| **Cuadrada** | ⬜ | 2-4 | Parejas, grupos pequeños |
| **Redonda** | ⭕ | 4 | Grupos medianos |
| **Rectangular** | ▭ | 4-6 | Familias |
| **Grande** | ⬢ | 6-8 | Grupos grandes |

---

## 📱 Pantallas Principales

### **Página Principal de Mesas** (`/admin/mesa`)
```
- Hero card con botón al constructor
- Features destacadas
- Tipos de mesa disponibles
- Info cards
```

### **Constructor de Plano** (`/admin/mesa/plano`)
```
Layout:
┌─────────────────────────────────────┐
│ Header con stats                    │
├──┬─────────────────────────────┬────┤
│  │                             │    │
│T │      PLANO / CANVAS         │ S  │
│O │                             │ I  │
│O │      (Drag & Drop)          │ D  │
│L │                             │ E  │
│B │                             │ B  │
│A │                             │ A  │
│R │                             │ R  │
│  │                             │    │
├──┴─────────────────────────────┴────┤
│  [GUARDAR PLANO DE MESAS]           │
└─────────────────────────────────────┘

TOOLBAR (izquierda):
  - Cuadrada
  - Redonda
  - Rectangular
  - Grande

SIDEBAR (derecha):
  - Nueva Área
  - Toggle Grid
  - Lista de áreas
  - Stats
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Restaurante Pequeño
```
Área: "Salón Principal"
  - 6 mesas cuadradas (2-4 personas)
  - 3 mesas redondas (4 personas)
  - 1 mesa grande (8 personas)

Total: 10 mesas
Capacidad: ~44 personas
```

### Ejemplo 2: Restaurante con Terraza
```
Área 1: "Salón Interior"
  - 8 mesas cuadradas
  - 4 mesas rectangulares

Área 2: "Terraza"
  - 6 mesas redondas
  - 2 mesas grandes

Total: 20 mesas
Capacidad: ~88 personas
```

### Ejemplo 3: Restaurante Fine Dining
```
Área 1: "Salón General"
  - 12 mesas cuadradas

Área 2: "Área VIP"
  - 3 mesas grandes
  - 2 mesas redondas

Total: 17 mesas
Capacidad: ~64 personas
```

---

## 🔧 Desarrollo Futuro

### Integración con Backend (Next Steps)

**1. Crear endpoints en ASP.NET Core:**

```csharp
// PlanoController.cs
[HttpGet("plano/{id}")]
public async Task<ActionResult<PlanoRestaurante>> GetPlano(string id)
{
    // Obtener plano desde DB
}

[HttpPost("plano")]
public async Task<ActionResult<PlanoRestaurante>> CreatePlano(PlanoRestaurante plano)
{
    // Crear nuevo plano
}

[HttpPut("plano/{id}")]
public async Task<ActionResult<PlanoRestaurante>> UpdatePlano(string id, PlanoRestaurante plano)
{
    // Actualizar plano existente
}

[HttpDelete("plano/{id}")]
public async Task<ActionResult> DeletePlano(string id)
{
    // Eliminar plano
}
```

**2. Modificar `handleSavePlano` en frontend:**

```typescript
const handleSavePlano = async () => {
  setIsSaving(true);
  
  try {
    const response = await fetch('/api/mesas/plano', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(plano),
    });
    
    if (!response.ok) throw new Error('Error guardando');
    
    alert('✅ Plano guardado exitosamente');
  } catch (error) {
    alert('❌ Error guardando plano');
  } finally {
    setIsSaving(false);
  }
};
```

**3. Cargar plano desde backend:**

```typescript
useEffect(() => {
  const loadPlano = async () => {
    try {
      const response = await fetch('/api/mesas/plano/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      setPlano(data);
    } catch (error) {
      console.error('Error cargando plano:', error);
    }
  };
  
  loadPlano();
}, []);
```

---

## ✅ Checklist de Verificación

Antes de usar en producción, verifica:

- [ ] El modo de negocio es "Restaurante"
- [ ] Todas las mesas tienen número único
- [ ] Todas las áreas tienen nombre descriptivo
- [ ] No hay mesas superpuestas (visualmente)
- [ ] Las mesas están dentro del área visible
- [ ] El plano se guarda correctamente
- [ ] Las áreas reflejan la distribución real del local

---

## 🆘 Soporte

**¿Problemas?** Consulta el archivo `MESA_PLANO_README.md` para documentación completa.

**Reportar bugs:**
1. Describe el problema
2. Pasos para reproducir
3. Captura de pantalla (si aplica)

---

**¡Listo para organizar tu restaurante visualmente! 🍽️✨**
