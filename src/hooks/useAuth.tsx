import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../api/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'normal' | 'business';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresCode?: boolean; message?: string }>;
  verifyCode: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la app
    const savedToken = localStorage.getItem('banorte_token');
    if (savedToken) {
      setToken(savedToken);
      // Verificar si el token sigue siendo válido
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await apiClient.get('/api/v1/auth/me');
      const userData = response.data.data;

      const user: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        userType: userData.account_type_id === 'enterprise' ? 'business' : 'normal'
      };

      setUser(user);
      setToken(tokenToVerify);
    } catch (error) {
      // Token inválido, intentar refresh
      const refreshSuccess = await refreshToken();
      if (!refreshSuccess) {
        // Token inválido, limpiar datos
        localStorage.removeItem('banorte_token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await apiClient.post('/api/v1/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        return {
          success: true,
          requiresCode: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Credenciales inválidas'
        };
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al conectar con el servidor'
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await apiClient.post('/api/v1/auth/verify-code', {
        email,
        code
      });

      if (response.data.success) {
        const token = response.data.data.access_token;
        const userData = response.data.data.user;

        const user: User = {
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          userType: userData.account_type_id === 'enterprise' ? 'business' : 'normal'
        };

        // Guardar en localStorage
        localStorage.setItem('banorte_token', token);
        console.log('Token guardado:', token);
        console.log('Usuario guardado:', user);

        // Actualizar estado - IMPORTANTE: setToken primero, luego setUser
        setToken(token);
        setUser(user);

        // Forzar re-renderizado verificando que el estado se actualice
        console.log('Estado actualizado - isAuthenticated debería ser true ahora');

        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error('Error al verificar código:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await apiClient.post('/api/v1/auth/refresh');

      if (response.data.success) {
        const newToken = response.data.data.accesstoken;
        localStorage.setItem('banorte_token', newToken);
        setToken(newToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Revoke MCP sessions for all chats if needed
      // This would require getting all chat IDs and calling revoke for each
      // For now, just clear local storage
      localStorage.removeItem('banorte_token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local data even if MCP revoke fails
      localStorage.removeItem('banorte_token');
      setToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    verifyCode,
    logout,
    loading,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
