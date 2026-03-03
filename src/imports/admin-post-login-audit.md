Eres un desarrollador senior especializado en Next.js 14+ (App Router), SSR, CSR, hydration y manejo de estado.

Estoy trabajando en ODIN POS. Después del login, la aplicación redirige al panel admin, pero la pantalla queda completamente en blanco. Solo carga correctamente cuando hago un refresh manual del navegador.

Necesito que audites y valides TODO el flujo post-login para detectar por qué ocurre este comportamiento.

CONTEXTO TÉCNICO:
- Next.js App Router
- Layout admin con Sidebar dinámico
- Módulos cargados según perfil (enabledModules)
- Uso de context/configService
- Redirección después del login
- El sistema funciona al recargar, pero no en la primera navegación

TU OBJETIVO:

1) Analizar el flujo completo:
   - Login page
   - Función de autenticación
   - Donde se guarda el token/session
   - Redirección (router.push / redirect)
   - Admin layout
   - Carga de enabledModules
   - Context/provider global

2) Verificar si el problema es:
   - Estado no disponible en primer render
   - Hydration mismatch
   - useEffect que depende de algo undefined
   - Middleware bloqueando
   - localStorage usado en servidor
   - Provider mal ubicado en layout
   - Dependencia circular en layout
   - Ruta mal estructurada dentro de (admin)

3) Validaciones obligatorias:

   - Confirmar si el login usa:
       router.push('/admin')
     y si debe usarse:
       router.replace('/admin')

   - Confirmar si el token se guarda en:
       localStorage
       cookies
       context
     y si se intenta leer antes de montar el cliente.

   - Verificar si el AdminLayout depende de:
       user
       businessMode
       enabledModules
     y estos no están listos al primer render.

   - Revisar si hay:
       if (!user) return null;
     que pueda estar causando pantalla blanca.

   - Revisar si algún layout tiene:
       export const dynamic = 'force-dynamic'
     o conflicto entre SSR y client components.

4) Proponer solución robusta:
   - Manejo correcto de auth con loading state
   - Protección de rutas sin bloquear hidratación
   - Uso correcto de "use client"
   - Patrón recomendado para:
       auth + redirect + layout dinámico

5) Si es necesario:
   - Reestructurar el flujo de:
       login → setAuth → esperar estado → redirect
   - Agregar loader mientras se valida sesión
   - Evitar que layout dependa de localStorage en SSR

ENTREGABLES:
- Lista clara del problema detectado
- Explicación técnica de por qué ocurre solo sin refresh
- Código corregido sugerido
- Mejores prácticas recomendadas para evitar este problema en el futuro

IMPORTANTE:
No des soluciones genéricas. Analiza pensando en un proyecto real con App Router, layouts anidados y Sidebar dinámico.