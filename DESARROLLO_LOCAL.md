# 🖥️ ODIN POS - Guía de Desarrollo Local

Esta guía te ayudará a trabajar con ODIN POS en tu computadora local y preparar la integración con tu backend.

## 📋 **Requisitos Previos**

- ✅ Node.js 18+ instalado
- ✅ pnpm o npm
- ✅ Git
- ✅ Visual Studio Code (recomendado)

---

## 🚀 **Paso 1: Clonar el Proyecto**

### Desde GitHub:
```bash
git clone <url-de-tu-repositorio>
cd odin-pos
```

### Desde ZIP:
1. Descarga el proyecto desde Figma Make
2. Extrae el archivo
3. Navega a la carpeta en terminal

---

## 📦 **Paso 2: Instalar Dependencias**

```bash
# Con pnpm (recomendado)
pnpm install

# O con npm
npm install
```

⏱️ Este proceso puede tardar 2-5 minutos dependiendo de tu conexión.

---

## ▶️ **Paso 3: Ejecutar en Modo Desarrollo**

```bash
# Con pnpm
pnpm dev

# Con npm
npm run dev
```

✅ **El servidor se iniciará en:** `http://localhost:5173`

---

## 🔧 **Configuración de Variables de Entorno**

### 1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

### 2. Edita `.env.local` con tus valores:
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=true  # Cambiar a false cuando conectes el backend
```

---

## 🗄️ **Datos Actuales (LocalStorage)**

Actualmente, ODIN POS guarda datos en **localStorage** del navegador:

### Datos que se persisten:
- ✅ **Configuración de Empresa** (Módulo de Configuración)
  - Nombre de empresa
  - Tipo de empresa
  - RUC/NIT
  - Dirección
  - Teléfono
  - Email

### Ubicación en el código:
```typescript
// src/app/(admin)/configuracion/page.tsx
const empresaData = JSON.parse(localStorage.getItem('empresa_config') || '{}');
```

---

## 🔌 **Integración con Backend - Roadmap**

### **Fase 1: Preparación (ACTUAL)** ✅
- [x] Proyecto funcionando localmente
- [x] Estructura de componentes lista
- [x] UI completa de todos los módulos
- [x] Servicio API creado (`/src/app/services/api.ts`)

### **Fase 2: Backend Setup** (SIGUIENTE)
Opciones recomendadas:

#### Opción A: Node.js + Express + PostgreSQL
```bash
# Estructura recomendada:
odin-pos-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.ts
├── package.json
└── .env
```

#### Opción B: Next.js API Routes
- Migrar a Next.js (usa las mismas librerías)
- API routes en `/app/api/`

#### Opción C: Supabase
- Backend como servicio
- PostgreSQL + Auth + Storage incluidos
- No necesitas servidor propio

### **Fase 3: Migración de Datos**
1. **Crear endpoints en el backend:**
   ```
   POST /api/empresa
   GET /api/empresa
   PUT /api/empresa
   ```

2. **Actualizar el frontend:**
   ```typescript
   // Antes (localStorage):
   localStorage.setItem('empresa_config', JSON.stringify(data));
   
   // Después (API):
   import { api } from '@/app/services/api';
   await api.empresa.update(data);
   ```

3. **Migrar datos existentes:**
   - Exportar datos de localStorage
   - Importar a base de datos
   - Cambiar flag: `VITE_USE_MOCK_DATA=false`

---

## 📊 **Estructura de Datos Recomendada para Backend**

### Base de Datos PostgreSQL:

```sql
-- Tabla: empresa
CREATE TABLE empresa (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo_empresa VARCHAR(100),
  ruc_nit VARCHAR(50) UNIQUE,
  direccion TEXT,
  telefono VARCHAR(50),
  email VARCHAR(255),
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(100),
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  documento VARCHAR(50),
  email VARCHAR(255),
  telefono VARCHAR(50),
  direccion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: ventas
CREATE TABLE ventas (
  id SERIAL PRIMARY KEY,
  numero_venta VARCHAR(50) UNIQUE,
  cliente_id INT REFERENCES clientes(id),
  usuario_id INT REFERENCES usuarios(id),
  subtotal DECIMAL(10, 2),
  impuestos DECIMAL(10, 2),
  total DECIMAL(10, 2),
  metodo_pago VARCHAR(50),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: detalle_ventas
CREATE TABLE detalle_ventas (
  id SERIAL PRIMARY KEY,
  venta_id INT REFERENCES ventas(id),
  producto_id INT REFERENCES productos(id),
  cantidad INT,
  precio_unitario DECIMAL(10, 2),
  subtotal DECIMAL(10, 2)
);

-- Tabla: usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  rol VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🛠️ **Comandos Útiles**

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Compilar para producción
pnpm preview          # Vista previa del build

# Limpiar cache
rm -rf node_modules
rm -rf .vite
pnpm install

# Ver localStorage en el navegador
# Consola del navegador (F12):
localStorage.getItem('empresa_config')
```

---

## 🐛 **Solución de Problemas**

### Error: "Cannot find module"
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Puerto 5173 ocupado
```bash
# Editar vite.config.ts:
server: {
  port: 3001
}
```

### Errores de TypeScript
```bash
# Reiniciar servidor TypeScript en VS Code:
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## 📁 **Archivos Importantes**

| Archivo | Propósito |
|---------|-----------|
| `/src/app/services/api.ts` | Cliente HTTP para backend |
| `.env.local` | Variables de entorno |
| `/src/app/(admin)/configuracion/page.tsx` | Config con localStorage |
| `vite.config.ts` | Configuración de Vite |
| `package.json` | Dependencias del proyecto |

---

## 📞 **Próximos Pasos**

1. ✅ **Ejecutar localmente** y familiarizarte con el código
2. 🔄 **Decidir stack de backend** (Node.js, Next.js, Supabase)
3. 🗄️ **Diseñar base de datos** (usar el esquema sugerido)
4. 🔌 **Crear endpoints** uno por uno
5. 🔄 **Migrar módulos** de localStorage a API
6. 🧪 **Probar** cada integración

---

## 💡 **Tips de Desarrollo**

- 🔍 Usa **React DevTools** para inspeccionar componentes
- 🎨 **Tailwind CSS** ya está configurado
- 🔥 Hot reload activado: los cambios se reflejan automáticamente
- 📦 Todas las dependencias ya están instaladas
- 🎯 El código está listo para producción

---

**¿Dudas?** Revisa el código en `/src/app/services/api.ts` para ver cómo integrar el backend.
