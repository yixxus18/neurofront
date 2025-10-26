import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'chart' | 'analysis';
  data?: any;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
            ? 'bg-banorte-red text-white'
            : 'bg-gray-400 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Mensaje */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-banorte-red text-white' 
            : 'bg-banorte-gray-100 text-banorte-gray-800'
        }`}>
          <div className="text-sm">
            {message.type === 'text' && (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
            
            {message.type === 'chart' && message.data && (
              <div className="space-y-2">
                <p className="mb-2">{message.content}</p>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-xs text-banorte-gray-500 mb-2">Análisis de gastos</div>
                  <div className="space-y-1">
                    {message.data.categories?.map((cat: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{cat.name}</span>
                        <span className="font-medium">${cat.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {message.type === 'analysis' && message.data && (
              <div className="space-y-2">
                <p className="mb-2">{message.content}</p>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-xs text-banorte-gray-500 mb-2">Recomendaciones</div>
                  <ul className="text-xs space-y-1">
                    {message.data.recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-banorte-red mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className={`text-xs mt-2 ${
            isUser ? 'text-red-100' : 'text-banorte-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
