'use client';

import { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { OdinLogo } from '../../components/OdinLogo';
import { LoadingScreen } from '../../components/LoadingScreen';
import { validateCredentials, saveSession } from '../../utils/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña');
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Mostrar pantalla de carga
    setIsLoading(true);
    
    // Simular pequeño delay (como si fuera petición real)
    setTimeout(() => {
      // Validar credenciales
      const response = validateCredentials({
        username: username.trim(),
        password: password.trim(),
      });

      if (!response.success) {
        setIsLoading(false);
        setError(response.message || 'Error al iniciar sesión');
        toast.error(response.message || 'Credenciales inválidas');
        return;
      }

      // Login exitoso
      if (response.user && response.token) {
        saveSession(response.user, response.token, rememberMe);
        toast.success(`¡Bienvenido ${response.user.nombre}!`);
        
        // Redirigir al dashboard
        setTimeout(() => {
          window.history.pushState({}, '', '/admin/dashboard');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, 800);
      }
    }, 800);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Contacta al administrador del sistema para restablecer tu contraseña');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-slate-900/40 rounded-3xl shadow-2xl border border-purple-500/30 p-8 relative overflow-hidden">
          {/* Gradient overlay inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo and title */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-6">
                <OdinLogo size="2xl" showGlow={true} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">ODIN POS</h1>
              <p className="text-slate-400">Inicia sesión para continuar</p>
            </motion.div>

            {/* Login form */}
            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onSubmit={handleLogin} 
              className="space-y-6"
            >
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-red-400 font-medium text-sm">{error}</p>
                      <p className="text-red-400/70 text-xs mt-1">
                        Verifica tus credenciales e intenta nuevamente
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">
                  Usuario o Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(''); // Limpiar error al escribir
                    }}
                    className={`pl-11 bg-slate-950/50 text-white placeholder:text-slate-500 focus:ring-purple-500/20 h-12 rounded-xl transition-all ${
                      error 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-purple-500/30 focus:border-purple-500'
                    }`}
                    placeholder="ej. admin"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(''); // Limpiar error al escribir
                    }}
                    className={`pl-11 bg-slate-950/50 text-white placeholder:text-slate-500 focus:ring-purple-500/20 h-12 rounded-xl transition-all ${
                      error 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-purple-500/30 focus:border-purple-500'
                    }`}
                    placeholder="••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-purple-500/30 bg-slate-950/50 text-purple-500 focus:ring-purple-500/20" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">Recordarme</span>
                </label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-medium h-12 rounded-xl shadow-lg shadow-purple-500/50 transition-all hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </motion.form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-500">
              <p>© 2025 ODIN POS - Todos los derechos reservados</p>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20 -z-10"></div>
      </motion.div>

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
    </motion.div>
  );
}