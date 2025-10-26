import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
            <p className="text-banorte-gray-500">Inicia sesión para continuar</p>
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


            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-banorte-red to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-red-700 focus:ring-2 focus:ring-banorte-red focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Iniciando sesión...
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn size={20} />
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
