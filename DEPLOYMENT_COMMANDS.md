# 📝 DEPLOYMENT COMMANDS - Cheat Sheet

## 🔧 Comandos Básicos

### Instalación
```bash
# Instalar dependencias
pnpm install

# O con npm
npm install

# O con yarn
yarn install
```

### Build
```bash
# Build para producción
pnpm build

# Output: ./dist
```

### Preview Local
```bash
# Preview del build (simula producción)
pnpm preview

# Abre: http://localhost:4173
```

### Desarrollo
```bash
# Modo desarrollo
pnpm dev

# Abre: http://localhost:5173
```

---

## 🟢 Vercel

### Instalación CLI
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Deploy
```bash
# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Deploy con variables de entorno
vercel --prod -e VITE_API_URL=https://api.example.com
```

### Ver logs
```bash
vercel logs
```

### Listar deployments
```bash
vercel ls
```

### Remover deployment
```bash
vercel rm nombre-del-deployment
```

### Abrir en navegador
```bash
vercel --prod --open
```

---

## 🔵 Netlify

### Instalación CLI
```bash
npm i -g netlify-cli
```

### Login
```bash
netlify login
```

### Deploy
```bash
# Deploy a preview
netlify deploy

# Deploy a producción
netlify deploy --prod

# Deploy con draft URL
netlify deploy --alias my-test-branch
```

### Ver sitio
```bash
netlify open
```

### Ver logs
```bash
netlify functions:log
```

### Link con repo
```bash
netlify link
```

### Status
```bash
netlify status
```

---

## 🟠 GitHub Pages

### Setup
```bash
# Crear estructura de workflow
mkdir -p .github/workflows

# Crear archivo de workflow (ver QUICK_START_DEPLOYMENT.md)
```

### Deploy
```bash
# Commit y push (workflow se ejecuta automáticamente)
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Ver Actions
```bash
# En GitHub
# https://github.com/TU_USUARIO/TU_REPO/actions
```

---

## 🔴 Render

### Deploy
```bash
# Push a GitHub (Render detecta automáticamente)
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Ver logs (en dashboard)
```bash
# https://dashboard.render.com/
```

---

## 🟣 Railway

### Instalación CLI
```bash
npm i -g @railway/cli
```

### Login
```bash
railway login
```

### Deploy
```bash
# Link con proyecto
railway link

# Deploy
railway up

# Ver logs
railway logs
```

---

## 🐳 Docker (Local)

### Build imagen
```bash
docker build -t odin-pos .
```

### Run contenedor
```bash
docker run -d -p 8080:80 --name odin-pos-container odin-pos
```

### Ver logs
```bash
docker logs odin-pos-container
```

### Stop contenedor
```bash
docker stop odin-pos-container
```

### Remover contenedor
```bash
docker rm odin-pos-container
```

### Remover imagen
```bash
docker rmi odin-pos
```

---

## 🗂️ Git

### Inicializar
```bash
git init
git add .
git commit -m "Initial commit"
```

### Conectar con GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/odin-pos.git
git branch -M main
git push -u origin main
```

### Commits subsecuentes
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

### Ver status
```bash
git status
```

### Ver historial
```bash
git log --oneline
```

---

## 🧹 Limpieza

### Limpiar node_modules
```bash
rm -rf node_modules
pnpm install
```

### Limpiar build
```bash
rm -rf dist
```

### Limpiar caché de pnpm
```bash
pnpm store prune
```

### Limpiar todo
```bash
rm -rf node_modules dist .cache
pnpm install
```

---

## 🔍 Debugging

### Verificar versiones
```bash
node -v
npm -v
pnpm -v
```

### Verificar build
```bash
# Build
pnpm build

# Verificar que dist existe
ls -la dist

# Preview
pnpm preview
```

### Analizar bundle size
```bash
# Instalar visualizer
pnpm add -D rollup-plugin-visualizer

# Ver vite.config.ts en DEPLOYMENT_GUIDE.md

