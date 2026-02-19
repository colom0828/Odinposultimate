# 🚀 GUÍA DE DEPLOYMENT - ODIN POS

## 📋 Índice

1. [Información General del Proyecto](#información-general-del-proyecto)
2. [Plataformas Recomendadas](#plataformas-recomendadas)
3. [Deployment en Vercel](#deployment-en-vercel-recomendado)
4. [Deployment en Netlify](#deployment-en-netlify)
5. [Deployment en GitHub Pages](#deployment-en-github-pages)
6. [Deployment en Render](#deployment-en-render)
7. [Deployment en Railway](#deployment-en-railway)
8. [Deployment Manual (VPS)](#deployment-manual-vps)
9. [Variables de Entorno](#variables-de-entorno)
10. [Troubleshooting](#troubleshooting)

---

## 📦 Información General del Proyecto

### Stack Tecnológico
- **Framework:** Vite 6.3.5 + React 18.3.1
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4.1.12
- **Animaciones:** Motion (Framer Motion)
- **State Management:** Zustand + localStorage persist
- **UI Components:** Radix UI + shadcn/ui
- **Charts:** Recharts
- **Package Manager:** pnpm (recomendado) / npm / yarn

### Estructura del Proyecto
```
odin-pos/
├── src/
│   ├── app/              # Código fuente principal
│   │   ├── (admin)/      # Páginas del admin
│   │   ├── (auth)/       # Páginas de autenticación
│   │   ├── components/   # Componentes React
│   │   ├── store/        # Zustand stores
│   │   ├── services/     # API services
│   │   └── App.tsx       # Componente principal
│   └── styles/           # Estilos globales
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Características Especiales
- ✅ **SPA (Single Page Application)** con routing client-side
- ✅ **localStorage persistence** para datos (Zustand)
- ✅ **Tema oscuro/claro** con next-themes
- ✅ **Multi-business mode** (Restaurant, Spa, Hardware, etc.)
- ✅ **47 reportes** con gráficas Recharts
- ✅ **Sistema de cocina** (KDS) en tiempo real simulado
- ✅ **PWA ready** (puede convertirse en PWA)

---

## 🏆 Plataformas Recomendadas

| Plataforma | Dificultad | Velocidad | Gratis | SSL | CI/CD | Recomendado |
|------------|------------|-----------|--------|-----|-------|-------------|
| **Vercel** | ⭐ Fácil | ⚡ Muy Rápido | ✅ Sí | ✅ Auto | ✅ Auto | 🥇 **Mejor** |
| **Netlify** | ⭐ Fácil | ⚡ Rápido | ✅ Sí | ✅ Auto | ✅ Auto | 🥈 Excelente |
| **GitHub Pages** | ⭐⭐ Media | ⚡ Rápido | ✅ Sí | ✅ Auto | ⚠️ Manual | 🥉 Bueno |
| **Render** | ⭐ Fácil | ⚡ Medio | ✅ Sí* | ✅ Auto | ✅ Auto | ✅ Bueno |
| **Railway** | ⭐⭐ Media | ⚡ Rápido | ✅ Sí* | ✅ Auto | ✅ Auto | ✅ Bueno |
| **VPS** | ⭐⭐⭐ Alta | ⚡ Variable | ❌ No | ⚠️ Manual | ❌ Manual | ⚠️ Avanzado |

**Sí*** = Plan gratuito con limitaciones

---

## 🥇 Deployment en Vercel (Recomendado)

### Por qué Vercel
- ✅ Optimizado para Vite/React
- ✅ Deploy en 2 minutos
- ✅ SSL automático
- ✅ CDN global
- ✅ Preview deployments automáticos
- ✅ 100GB bandwidth gratis/mes
- ✅ Dominio personalizado gratis

### Paso a Paso

#### Opción A: Deploy desde GitHub (Recomendado)

**1. Preparar el repositorio**
```bash
# Inicializar git si no existe
git init

# Crear .gitignore
echo "node_modules
dist
.env
.DS_Store
*.log" > .gitignore

# Commit inicial
git add .
git commit -m "Initial commit - ODIN POS"

# Subir a GitHub
git remote add origin https://github.com/TU_USUARIO/odin-pos.git
git branch -M main
git push -u origin main
```

**2. Deploy en Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta (puedes usar GitHub)
3. Click en **"Add New Project"**
4. Importa tu repositorio de GitHub
5. Configura:
   ```
   Framework Preset: Vite
   Build Command: pnpm build
   Output Directory: dist
   Install Command: pnpm install
   ```
6. Click **"Deploy"**

**3. Configuración Post-Deploy**
```bash
# En Vercel Dashboard → Settings → General
Root Directory: ./
Node.js Version: 18.x o superior
```

#### Opción B: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde la raíz del proyecto
vercel login

# Deploy
vercel

# Para producción
vercel --prod
```

### Configuración Adicional

**vercel.json** (crear en la raíz):
```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🥈 Deployment en Netlify

### Paso a Paso

#### Opción A: Deploy desde GitHub

**1. Push a GitHub** (igual que en Vercel)

**2. Deploy en Netlify**
1. Ve a [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Conecta con GitHub
4. Selecciona el repositorio
5. Configura:
   ```
   Build command: pnpm build
   Publish directory: dist
   ```
6. Click **"Deploy site"**

#### Opción B: Deploy con Netlify CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Producción
netlify deploy --prod
```

### Configuración Adicional

**netlify.toml** (crear en la raíz):
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🥉 Deployment en GitHub Pages

### Paso a Paso

**1. Actualizar vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  
  // ✅ IMPORTANTE: Configurar base para GitHub Pages
  base: '/odin-pos/', // Reemplaza 'odin-pos' con el nombre de tu repo
})
```

**2. Crear archivo de workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**3. Configurar GitHub Pages**
1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. Guarda

**4. Push y Deploy**
```bash
git add .
git commit -m "Add GitHub Pages workflow"
git push origin main
```

Tu sitio estará disponible en: `https://TU_USUARIO.github.io/odin-pos/`

---

## 🔵 Deployment en Render

### Paso a Paso

**1. Configurar build**

Crear `render.yaml` en la raíz:
```yaml
services:
  - type: web
    name: odin-pos
    env: static
    buildCommand: pnpm install && pnpm build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**2. Deploy**
1. Ve a [render.com](https://render.com)
2. Crea una cuenta
3. **New** → **Static Site**
4. Conecta tu repositorio GitHub
5. Configura:
   ```
   Build Command: pnpm install && pnpm build
   Publish Directory: dist
   ```
6. **Create Static Site**

---

## 🟣 Deployment en Railway

### Paso a Paso

**1. Crear Dockerfile** (Railway usa Docker)

`Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurar nginx para SPA
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**2. Deploy**
1. Ve a [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona tu repositorio
4. Railway detectará el Dockerfile automáticamente
5. **Deploy**

---

## 🖥️ Deployment Manual (VPS)

### Requisitos
- VPS con Ubuntu/Debian
- Nginx o Apache
- Node.js 18+
- Dominio (opcional)

### Paso a Paso

**1. Conectar al VPS**
```bash
ssh usuario@tu-servidor.com
```

**2. Instalar dependencias**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar nginx
sudo apt install -y nginx
```

**3. Clonar y buildar**
```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/odin-pos.git
cd odin-pos

# Instalar dependencias
pnpm install

# Build
pnpm build
```

**4. Configurar Nginx**
```bash
sudo nano /etc/nginx/sites-available/odin-pos
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    root /home/usuario/odin-pos/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**5. Activar sitio**
```bash
sudo ln -s /etc/nginx/sites-available/odin-pos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**6. SSL con Let's Encrypt (Opcional)**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

---

## 🔐 Variables de Entorno

Actualmente, ODIN POS **NO requiere variables de entorno** porque:
- ✅ Usa localStorage para persistencia
- ✅ No tiene backend real (usa mocks)
- ✅ No tiene API keys externas

### Si decides agregar backend:

**Crear `.env`:**
```bash
VITE_API_URL=https://api.tu-backend.com
VITE_APP_NAME=ODIN POS
VITE_VERSION=1.0.0
```

**Usar en código:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

**Configurar en plataformas:**
- **Vercel/Netlify:** Settings → Environment Variables
- **Render:** Environment → Add Environment Variable
- **Railway:** Variables tab

---

## 🧪 Testing Pre-Deploy

Antes de deployar, verifica localmente:

```bash
# Build local
pnpm build

# Preview del build
pnpm preview

# Abre http://localhost:4173
```

**Checklist de pruebas:**
- ✅ Routing funciona (navega entre páginas)
- ✅ localStorage funciona (crea órdenes, ventas)
- ✅ Reportes cargan correctamente
- ✅ Módulo Cocina funciona
- ✅ No hay errores en consola

---

## 🐛 Troubleshooting

### Problema: "404 Not Found" al recargar página

**Causa:** El servidor no está configurado para SPA routing.

**Solución:**
- **Vercel:** Agregar `vercel.json` con rewrites (ver arriba)
- **Netlify:** Agregar `netlify.toml` con redirects (ver arriba)
- **Nginx:** Agregar `try_files $uri $uri/ /index.html;`

### Problema: "Módulo Cocina no carga"

**Causa:** Zustand persist con localStorage + SSR.

**Solución:** Ya implementada en el código (`skipHydration`).

### Problema: "Bundle size muy grande"

**Solución:**
```bash
# Analizar bundle
pnpm add -D rollup-plugin-visualizer

# En vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true })
  ]
});

# Build y analizar
pnpm build
```

### Problema: "Estilos no cargan en producción"

**Causa:** Tailwind CSS v4 puede tener issues.

**Solución:**
```bash
# Verificar que PostCSS esté configurado
cat postcss.config.mjs

# Debe contener:
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### Problema: "localStorage no funciona"

**Causa:** Usuario tiene localStorage deshabilitado.

**Solución:** Agregar fallback en `ordersStore.ts`:
```typescript
const storage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      console.warn('localStorage no disponible');
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {}
  }
};
```

---

## 📊 Comparativa de Performance

| Plataforma | Build Time | Deploy Time | TTL (Time to Live) | CDN |
|------------|------------|-------------|-------------------|-----|
| Vercel | ~2 min | ~30 seg | Inmediato | ✅ Global |
| Netlify | ~2 min | ~30 seg | Inmediato | ✅ Global |
| GitHub Pages | ~3 min | ~1 min | ~5 min | ✅ GitHub CDN |
| Render | ~3 min | ~1 min | ~30 seg | ✅ Global |
| Railway | ~4 min | ~1 min | ~30 seg | ⚠️ Regional |
| VPS | Manual | Manual | Inmediato | ❌ No |

---

## 🎯 Recomendación Final

### Para Desarrollo/Pruebas:
🥇 **Vercel** - Más rápido, mejor DX, preview automático

### Para Producción (Pequeña Escala):
🥇 **Vercel** o **Netlify** - Gratis, confiable, escalable

### Para Producción (Gran Escala):
🥇 **VPS con Nginx** + **Cloudflare CDN** - Más control, mejor performance

### Para Proyectos Open Source:
🥇 **GitHub Pages** - Gratis ilimitado, integración perfecta

---

## 📞 Soporte

Si tienes problemas durante el deployment:

1. **Revisa los logs** de build en la plataforma
2. **Prueba localmente** con `pnpm build && pnpm preview`
3. **Verifica la consola del navegador** en producción
4. **Compara** con el checklist de troubleshooting arriba

---

## 📚 Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Railway Docs](https://docs.railway.app/)

---

**Última actualización:** Febrero 2026  
**Versión de ODIN POS:** 1.0.0  
**Compatibilidad:** Vite 6.x, React 18.x, Node 18+
