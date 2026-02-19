# 📚 DEPLOYMENT - Índice de Documentación

Esta carpeta contiene toda la documentación necesaria para deployar ODIN POS en diferentes plataformas.

---

## 📖 Guías Disponibles

### 🚀 [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)
**⏱️ Tiempo de lectura: 5 minutos**

Guía rápida para deployar en menos de 5 minutos. **Empieza aquí si:**
- ✅ Quieres deployar rápidamente
- ✅ Ya sabes qué plataforma usar
- ✅ Necesitas instrucciones concisas

**Contenido:**
- Deployment en 1 comando (Vercel/Netlify)
- Checklist pre-deployment
- Troubleshooting rápido
- Comparativa de plataformas

---

### 📘 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
**⏱️ Tiempo de lectura: 20 minutos**

Guía completa y detallada con todas las plataformas. **Usa esta si:**
- ✅ Es tu primer deployment
- ✅ Quieres entender todas las opciones
- ✅ Necesitas configuración avanzada
- ✅ Vas a usar VPS o Docker

**Contenido:**
- Stack tecnológico completo
- 6 plataformas diferentes (Vercel, Netlify, GitHub Pages, Render, Railway, VPS)
- Configuraciones detalladas
- Variables de entorno
- Troubleshooting extenso
- Comparativas de performance

---

### 📝 [DEPLOYMENT_COMMANDS.md](./DEPLOYMENT_COMMANDS.md)
**⏱️ Tiempo de lectura: 10 minutos**

Cheat sheet con todos los comandos. **Usa esta si:**
- ✅ Ya deployaste antes
- ✅ Necesitas un comando específico
- ✅ Quieres referencia rápida
- ✅ Estás debuggeando

**Contenido:**
- Comandos para cada plataforma
- Git workflows
- Debugging commands
- Optimización
- Comandos de emergencia

---

## 🔧 Archivos de Configuración

### vercel.json
Configuración lista para Vercel:
- ✅ Rewrites para SPA routing
- ✅ Headers de cache optimizados
- ✅ Build commands configurados

### netlify.toml
Configuración lista para Netlify:
- ✅ Redirects para SPA routing
- ✅ Headers de seguridad
- ✅ Cache optimizado
- ✅ Build settings

### render.yaml
Configuración lista para Render:
- ✅ Static site settings
- ✅ Build y publish configurados
- ✅ Routes para SPA

### deploy.sh
Script interactivo de deployment:
- ✅ Menú con 7 opciones
- ✅ Soporta todas las plataformas
- ✅ Build y preview automático
- ✅ Colores y logging

**Uso:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### .gitignore
Archivo ya configurado para:
- ✅ node_modules
- ✅ dist
- ✅ .env
- ✅ Logs
- ✅ Cache

---

## 🎯 ¿Qué Guía Usar?

### Flowchart de Decisión:

```
¿Primera vez deployando?
  ├─ Sí → DEPLOYMENT_GUIDE.md (completa)
  └─ No → ¿Qué necesitas?
      ├─ Deploy rápido → QUICK_START_DEPLOYMENT.md
      ├─ Comando específico → DEPLOYMENT_COMMANDS.md
      └─ Troubleshooting → DEPLOYMENT_GUIDE.md (sección final)
```

### Por Situación:

| Situación | Guía Recomendada |
|-----------|------------------|
| **Primera vez con deployment** | DEPLOYMENT_GUIDE.md |
| **Tengo 5 minutos para deployar** | QUICK_START_DEPLOYMENT.md |
| **Ya deployé pero olvidé el comando** | DEPLOYMENT_COMMANDS.md |
| **El deployment falló** | DEPLOYMENT_GUIDE.md (Troubleshooting) |
| **Quiero comparar plataformas** | DEPLOYMENT_GUIDE.md o QUICK_START |
| **Necesito configurar VPS** | DEPLOYMENT_GUIDE.md |
| **Quiero automatizar con script** | usar deploy.sh |

---

## 🚀 Quick Start en 3 Pasos

### Opción A: Más Rápida (Vercel CLI)
```bash
# 1. Instalar
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. ¡Listo!
```

### Opción B: Con GitHub (Recomendado)
```bash
# 1. Push a GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Conectar con Vercel/Netlify (ver QUICK_START)

# 3. Auto-deploy en cada push
```

### Opción C: Script Automatizado
```bash
# 1. Ejecutar script
chmod +x deploy.sh
./deploy.sh

# 2. Seleccionar plataforma

# 3. ¡Listo!
```

---

## 📊 Comparativa de Plataformas