# Build y abrir análisis
pnpm build
```

### Ver errores de TypeScript
```bash
# Check de tipos
pnpm tsc --noEmit

# Lint
pnpm lint
```

---

## 📊 Optimización

### Analizar dependencias
```bash
# Ver dependencias instaladas
pnpm list

# Ver dependencias desactualizadas
pnpm outdated

# Actualizar dependencias
pnpm update
```

### Comprimir build
```bash
# Build con análisis
pnpm build

# Ver tamaño
du -sh dist

# Ver tamaño de archivos individuales
ls -lh dist/assets
```

---

## 🔐 Variables de Entorno

### Crear .env
```bash
# Crear archivo
touch .env

# Agregar variables
echo "VITE_API_URL=https://api.example.com" >> .env
echo "VITE_APP_NAME=ODIN POS" >> .env
```

### Usar en código
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Deploy con env vars

**Vercel:**
```bash
vercel --prod -e VITE_API_URL=https://api.example.com
```

**Netlify:**
```bash
netlify env:set VITE_API_URL https://api.example.com
```

---

## 🚀 Workflows Completos

### Workflow 1: Development → Production (Vercel)
```bash
# 1. Desarrollo local
pnpm dev

# 2. Commit cambios
git add .
git commit -m "Feature: nueva funcionalidad"

# 3. Build local
pnpm build

# 4. Preview local
pnpm preview

# 5. Push a GitHub (opcional)
git push

# 6. Deploy a producción
vercel --prod
```

### Workflow 2: GitHub Pages
```bash
# 1. Desarrollo local
pnpm dev

# 2. Commit cambios
git add .
git commit -m "Feature: nueva funcionalidad"

# 3. Push (workflow automático)
git push origin main

# 4. Esperar ~3 minutos
# 5. Verificar en https://TU_USUARIO.github.io/odin-pos
```

### Workflow 3: Netlify Drop
```bash
# 1. Build local
pnpm build

# 2. Arrastra ./dist a app.netlify.com/drop
# 3. ¡Listo!
```

---

## 🆘 Comandos de Emergencia

### Si algo sale mal:

```bash
# 1. Limpiar todo
rm -rf node_modules dist .cache

# 2. Reinstalar
pnpm install

# 3. Build desde cero
pnpm build

# 4. Preview
pnpm preview

# 5. Si funciona localmente, deploy
vercel --prod
```

### Si el módulo Cocina falla:

```bash
# 1. Verificar que el código tiene las fixes
git pull origin main

# 2. Limpiar localStorage del navegador
# En DevTools: Application → Local Storage → Clear

# 3. Rebuild
rm -rf dist
pnpm build

# 4. Preview
pnpm preview

# 5. Verificar en http://localhost:4173/admin/cocina
```

---

## 📋 Checklist Pre-Deploy

```bash
# ✅ Verificar que build funciona
pnpm build

# ✅ Verificar que preview funciona
pnpm preview

# ✅ Verificar que no hay errores de TypeScript
pnpm tsc --noEmit

# ✅ Verificar que lint pasa
pnpm lint

# ✅ Verificar que Git está limpio
git status

# ✅ Commit cambios
git add .
git commit -m "Ready for production"

# ✅ Deploy
vercel --prod  # o netlify deploy --prod
```

---

## 🎯 Comandos Más Usados

```bash
# Top 5 comandos que usarás más:

1. pnpm dev              # Desarrollo local
2. pnpm build            # Build para producción
3. pnpm preview          # Preview local del build
4. vercel --prod         # Deploy a Vercel
5. git push              # Deploy a GitHub (para Pages/Render/Railway)
```

---

## 📞 Ayuda Rápida

```bash
# Ver ayuda de Vercel
vercel --help

# Ver ayuda de Netlify
netlify --help

# Ver ayuda de Railway
railway --help

# Ver comandos disponibles en package.json
cat package.json | grep "scripts" -A 10
```

---

**💡 Tip:** Guarda este documento como referencia rápida durante tus deploys!
