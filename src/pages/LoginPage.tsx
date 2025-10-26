import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2, UserPlus, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      toast.loading('Iniciando sesión...', { id: 'login' });
      const result = await login(email, password);

      if (result.success && result.requiresCode) {
        toast.success(result.message || 'Código enviado', { id: 'login' });
        onLoginSuccess(email);
      } else if (!result.success) {
        toast.error(result.message || 'Error al iniciar sesión', { id: 'login' });
      }
    } else {
      if (!username || !email || !password || !confirmPassword) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }

      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      toast.loading('Creando cuenta...', { id: 'register' });

      try {
        // Intentar registro con API (aunque no esté documentado, es buena práctica)
        const response = await fetch((import.meta as any).env.VITE_API_URL + '/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: username,
            email,
            password,
            password_confirmation: confirmPassword
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success('¡Cuenta creada exitosamente!', { id: 'register' });
          setIsLogin(true);
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          toast.error(data.message || 'Error al crear la cuenta', { id: 'register' });
        }
      } catch (error) {
        console.error('Error en registro:', error);
        toast.error('Error al conectar con el servidor. Inténtalo de nuevo.', { id: 'register' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-banorte-gray-50 via-white to-banorte-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-banorte-gray-200">
          {/* Logo de Banorte */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-banorte-red to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-2xl">B</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-banorte-gray-800 mb-2">Banorte</h1>
            <p className="text-banorte-gray-500">Dashboard Financiero Inteligente</p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex bg-banorte-gray-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-banorte-red text-white shadow-md'
                  : 'text-banorte-gray-600 hover:text-banorte-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-banorte-red text-white shadow-md'
                  : 'text-banorte-gray-600 hover:text-banorte-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <UserPlus size={18} />
                <span>Registrarse</span>
              </div>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-banorte-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-banorte-gray-300 rounded-xl focus:ring-2 focus:ring-banorte-red focus:border-transparent transition-all duration-200 bg-banorte-gray-50"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-banorte-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-banorte-gray-300 rounded-xl focus:ring-2 focus:ring-banorte-red focus:border-transparent transition-all duration-200 bg-banorte-gray-50"
                  placeholder="Tu nombre de usuario"
                  disabled={loading}
                />
              </motion.div>
            )}


            <div>
              <label htmlFor="password" className="block text-sm font-medium text-banorte-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-banorte-gray-300 rounded-xl focus:ring-2 focus:ring-banorte-red focus:border-transparent transition-all duration-200 bg-banorte-gray-50"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-banorte-gray-400 hover:text-banorte-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-banorte-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-banorte-gray-300 rounded-xl focus:ring-2 focus:ring-banorte-red focus:border-transparent transition-all duration-200 bg-banorte-gray-50"
                    placeholder="Confirma tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-banorte-gray-400 hover:text-banorte-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-banorte-red to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-banorte-red focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  {isLogin ? (
                    <>
                      <LogIn size={20} />
                      <span>Iniciar Sesión</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Crear Cuenta</span>
                    </>
                  )}
                </div>
              )}
            </motion.button>

          </form>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-banorte-gray-500">
              ¿Necesitas ayuda? Contacta a{' '}
              <a href="#" className="text-banorte-red hover:text-red-600 font-medium">
                soporte técnico
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
