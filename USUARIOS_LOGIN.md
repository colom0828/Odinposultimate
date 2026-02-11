# 🔐 USUARIOS DISPONIBLES - ODIN POS

## 📋 Sistema de Autenticación Implementado

Tu login ahora **VALIDA CREDENCIALES REALES**. Ya no puedes entrar con cualquier usuario.

---

## 👥 **Usuarios Disponibles para Pruebas**

### 1️⃣ **Administrador**
- **Usuario:** `admin`
- **Email:** `admin@odinpos.com`
- **Contraseña:** `admin123`
- **Rol:** Administrador
- **Permisos:** Acceso total al sistema

### 2️⃣ **Vendedor**
- **Usuario:** `vendedor`
- **Email:** `vendedor@odinpos.com`
- **Contraseña:** `vendedor123`
- **Rol:** Vendedor
- **Permisos:** Acceso a ventas y productos

### 3️⃣ **Cajero**
- **Usuario:** `cajero`
- **Email:** `cajero@odinpos.com`
- **Contraseña:** `cajero123`
- **Rol:** Cajero
- **Permisos:** Acceso a caja y ventas

---

## ✨ **Características Implementadas**

### ✅ Validación de Credenciales
- ❌ Rechaza usuarios inexistentes
- ❌ Rechaza contraseñas incorrectas
- ❌ Rechaza usuarios desactivados
- ✅ Valida email o username
- ✅ Notificaciones toast de error/éxito

### ✅ Protección de Rutas
- 🔒 No puedes acceder a `/admin/*` sin login
- 🔒 Redirige automáticamente al login si no estás autenticado
- 🔒 Verifica sesión en cada carga de página

### ✅ Gestión de Sesión
- 💾 Guarda sesión en localStorage
- ⏰ Sesión expira en 24 horas (si no marcas "Recordarme")
- ♾️ Sesión permanente si marcas "Recordarme"
- 👤 Muestra usuario actual en el header
- 🎭 Muestra rol del usuario

### ✅ Logout Funcional
- 🚪 Botón "Cerrar Sesión" limpia la sesión
- 🔄 Redirige automáticamente al login
- 🗑️ Elimina todos los datos de autenticación

---

## 🧪 **Cómo Probar**

### Caso 1: Login Exitoso
1. Ir a `/login`
2. Usuario: `admin`
3. Contraseña: `admin123`
4. ✅ Debería entrar y ver "¡Bienvenido Administrador!"

### Caso 2: Contraseña Incorrecta
1. Usuario: `admin`
2. Contraseña: `incorrecta`
3. ❌ Error: "Usuario o contraseña incorrectos"

### Caso 3: Usuario No Existe
1. Usuario: `noexisto`
2. Contraseña: `cualquiera`
3. ❌ Error: "Usuario o contraseña incorrectos"

### Caso 4: Protección de Rutas
1. Abre `/admin/dashboard` sin estar logueado
2. ❌ Redirige automáticamente a `/login`

### Caso 5: Logout
1. Estando logueado, click en "Cerrar Sesión"
2. ✅ Limpia sesión y redirige a login
3. ✅ No puedes volver a `/admin/*` sin login nuevo

---

## 🔧 **Ubicación del Código**

### Utilidades de Autenticación
**Archivo:** `/src/app/utils/auth.ts`

Funciones disponibles:
```typescript
// Validar credenciales (modo desarrollo)
validateCredentials(credentials)

// Validar con API (cuando tengas backend)
validateCredentialsAPI(credentials)

// Guardar sesión
saveSession(user, token, rememberMe)

// Obtener sesión actual
getSession()

// Verificar si está autenticado
isAuthenticated()

// Obtener usuario actual
getCurrentUser()

// Cerrar sesión
logout()

// Verificar rol
hasRole('admin')
isAdmin()
```

### Página de Login
**Archivo:** `/src/app/(auth)/login/page.tsx`
- Validación de campos vacíos
- Validación de credenciales
- Notificaciones toast
- Animaciones de loading

### Layout Admin (Protección)
**Archivo:** `/src/app/(admin)/layout.tsx`
- Verifica autenticación en cada carga
- Redirige al login si no está autenticado

### Header (Usuario y Logout)
**Archivo:** `/src/app/components/AdminHeader.tsx`
- Muestra usuario actual y rol
- Botón de logout funcional

---

## 🔄 **Migración a Backend Real**

Cuando tengas tu backend listo, solo debes:

### 1. Cambiar el método de validación
```typescript
// En login/page.tsx
// Cambiar de:
const response = validateCredentials(credentials);

// A:
const response = await validateCredentialsAPI(credentials);
```

### 2. Configurar API URL
```env
# .env.local
VITE_API_URL=http://localhost:3000/api
```

### 3. El backend debe responder:
```json
// POST /api/auth/login
{
  "success": true,
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@odinpos.com",
    "nombre": "Administrador",
    "rol": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔐 **Seguridad Implementada**

### ✅ Nivel Frontend (Actual)
- Validación de credenciales
- Protección de rutas
- Gestión de sesión
- Expiración de token
- Logout seguro

### ⚠️ Falta (Para Producción con Backend)
- ❌ Hashing de contraseñas (bcrypt)
- ❌ JWT real desde backend
- ❌ Refresh tokens
- ❌ Rate limiting (límite de intentos)
- ❌ Verificación de email
- ❌ 2FA (autenticación de dos factores)

---

## 📝 **Notas Importantes**

⚠️ **Solo para Desarrollo:**
- Las contraseñas están en texto plano en el código
- Los usuarios están hardcodeados en `/src/app/utils/auth.ts`
- Esto es TEMPORAL hasta que conectes con tu backend

✅ **Para Producción:**
- NUNCA guardes contraseñas en texto plano
- NUNCA expongas contraseñas en el frontend
- Usa hashing (bcrypt, argon2) en el backend
- Usa JWT firmados desde el backend

---

## 🎯 **Próximos Pasos**

1. ✅ **Probar el login** con los usuarios de arriba
2. ✅ **Verificar** que no puedas entrar con usuarios falsos
3. ✅ **Probar logout** y protección de rutas
4. 🔄 **Cuando tengas backend:** Cambiar a `validateCredentialsAPI`
5. 🗄️ **Migrar usuarios** de hardcoded a base de datos

---

**¿Dudas?** 
- Usuarios en: `/src/app/utils/auth.ts` (línea 10-30)
- Login en: `/src/app/(auth)/login/page.tsx`
- Protección en: `/src/app/(admin)/layout.tsx`
