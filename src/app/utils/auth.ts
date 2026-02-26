/**
 * ODIN POS - Utilidades de Autenticación
 */

// ==========================================
// USUARIOS HARDCODEADOS (Temporal - Desarrollo)
// ==========================================
// Cuando conectes con backend, elimina esto y usa la API

const USERS_DB = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@odinpos.com',
    password: 'admin123', // ⚠️ En producción NUNCA guardes contraseñas en texto plano
    nombre: 'Administrador',
    rol: 'admin',
    activo: true,
  },
  {
    id: '2',
    username: 'vendedor',
    email: 'vendedor@odinpos.com',
    password: 'vendedor123',
    nombre: 'Vendedor Demo',
    rol: 'vendedor',
    activo: true,
  },
  {
    id: '3',
    username: 'cajero',
    email: 'cajero@odinpos.com',
    password: 'cajero123',
    nombre: 'Cajero Demo',
    rol: 'cajero',
    activo: true,
  },
];

// ==========================================
// TIPOS
// ==========================================

export interface User {
  id: string;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

/**
 * Validar credenciales contra usuarios hardcodeados
 * ⚠️ Solo para desarrollo - Reemplazar con API cuando tengas backend
 */
export function validateCredentials(credentials: LoginCredentials): AuthResponse {
  const { username, password } = credentials;

  // Buscar usuario por username o email
  const user = USERS_DB.find(
    (u) =>
      (u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase()) &&
      u.password === password
  );

  if (!user) {
    return {
      success: false,
      message: 'Usuario o contraseña incorrectos',
    };
  }

  if (!user.activo) {
    return {
      success: false,
      message: 'Usuario desactivado. Contacte al administrador.',
    };
  }

  // Usuario válido - remover password antes de retornar
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    message: 'Inicio de sesión exitoso',
    user: userWithoutPassword,
    token: generateMockToken(user.id), // Token temporal
  };
}

/**
 * Validar credenciales usando API del backend
 * ⚠️ Usar esto cuando tengas backend implementado
 */
export async function validateCredentialsAPI(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al iniciar sesión',
      };
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión con el servidor',
    };
  }
}

/**
 * Generar token temporal (mock)
 * En producción esto lo genera el backend con JWT
 */
function generateMockToken(userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `mock_token_${userId}_${timestamp}_${random}`;
}

/**
 * Guardar sesión en localStorage
 */
export function saveSession(user: User, token: string, rememberMe: boolean = false): void {
  const sessionData = {
    user,
    token,
    timestamp: Date.now(),
    rememberMe,
  };

  localStorage.setItem('auth_session', JSON.stringify(sessionData));
  localStorage.setItem('auth_token', token);
  localStorage.setItem('current_user', JSON.stringify(user));
  
  // Para el sistema de inactividad
  localStorage.setItem('odin-isAuthenticated', 'true');
  localStorage.setItem('odin-last-activity', Date.now().toString());
  localStorage.setItem('odin-user', JSON.stringify(user));
}

/**
 * Obtener sesión actual
 */
export function getSession(): { user: User; token: string } | null {
  try {
    const sessionStr = localStorage.getItem('auth_session');
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);

    // Validar que no haya expirado (24 horas si no es "recordarme")
    if (!session.rememberMe) {
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas
      if (Date.now() - session.timestamp > expirationTime) {
        clearSession();
        return null;
      }
    }

    return {
      user: session.user,
      token: session.token,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verificar si hay sesión activa
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Obtener usuario actual
 */
export function getCurrentUser(): User | null {
  const session = getSession();
  return session ? session.user : null;
}

/**
 * Cerrar sesión
 */
export function clearSession(): void {
  localStorage.removeItem('auth_session');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  
  // Para el sistema de inactividad
  localStorage.removeItem('odin-isAuthenticated');
  localStorage.removeItem('odin-last-activity');
  localStorage.removeItem('odin-user');
}

/**
 * Logout completo
 */
export function logout(): void {
  clearSession();
  window.location.href = '/login';
}

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Obtener usuarios disponibles (solo para desarrollo)
 */
export function getAvailableUsers() {
  return USERS_DB.map(({ password, ...user }) => user);
}

/**
 * Verificar rol del usuario
 */
export function hasRole(requiredRole: string | string[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.rol);
  }

  return user.rol === requiredRole;
}

/**
 * Verificar si es administrador
 */
export function isAdmin(): boolean {
  return hasRole('admin');
}