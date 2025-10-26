import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SavingsChartProps {
  data?: {
    months: string[];
    savings: number[];
    goals: number[];
  };
  className?: string;
}

const SavingsChart = ({ 
  data,
  className = '' 
}: SavingsChartProps) => {
  // Sin datos hardcodeados - se conectará con API
  const chartData = data || { months: [], savings: [], goals: [] };

  const lineData = {
    labels: chartData.months,
    datasets: [
      {
        label: 'Ahorros Reales',
        data: chartData.savings,
        borderColor: '#E31D1A',
        backgroundColor: 'rgba(227, 29, 26, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#E31D1A',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Meta de Ahorro',
        data: chartData.goals,
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#4ECDC4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Progreso de Ahorros',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#212529',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F8F9FA',
        },
        ticks: {
          color: '#6C757D',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6C757D',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm border border-banorte-gray-200 p-6 ${className}`}
    >
      <div className="h-80">
        {chartData.months.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-banorte-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-banorte-gray-300 rounded"></div>
              </div>
              <p className="text-banorte-gray-500 text-sm">No hay datos disponibles</p>
              <p className="text-banorte-gray-400 text-xs mt-1">Los datos del gráfico aparecerán aquí</p>
            </div>
          </div>
        ) : (
          <Line data={lineData} options={options} />
        )}
      </div>
    </motion.div>
  );
};

export default SavingsChart;
