import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: 'red' | 'green' | 'blue' | 'purple';
  className?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'blue',
  className = ''
}: MetricCardProps) => {
  const colorClasses = {
    red: 'text-banorte-red bg-red-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  const iconColorClasses = {
    red: 'text-banorte-red',
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600'
  };

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm border border-banorte-gray-200 p-6 ${className}`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} className={iconColorClasses[color]} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-banorte-gray-500'
          }`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : 
             isNegative ? <TrendingDown size={16} className="mr-1" /> : null}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-banorte-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-banorte-gray-800">{value}</p>
        {changeLabel && (
          <p className="text-xs text-banorte-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;
