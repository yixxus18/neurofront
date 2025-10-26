import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isBusiness = user?.userType === 'business';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isBusiness ? 'bg-banorte-red' : 'bg-white'} shadow-sm border-b border-banorte-gray-200 px-6 py-4`}
    >
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 ${isBusiness ? 'bg-white' : 'bg-banorte-red'} rounded-full flex items-center justify-center`}>
            <span className={`font-bold text-lg ${isBusiness ? 'text-banorte-red' : 'text-white'}`}>B</span>
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isBusiness ? 'text-white' : 'text-banorte-gray-800'}`}>Banorte</h1>
            <p className={`text-sm ${isBusiness ? 'text-red-200' : 'text-banorte-gray-500'}`}>
              {isBusiness ? 'Plataforma Empresarial' : 'Dashboard Financiero'}
            </p>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg ${isBusiness ? 'hover:bg-red-700' : 'hover:bg-banorte-gray-100'} transition-colors`}
          >
            {isMobileMenuOpen ? <X size={24} className={isBusiness ? 'text-white' : ''} /> : <Menu size={24} className={isBusiness ? 'text-white' : ''} />}
          </button>
        </div>

        {/* Información del usuario - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <p className={`text-sm font-medium ${isBusiness ? 'text-white' : 'text-banorte-gray-800'}`}>
              {user?.name || 'Usuario'}
            </p>
            <p className={`text-xs ${isBusiness ? 'text-red-200' : 'text-banorte-gray-500'}`}>
              {user?.email || 'usuario@banorte.com'}
            </p>
          </div>
          <button
            onClick={logout}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isBusiness ? 'text-white hover:bg-red-700' : 'text-banorte-gray-600 hover:text-banorte-red hover:bg-red-50'}`}>
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Menú móvil expandido */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden mt-4 pt-4 border-t border-red-300"
        >
          <div className="space-y-3">
            <div className="text-center">
              <p className={`text-sm font-medium ${isBusiness ? 'text-white' : 'text-banorte-gray-800'}`}>
                {user?.name || 'Usuario'}
              </p>
              <p className={`text-xs ${isBusiness ? 'text-red-200' : 'text-banorte-gray-500'}`}>
                {user?.email || 'usuario@banorte.com'}
              </p>
            </div>
            <button
              onClick={logout}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isBusiness ? 'text-white hover:bg-red-700' : 'text-banorte-gray-600 hover:text-banorte-red hover:bg-red-50'}`}>
              <LogOut size={18} />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
