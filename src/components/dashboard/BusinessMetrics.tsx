import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Users, TrendingUp } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

const BusinessMetrics = () => {
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.post('/api/v1/tools/dashboard-enterprise');

        if (response.data.success) {
          setBusinessData(response.data.data);
        } else {
          toast.error('Error al cargar los datos empresariales');
        }
      } catch (error: any) {
        console.error('Error fetching business data:', error);
        toast.error('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const metrics = businessData ? [
    {
      title: 'Facturación Total',
      value: `$${Math.abs(businessData.mensual?.totals?.income || 0).toLocaleString()}`,
      change: businessData.mensual?.variation?.incomepct || 0,
      changeLabel: 'este mes',
      icon: Briefcase,
      color: 'blue' as const
    },
    {
      title: 'Cuentas por Cobrar',
      value: `$${Math.abs(businessData.mensual?.totals?.expense || 0).toLocaleString()}`,
      change: businessData.mensual?.variation?.expensepct || 0,
      changeLabel: 'vs mes anterior',
      icon: FileText,
      color: 'red' as const
    },
    {
      title: 'Nuevos Clientes',
      value: '82', // Este dato no está en la API, mantener ejemplo
      change: 25,
      changeLabel: 'este mes',
      icon: Users,
      color: 'green' as const
    },
    {
      title: 'Tasa de Conversión',
      value: '4.2%', // Este dato no está en la API, mantener ejemplo
      change: 0.5,
      changeLabel: 'promedio semanal',
      icon: TrendingUp,
      color: 'purple' as const
    }
  ] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.length > 0 ? (
        metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="w-16 h-16 bg-banorte-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Briefcase size={32} className="text-banorte-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-banorte-gray-800 mb-2">
            {loading ? 'Cargando datos empresariales...' : 'No hay datos disponibles'}
          </h3>
          <p className="text-banorte-gray-500 text-sm">
            {loading ? 'Conectando con el servidor...' : 'Los datos empresariales aparecerán aquí cuando estén disponibles'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessMetrics;