| Plataforma | Dificultad | Tiempo | Gratis | Mejor Para |
|------------|------------|--------|--------|------------|
| **Vercel** | ⭐ | 2 min | ✅ | Producción rápida |
| **Netlify** | ⭐ | 3 min | ✅ | Drag & drop |
| **GitHub Pages** | ⭐⭐ | 5 min | ✅ | Open source |
| **Render** | ⭐ | 4 min | ✅* | Backend futuro |
| **Railway** | ⭐⭐ | 5 min | ✅* | Docker/Containers |
| **VPS** | ⭐⭐⭐ | 30 min | ❌ | Control total |

*Con limitaciones en plan gratuito

**Recomendación:** Vercel para la mayoría de casos

---

## 🐛 Troubleshooting Rápido

### Error: "404 al recargar página"
➡️ Ver DEPLOYMENT_GUIDE.md → Troubleshooting → 404

### Error: "Módulo Cocina no carga"
➡️ Ya está corregido en el código (skipHydration)

### Error: "Build failed"
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

### Error: "White screen"
➡️ Ver DEPLOYMENT_GUIDE.md → Troubleshooting

---

## 📞 Recursos Adicionales

### Documentación Oficial:
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [GitHub Pages](https://docs.github.com/en/pages)

### Dentro de este Proyecto:
- [FIGMA_SITES_DEBUG_GUIDE.md](./FIGMA_SITES_DEBUG_GUIDE.md) - Problemas específicos con Figma Sites
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del proyecto
- [README.md](./README.md) - Documentación general

---

## ✅ Checklist Pre-Deployment

Antes de deployar, verifica:

```bash
# 1. Build funciona
pnpm build

# 2. Preview funciona
pnpm preview

# 3. No hay errores en consola
# Abre http://localhost:4173 y revisa DevTools

# 4. Cocina funciona
# Navega a http://localhost:4173/admin/cocina

# 5. Git está limpio
git status

# 6. Deploy!
vercel --prod  # o tu plataforma preferida
```

---

## 🎓 Flujo Recomendado para Principiantes

1. **Lee primero:** QUICK_START_DEPLOYMENT.md (5 min)
2. **Elige plataforma:** Vercel o Netlify
3. **Sigue la guía:** Paso a paso en QUICK_START
4. **Si hay problemas:** Consulta DEPLOYMENT_GUIDE.md → Troubleshooting
5. **Para comandos específicos:** Usa DEPLOYMENT_COMMANDS.md como referencia

---

## 🏆 Mejores Prácticas

1. ✅ **Siempre testea localmente** con `pnpm build && pnpm preview`
2. ✅ **Usa Git** para versionar tu código
3. ✅ **Conecta con GitHub** para auto-deploy
4. ✅ **Configura dominio custom** después del primer deploy
5. ✅ **Monitorea los builds** en el dashboard de la plataforma
6. ✅ **Mantén un .env.example** si usas variables de entorno

---

## 📈 Próximos Pasos Después del Deployment

1. **Configurar dominio personalizado**
   - Ver docs de tu plataforma

2. **Habilitar HTTPS**
   - Automático en Vercel/Netlify/GitHub Pages
   - Manual en VPS (Let's Encrypt)

3. **Configurar Analytics** (opcional)
   - Vercel Analytics
   - Google Analytics
   - Plausible

4. **Optimizar Performance**
   - Ver DEPLOYMENT_GUIDE.md → Bundle Size

5. **Configurar CI/CD**
   - Auto-deploy ya está configurado con GitHub

---

## 🆘 ¿Necesitas Ayuda?

1. **Revisa las guías** en este índice
2. **Busca en Troubleshooting** de DEPLOYMENT_GUIDE.md
3. **Verifica los logs** de build en tu plataforma
4. **Prueba localmente** con `pnpm preview`
5. **Compara** con los archivos de configuración incluidos

---

## 📌 Resumen de Archivos

```
deployment/
├── QUICK_START_DEPLOYMENT.md    # ⚡ Inicio rápido (5 min)
├── DEPLOYMENT_GUIDE.md          # 📘 Guía completa (20 min)
├── DEPLOYMENT_COMMANDS.md       # 📝 Cheat sheet
├── DEPLOYMENT_INDEX.md          # 📚 Este archivo
├── vercel.json                  # ⚙️ Config Vercel
├── netlify.toml                 # ⚙️ Config Netlify
├── render.yaml                  # ⚙️ Config Render
├── deploy.sh                    # 🤖 Script automatizado
└── .gitignore                   # 🚫 Archivos ignorados
```

---

**💡 Recomendación Final:**

Si es tu primera vez, empieza con **QUICK_START_DEPLOYMENT.md** y usa **Vercel**. Es la forma más rápida de tener tu sitio en línea.

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0.0  
**Proyecto:** ODIN POS
