import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date | string;
  type?: 'text' | 'chart' | 'analysis';
  data?: any;
}

interface ChatMessageProps {
  message: Message;
}

// Pequeño componente para renderizar el texto con negritas
const FormattedText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </span>
  );
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[90%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isUser ? 'bg-banorte-red text-white' : 'bg-gray-400 text-white'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div className={`rounded-2xl px-4 py-3 text-sm ${isUser ? 'bg-banorte-red text-white' : 'bg-banorte-gray-100 text-banorte-gray-800'}`}>
          {/* --- LÓGICA DE RENDERIZADO MEJORADA --- */}
          {message.type === 'analysis' && message.data ? (
            <div className="space-y-3">
              {message.data.title && <h4 className="font-bold text-base">{message.data.title}</h4>}
              {message.data.summary && <p>{message.data.summary}</p>}
              
              {message.data.sections?.map((section: any, index: number) => (
                <div key={index}>
                  <h5 className="font-semibold mb-1">{section.heading}</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {section.items?.map((item: string, itemIndex: number) => (
                      <li key={itemIndex}>
                        <FormattedText text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {message.data.conclusion && <p className="text-xs italic mt-2 text-banorte-gray-500">{message.data.conclusion}</p>}
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          <div className={`text-xs mt-2 text-right ${isUser ? 'text-red-100' : 'text-banorte-gray-500'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;