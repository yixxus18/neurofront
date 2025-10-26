import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SpendingChartProps {
  data?: {
    categories: string[];
    amounts: number[];
  };
  type?: 'bar' | 'doughnut';
  className?: string;
}

const SpendingChart = ({ 
  data, 
  type = 'bar',
  className = '' 
}: SpendingChartProps) => {
  // Sin datos hardcodeados - se conectará con API
  const chartData = data || { categories: [], amounts: [] };

  const barData = {
    labels: chartData.categories,
    datasets: [
      {
        label: 'Gastos',
        data: chartData.amounts,
        backgroundColor: [
          '#E31D1A',
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4'
        ],
        borderColor: [
          '#C41E3A',
          '#FF5252',
          '#26A69A',
          '#2196F3',
          '#66BB6A'
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: chartData.categories,
    datasets: [
      {
        data: chartData.amounts,
        backgroundColor: [
          '#E31D1A',
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: type === 'bar' ? 'Gastos por Categoría' : 'Distribución de Gastos',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#212529',
      },
    },
    scales: type === 'bar' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F8F9FA',
        },
        ticks: {
          color: '#6C757D',
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
    } : undefined,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm border border-banorte-gray-200 p-6 ${className}`}
    >
      <div className="h-80">
        {chartData.categories.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-banorte-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-banorte-gray-300 rounded"></div>
              </div>
              <p className="text-banorte-gray-500 text-sm">No hay datos disponibles</p>
              <p className="text-banorte-gray-400 text-xs mt-1">Los datos del gráfico aparecerán aquí</p>
            </div>
          </div>
        ) : type === 'bar' ? (
          <Bar data={barData} options={options} />
        ) : (
          <Doughnut data={doughnutData} options={options} />
        )}
      </div>
    </motion.div>
  );
};

export default SpendingChart;
