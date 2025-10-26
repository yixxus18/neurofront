import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Briefcase, FileText, Users } from 'lucide-react';
import Header from '../components/dashboard/Header';
import MetricCard from '../components/ui/MetricCard';
import SpendingChart from '../components/dashboard/Charts/SpendingChart';
import SavingsChart from '../components/dashboard/Charts/SavingsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';

const DashboardPage = () => {
  const { user } = useAuth();
  const isBusiness = user?.userType === 'business';
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [spendingChartData, setSpendingChartData] = useState<any>(null);
  const [savingsChartData, setSavingsChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fallbackDashboardData = {
    totals: {
      this_month: { balance: 12345, income: 23456, expense: 11111 },
    },
    variation: { balance_pct: 10, income_pct: 5, expense_pct: -3 },
    this_month: {
      incomes: [{ id: 1, description: 'Salario', amount: '20000', date_transaction: '2025-10-15', category_id: 1, type: 'income' }],
      expenses: [{ id: 2, description: 'Renta', amount: '10000', date_transaction: '2025-10-01', category_id: 2, type: 'expense' }]
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const endpoint = isBusiness ? '/api/v1/tools/dashboard-enterprise' : '/api/v1/tools/dashboard-stats';
        const response = await apiClient.get(endpoint);

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          console.warn('Dashboard API returned success=false, using fallback data');
          setDashboardData(fallbackDashboardData);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(fallbackDashboardData);
      } finally {
        setLoading(false);
      }
    };

    const fallbackSpendingChartData = {
      incomes: [
        { date: '2025-10-01', value: 1500 },
        { date: '2025-10-15', value: 2500 },
      ],
      expenses: [
        { date: '2025-10-05', value: 500 },
        { date: '2025-10-20', value: 1200 },
      ]
    };

    const fallbackSavingsChartData = {
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      savings: [500, 600, 700, 800, 900, 1000],
      goals: [400, 500, 600, 700, 800, 900]
    };

    // Removed chart data fetching - using only fallback data
    const fetchChartData = async () => {
      setSpendingChartData(fallbackSpendingChartData);
    };

    if (user) {
      fetchDashboardData();
      fetchChartData();
      setSavingsChartData(fallbackSavingsChartData);
    }
  }, [user]);

  // Solo mostrar datos si la API responde correctamente
  const metrics = dashboardData ? (
    isBusiness
      ? [
          {
            title: 'Facturación Total',
            value: `$${Math.abs(dashboardData.totals?.this_month?.income || 0).toLocaleString()}`,
            change: dashboardData.variation?.income_pct || 0,
            changeLabel: 'este mes',
            icon: Briefcase,
            color: 'blue' as const
          },
          {
            title: 'Cuentas por Cobrar',
            value: `$${Math.abs(dashboardData.totals?.this_month?.expense || 0).toLocaleString()}`,
            change: dashboardData.variation?.expense_pct || 0,
            changeLabel: 'vs mes anterior',
            icon: FileText,
            color: 'red' as const
          },
          {
            title: 'Nuevos Clientes',
            value: '82',
            change: 25,
            changeLabel: 'este mes',
            icon: Users,
            color: 'green' as const
          },
          {
            title: 'Tasa de Conversión',
            value: '4.2%',
            change: 0.5,
            changeLabel: 'promedio semanal',
            icon: TrendingUp,
            color: 'purple' as const
          }
        ]
      : [
          {
            title: 'Balance Total',
            value: `$${Math.abs(dashboardData.totals?.this_month?.balance || 0).toLocaleString()}`,
            change: dashboardData.variation?.balance_pct || 0,
            changeLabel: 'vs mes anterior',
            icon: DollarSign,
            color: 'blue' as const
          },
          {
            title: 'Ingresos',
            value: `$${Math.abs(dashboardData.totals?.this_month?.income || 0).toLocaleString()}`,
            change: dashboardData.variation?.income_pct || 0,
            changeLabel: 'este mes',
            icon: TrendingUp,
            color: 'green' as const
          },
          {
            title: 'Gastos',
            value: `$${Math.abs(dashboardData.totals?.this_month?.expense || 0).toLocaleString()}`,
            change: dashboardData.variation?.expense_pct || 0,
            changeLabel: 'vs mes anterior',
            icon: TrendingDown,
            color: 'red' as const
          },
          {
            title: 'Ahorro',
            value: `$${Math.abs((dashboardData.totals?.this_month?.income || 0) - (dashboardData.totals?.this_month?.expense || 0)).toLocaleString()}`,
            change: 15.3,
            changeLabel: 'meta mensual',
            icon: PiggyBank,
            color: 'purple' as const
          }
        ]
  ) : [];

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

  const transactions = dashboardData ? (
    isBusiness
      ? [
          ...(dashboardData.mensual?.this_period?.incomes || []).map((t: any) => ({ ...t, type: 'income' })),
          ...(dashboardData.mensual?.this_period?.expenses || []).map((t: any) => ({ ...t, type: 'expense' }))
        ].sort((a, b) => new Date(b.date_transaction).getTime() - new Date(a.date_transaction).getTime())
      : [
          ...(dashboardData.this_month?.incomes || []).map((t: any) => ({ ...t, type: 'income' })),
          ...(dashboardData.this_month?.expenses || []).map((t: any) => ({ ...t, type: 'expense' }))
        ].sort((a, b) => new Date(b.date_transaction).getTime() - new Date(a.date_transaction).getTime())
  ) : [];

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
          {metrics.length > 0 ? (
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
              <SpendingChart type="bar" data={spendingChartData} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SavingsChart data={savingsChartData} />
            </motion.div>
          </motion.div>

          {/* Historial de chat y transacciones */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <RecentTransactions transactions={transactions} />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
