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
      const response = await apiClient.post('/api/v1/auth/me');
      const userData = response.data.data;

      const user: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        userType: userData.accounttypeid === 2 ? 'business' : 'normal'
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

      // Usuario de prueba temporal
      const testUsers = [
        { email: 'demo@banorte.com', password: 'demo123', name: 'Usuario Demo', accounttypeid: 1 },
        { email: 'empresario@banorte.com', password: 'empresa123', name: 'Empresario Demo', accounttypeid: 2 },
        { email: 'admin@banorte.com', password: 'admin123', name: 'Admin Demo', accounttypeid: 2 }
      ];

      const user = testUsers.find(u => u.email === email && u.password === password);

      if (user) {
        // Simular respuesta de API exitosa
        return {
          success: true,
          requiresCode: true,
          message: 'Se envió un código de verificación a tu correo.'
        };
      }

      // Si no es usuario de prueba, intentar con API real
      try {
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
            message: 'Credenciales inválidas'
          };
        }
      } catch (apiError) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Usuarios de prueba
      const testUsers = [
        { email: 'demo@banorte.com', password: 'demo123', name: 'Usuario Demo', accounttypeid: 1 },
        { email: 'empresario@banorte.com', password: 'empresa123', name: 'Empresario Demo', accounttypeid: 2 },
        { email: 'admin@banorte.com', password: 'admin123', name: 'Admin Demo', accounttypeid: 2 }
      ];

      const user = testUsers.find(u => u.email === email);

      if (user && code === '123456') {
        // Simular respuesta exitosa para usuarios de prueba
        const mockToken = `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const userData: User = {
          id: `demo_${Date.now()}`,
          name: user.name,
          email: user.email,
          userType: user.accounttypeid === 2 ? 'business' : 'normal'
        };

        localStorage.setItem('banorte_token', mockToken);
        setToken(mockToken);
        setUser(userData);

        return true;
      }

      // Si no es usuario de prueba, intentar con API real
      try {
        const response = await apiClient.post('/api/v1/auth/verify-code', {
          email,
          code
        });

        if (response.data.success) {
          const token = response.data.data.accesstoken;
          const userData = response.data.data.user;

          const user: User = {
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            userType: userData.accounttypeid === 2 ? 'business' : 'normal'
          };

          localStorage.setItem('banorte_token', token);
          setToken(token);
          setUser(user);

          return true;
        } else {
          return false;
        }
      } catch (apiError) {
        console.error('Error en API real:', apiError);
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
