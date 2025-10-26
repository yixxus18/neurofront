import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import Header from '../components/dashboard/Header';
import MetricCard from '../components/ui/MetricCard';
import SpendingChart from '../components/dashboard/Charts/SpendingChart';
import SavingsChart from '../components/dashboard/Charts/SavingsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ChatHistory from '../components/dashboard/ChatHistory';
import BusinessMetrics from '../components/dashboard/BusinessMetrics';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const isBusiness = user?.userType === 'business';
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const endpoint = isBusiness ? '/api/v1/tools/dashboard-enterprise' : '/api/v1/tools/dashboard-stats';
        const response = await apiClient.post(endpoint);

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          toast.error('Error al cargar los datos del dashboard');
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, isBusiness]);

  // Solo mostrar datos si la API responde correctamente
  const metrics = dashboardData ? [
    {
      title: 'Balance Total',
      value: `$${Math.abs(dashboardData.totals?.thismonth?.balance || 0).toLocaleString()}`,
      change: dashboardData.totals?.variation?.balancepct || 0,
      changeLabel: 'vs mes anterior',
      icon: DollarSign,
      color: 'blue' as const
    },
    {
      title: 'Ingresos',
      value: `$${Math.abs(dashboardData.totals?.thismonth?.income || 0).toLocaleString()}`,
      change: dashboardData.totals?.variation?.incomepct || 0,
      changeLabel: 'este mes',
      icon: TrendingUp,
      color: 'green' as const
    },
    {
      title: 'Gastos',
      value: `$${Math.abs(dashboardData.totals?.thismonth?.expense || 0).toLocaleString()}`,
      change: dashboardData.totals?.variation?.expensepct || 0,
      changeLabel: 'vs mes anterior',
      icon: TrendingDown,
      color: 'red' as const
    },
    {
      title: 'Ahorro',
      value: `$${Math.abs((dashboardData.totals?.thismonth?.income || 0) - (dashboardData.totals?.thismonth?.expense || 0)).toLocaleString()}`,
      change: 15.3,
      changeLabel: 'meta mensual',
      icon: PiggyBank,
      color: 'purple' as const
    }
  ] : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={`min-h-screen ${isBusiness ? 'bg-red-50' : 'bg-banorte-gray-50'}`}>
      <Header />
      
      <main className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Saludo y resumen */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-banorte-gray-800 mb-2">
              {isBusiness ? 'Resumen Empresarial' : '¡Bienvenido de vuelta!'}
            </h1>
            <p className="text-banorte-gray-600">
              {isBusiness ? 'Aquí tienes un resumen de la situación de tu negocio' : 'Aquí tienes un resumen de tu situación financiera'}
            </p>
          </motion.div>

          {/* Métricas */}
          {isBusiness ? (
            <BusinessMetrics />
          ) : metrics.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {metrics.map((metric) => (
                <motion.div key={metric.title} variants={itemVariants}>
                  <MetricCard {...metric} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 mb-8"
            >
              <div className="w-16 h-16 bg-banorte-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <DollarSign size={32} className="text-banorte-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-banorte-gray-800 mb-2">
                {loading ? 'Cargando datos...' : 'No hay datos disponibles'}
              </h3>
              <p className="text-banorte-gray-500 text-sm">
                {loading ? 'Conectando con el servidor...' : 'Los datos del dashboard aparecerán aquí cuando estén disponibles'}
              </p>
            </motion.div>
          )}

          {/* Gráficos y contenido principal */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <SpendingChart type="bar" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SavingsChart />
            </motion.div>
          </motion.div>

          {/* Historial de chat y transacciones */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <ChatHistory />
            </motion.div>
            <motion.div variants={itemVariants}>
              <RecentTransactions />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
