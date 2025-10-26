import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'bot';
}

const ChatHistory = () => {
  const messages: ChatMessage[] = [
    // Historial vacío inicialmente - se llenará con conversaciones reales
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-banorte-gray-200 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-banorte-gray-800">
          Historial del Chat
        </h3>
        <button className="text-banorte-red text-sm font-medium hover:text-red-700 transition-colors">
          Ver todo
        </button>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto text-banorte-gray-300 mb-4" />
            <p className="text-banorte-gray-500 text-sm">No hay conversaciones anteriores</p>
            <p className="text-banorte-gray-400 text-xs mt-1">Tus conversaciones aparecerán aquí</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-3 rounded-lg ${
                message.sender === 'user' ? 'bg-banorte-gray-50' : ''
              }`}
            >
              <div className={`p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-banorte-red'
              }`}>
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-banorte-gray-800">{message.text}</p>
                <p className="text-xs text-banorte-gray-500 mt-1">{message.time}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ChatHistory;
