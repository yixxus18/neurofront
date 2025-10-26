import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VerificationPageProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

const VerificationPage = ({ email, onBack, onSuccess }: VerificationPageProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { verifyCode, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('El código debe tener 6 dígitos');
      return;
    }

    toast.loading('Verificando código...', { id: 'verify' });
    const success = await verifyCode(email, verificationCode);

    if (success) {
      toast.success('¡Bienvenido!', { id: 'verify' });
      onSuccess();
    } else {
      toast.error('Código inválido o expirado', { id: 'verify' });
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
          {/* Botón volver */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-banorte-gray-600 hover:text-banorte-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al login</span>
          </button>

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
            <h1 className="text-3xl font-bold text-banorte-gray-800 mb-2">Verificación</h1>
            <p className="text-banorte-gray-500">Banorte - Dashboard Financiero</p>
          </div>

          {/* Contenido de verificación */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-banorte-gray-800 mb-2">
                Código de Verificación
              </h3>
              <p className="text-sm text-banorte-gray-600 mb-4">
                Se envió un código de 6 dígitos a <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 border border-banorte-gray-300 rounded-xl focus:ring-2 focus:ring-banorte-red focus:border-transparent transition-all duration-200 bg-banorte-gray-50 text-center text-3xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-banorte-gray-500 mt-2 text-center">
                  Ingresa el código de 6 dígitos enviado a tu correo
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-gradient-to-r from-banorte-red to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-banorte-red focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Verificando...
                  </>
                ) : (
                  'Verificar Código'
                )}
              </motion.button>
            </form>

            {/* Información adicional */}
            <div className="text-center">
              <p className="text-sm text-banorte-gray-500">
                ¿No recibiste el código? {' '}
                <button
                  onClick={() => toast('Reenviando código...', { duration: 2000 })}
                  className="text-banorte-red hover:text-red-600 font-medium"
                >
                  Reenviar
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPage;