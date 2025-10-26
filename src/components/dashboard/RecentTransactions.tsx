import { motion } from 'framer-motion';
import { ArrowUpRight, CreditCard, ShoppingBag, Car, Utensils } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  icon: 'credit' | 'shopping' | 'transport' | 'food';
}

const RecentTransactions = () => {
  // Sin datos hardcodeados - se conectará con API
  const transactions: Transaction[] = [];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'credit':
        return <CreditCard size={20} />;
      case 'shopping':
        return <ShoppingBag size={20} />;
      case 'transport':
        return <Car size={20} />;
      case 'food':
        return <Utensils size={20} />;
      default:
        return <CreditCard size={20} />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-banorte-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-banorte-gray-800">
          Transacciones Recientes
        </h3>
        <button className="text-banorte-red text-sm font-medium hover:text-red-700 transition-colors">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard size={48} className="mx-auto text-banorte-gray-300 mb-4" />
            <p className="text-banorte-gray-500 text-sm">No hay transacciones recientes</p>
            <p className="text-banorte-gray-400 text-xs mt-1">Las transacciones aparecerán aquí</p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-banorte-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-banorte-gray-100 text-banorte-gray-600'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    getIcon(transaction.icon)
                  )}
                </div>
                <div>
                  <p className="font-medium text-banorte-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-banorte-gray-500">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecentTransactions;
