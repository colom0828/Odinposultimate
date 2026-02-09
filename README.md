# 🚀 ODIN POS - Sistema de Punto de Venta

Sistema web moderno de punto de venta desarrollado con React, TypeScript y Tailwind CSS.

## 🎨 Características

- ✨ **Interfaz Dark Mode** con diseño glassmorphism
- 🎨 **Paleta de colores degradados** (azul-púrpura-naranja)
- 📱 **Responsive Design** optimizado para diferentes dispositivos
- 🔐 **Sistema de autenticación** con página de login
- 📊 **Dashboard administrativo** con sidebar fijo
- 🛍️ **Módulos completos**:
  - Dashboard con estadísticas
  - Ventas y gestión de caja
  - Inventario y productos
  - Clientes y proveedores
  - Usuarios y empleados
  - Configuración del sistema
  - Órdenes e impresoras

## 🛠️ Stack Tecnológico

- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.3.5
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **UI Components:** Radix UI
- **Iconos:** Lucide React
- **Gráficas:** Recharts
- **Notificaciones:** Sonner (Toast)
- **Animaciones:** Motion (Framer Motion)
- **Formularios:** React Hook Form

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd odin-pos
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Ejecutar en desarrollo**
```bash
pnpm dev
# o
npm run dev
```

4. **Compilar para producción**
```bash
pnpm build
# o
npm run build
```

## 📁 Estructura del Proyecto

```
odin-pos/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Rutas de autenticación
│   │   │   └── login/       # Página de login
│   │   ├── (admin)/         # Rutas administrativas
│   │   │   ├── dashboard/   # Dashboard principal
│   │   │   ├── ventas/      # Módulo de ventas
│   │   │   ├── productos/   # Gestión de productos
│   │   │   ├── clientes/    # Gestión de clientes
│   │   │   ├── usuarios/    # Gestión de usuarios
│   │   │   ├── configuracion/ # Configuración del sistema
│   │   │   └── ...
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── ui/          # UI components (Radix UI)
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   └── ...
│   │   ├── utils/           # Utilidades
│   │   └── layout.tsx       # Layout principal
│   └── styles/
│       ├── index.css        # Estilos globales
│       ├── theme.css        # Tema y variables CSS
│       └── fonts.css        # Fuentes personalizadas
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Configuración de Tema

El sistema utiliza un tema dark mode con paleta de colores personalizada:

- **Gradiente principal:** Azul → Púrpura → Naranja
- **Fondo:** Slate 950 con overlays oscuros
- **Glassmorphism:** Fondos translúcidos con backdrop blur
- **Bordes:** Purple con opacidad 20-30%

## 🔧 Configuración del Sistema

### Módulo de Configuración

El sistema incluye un módulo completo de configuración con:

1. **Empresa** ✅ (Funcional con persistencia localStorage)
   - Información de la empresa
   - Tipo de negocio
   - Datos de contacto

2. **Facturación** (UI - sin funcionalidad)
3. **Notificaciones** (UI - sin funcionalidad)
4. **Seguridad** (UI - sin funcionalidad)
5. **Sistema** (UI - sin funcionalidad)

## 🚀 Funcionalidades Implementadas

### ✅ Completamente Funcionales
- Sistema de autenticación (Login)
- Navegación con sidebar
- Configuración de empresa con persistencia
- Notificaciones toast (Sonner)
- Diseño responsive
- Tema dark mode

### 🔄 En Desarrollo
- Gestión de productos
- Sistema de ventas
- Gestión de clientes
- Reportes y estadísticas

## 🤝 Contribuir

Este es un proyecto en desarrollo activo. Las contribuciones son bienvenidas!

## 📄 Licencia

Este proyecto es privado y propietario.

## 👨‍💻 Autor

Desarrollado con ❤️ para ODIN POS

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026
