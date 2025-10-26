import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import DashboardPage from './pages/DashboardPage';
import AssistantWindow from './components/assistant/AssistantWindow';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-banorte-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-banorte-red rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <p className="text-banorte-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleLoginSuccess = (email: string) => {
    setPendingEmail(email);
    setShowVerification(true);
  };

  const handleVerificationSuccess = () => {
    // El estado se actualizará automáticamente cuando useAuth detecte el token
    // Solo limpiamos el estado local de verificación
    setShowVerification(false);
    setPendingEmail('');
  };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setPendingEmail('');
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <DashboardPage />
          <AssistantWindow />
        </>
      ) : showVerification ? (
        <VerificationPage
          email={pendingEmail}
          onBack={handleBackToLogin}
          onSuccess={handleVerificationSuccess}
        />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#E31D1A',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
