import { useState, useEffect } from 'react';
import { Briefcase, FileText, Users, TrendingUp } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import apiClient from '../../api/apiClient';

const BusinessMetrics = () => {
  const [businessData, setBusinessData] = useState<any>(null);
  const [, setLoading] = useState(true);

  const fallbackBusinessData = {
    mensual: {
      totals: { income: 50000, expense: 20000 },
      variation: { incomepct: 15, expensepct: 5 }
    }
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/v1/tools/dashboard-enterprise');

        if (response.data.success) {
          setBusinessData(response.data.data);
        } else {
          console.warn('Business dashboard API returned success=false, using fallback data');
          setBusinessData(fallbackBusinessData);
        }
      } catch (error: any) {
        console.error('Error fetching business data:', error);
        setBusinessData(fallbackBusinessData);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const metrics = businessData ? [
    {
      title: 'Facturación Total',
      value: `$${Math.abs(businessData.mensual?.totals?.this_period?.income || 0).toLocaleString()}`,
      change: businessData.mensual?.variation?.income_pct || 0,
      changeLabel: 'este mes',
      icon: Briefcase,
      color: 'blue' as const
    },
    {
      title: 'Cuentas por Cobrar',
      value: `$${Math.abs(businessData.mensual?.totals?.this_period?.expense || 0).toLocaleString()}`,
      change: businessData.mensual?.variation?.expense_pct || 0,
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
  ] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};

export default BusinessMetrics;
