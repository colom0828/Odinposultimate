# ⚡ QUICK START - Deployment en 5 Minutos

## 🎯 Deployment más Rápido (Vercel)

### Opción 1: Un solo comando (si tienes Git configurado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy (desde la raíz del proyecto)
vercel --prod
```

¡Listo! Tu sitio estará en línea en ~2 minutos.

---

## 🚀 Deployment con Script Automatizado

```bash
# 1. Dar permisos al script
chmod +x deploy.sh

# 2. Ejecutar
./deploy.sh

# 3. Seleccionar plataforma (1-7)
```

El script te guiará paso a paso.

---

## 📋 Checklist Pre-Deployment

Antes de deployar, verifica:

- [ ] `pnpm install` funciona sin errores
- [ ] `pnpm build` completa exitosamente
- [ ] `pnpm preview` muestra el sitio correctamente en http://localhost:4173
- [ ] No hay errores en la consola del navegador
- [ ] El módulo Cocina funciona correctamente
- [ ] localStorage guarda datos (prueba crear una orden)

---

## 🟢 Vercel (Más Rápido - Recomendado)

### Con GitHub
1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Click "New Project" → Importa tu repo
4. Click "Deploy"

**Tiempo:** ~3 minutos

### Sin GitHub (CLI)
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Tiempo:** ~2 minutos

---

## 🔵 Netlify (Alternativa Excelente)

### Con GitHub
1. Sube el código a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Click "Add new site" → Importa repo
4. Build: `pnpm build` | Publish: `dist`
5. Deploy

**Tiempo:** ~3 minutos

### Sin GitHub (Drag & Drop)
```bash
pnpm build
```
Arrastra la carpeta `dist` a [app.netlify.com/drop](https://app.netlify.com/drop)

**Tiempo:** ~2 minutos

---

## 🟠 GitHub Pages (Gratis Ilimitado)

### Setup Automático

1. **Crea el workflow:**
```bash
mkdir -p .github/workflows
```

2. **Copia este contenido** en `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

3. **Actualiza vite.config.ts:**
```typescript
export default defineConfig({
  // ... config existente
  base: '/nombre-de-tu-repo/', // ⬅️ IMPORTANTE
})
```

4. **Push a GitHub:**
```bash
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

5. **Configura GitHub Pages:**
- Ve a tu repo → Settings → Pages
- Source: GitHub Actions
- Save

**Tiempo:** ~5 minutos  
**URL:** `https://TU_USUARIO.github.io/nombre-de-tu-repo/`

---

## 🔴 Render (Opción Simple)

1. Sube a GitHub
2. Ve a [render.com](https://render.com)
3. New → Static Site
4. Conecta tu repo
5. Build: `pnpm install && pnpm build`
6. Publish: `dist`
7. Create

**Tiempo:** ~4 minutos

---

## 🟣 Railway (Con Docker)

1. **Crea Dockerfile** en la raíz:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Ve a [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Selecciona tu repo
5. Deploy

**Tiempo:** ~5 minutos

---

## 🧪 Testing Local Antes de Deploy

```bash
# Build
pnpm build

# Preview (simula producción)
pnpm preview

# Abre http://localhost:4173
```

**Checklist de pruebas:**
- ✅ Home carga
- ✅ Login funciona
- ✅ Dashboard se muestra
- ✅ Navegar a Cocina funciona
- ✅ Crear una orden mock funciona
- ✅ Reportes cargan
- ✅ No hay errores en consola

---

## 🐛 Problemas Comunes

### ❌ Error: "404 al recargar página"
**Causa:** Falta configuración SPA routing  
**Solución:** Ya incluida en `vercel.json`, `netlify.toml`, etc.

### ❌ Error: "pnpm not found"
**Solución:**
```bash
npm install -g pnpm
```

### ❌ Error: "Build failed"
**Solución:**
```bash
# Limpiar caché
rm -rf node_modules dist
pnpm install
pnpm build
```

### ❌ Error: "White screen in production"
**Solución:**
1. Abre DevTools (F12)
2. Revisa errores en Console
3. Verifica que `base` en `vite.config.ts` sea correcto
4. Asegúrate que los archivos estén en la carpeta `dist`

---

## 📊 Comparativa Rápida

| Plataforma | Tiempo | Dificultad | Gratis |
|------------|--------|------------|--------|
| Vercel CLI | 2 min | ⭐ | ✅ |
| Netlify Drag & Drop | 2 min | ⭐ | ✅ |
| Vercel GitHub | 3 min | ⭐ | ✅ |
| Netlify GitHub | 3 min | ⭐ | ✅ |
| Render | 4 min | ⭐ | ✅* |
| GitHub Pages | 5 min | ⭐⭐ | ✅ |
| Railway | 5 min | ⭐⭐ | ✅* |

**✅*** = Con limitaciones en plan gratuito

---

## 🎯 Mi Recomendación

### Para Pruebas Rápidas:
```bash
npm i -g vercel
vercel
```

### Para Producción:
1. Sube a GitHub
2. Conecta con Vercel/Netlify
3. Deploy automático en cada push

### Para Proyectos Open Source:
- GitHub Pages (gratis ilimitado)

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa la [Guía Completa](./DEPLOYMENT_GUIDE.md)
2. Verifica [Troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting)
3. Revisa los logs de build en la plataforma

---

## 📞 URLs Útiles

- Vercel Dashboard: https://vercel.com/dashboard
- Netlify Dashboard: https://app.netlify.com/
- GitHub Pages: https://github.com/TU_USUARIO/TU_REPO/settings/pages
- Render Dashboard: https://dashboard.render.com/
- Railway Dashboard: https://railway.app/dashboard

---

**¡Tu primera deployment debería tomar menos de 5 minutos!** 🚀
