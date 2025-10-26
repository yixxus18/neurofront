import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Maximize, Minimize } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatHistory from './ChatHistory';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date | string;
  type?: 'text' | 'chart' | 'analysis';
  data?: any;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  contexto: any[];
}

// <--- FUNCIÓN CLAVE NUEVA --->
// Esta función busca y extrae un objeto JSON de un string de texto.
const extractJsonFromString = (text: string): object | null => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse extracted JSON:", error);
    return null;
  }
};

const AssistantWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    const savedChats = localStorage.getItem('banorte_chat_history');
    return savedChats ? JSON.parse(savedChats) : [];
  });

  useEffect(() => {
    localStorage.setItem('banorte_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!user || !user.id) {
      toast.error("Debes iniciar sesión para usar el asistente.");
      return;
    }

    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat: ChatHistoryItem = { id: newChatId, title: messageToSend, contexto: [userMessage] };
      setChatHistory(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
      setMessages([userMessage]);
    } else {
      setMessages(prev => [...prev, userMessage]);
      setChatHistory(prev => prev.map(chat =>
        chat.id === currentChatId ? { ...chat, contexto: [...chat.contexto, userMessage] } : chat
      ));
    }

    try {
      const mcpUrl = `http://localhost:8081/mcp/messages`;

      const response = await fetch(mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          user_text: messageToSend,
          chat_id: currentChatId || "temp-chat-id"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Error en la respuesta del MCP');
        } catch (e) {
          throw new Error(errorText || `Error del servidor MCP: ${response.status}`);
        }
      }

      const result = await response.json();
      const { answer } = result.data;

      // <--- CAMBIO CLAVE AQUÍ --->
      // Usamos nuestra nueva función para obtener el JSON de forma segura.
      const parsedAnswer = extractJsonFromString(answer);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: parsedAnswer ? (parsedAnswer as any).summary : answer,
        sender: 'assistant',
        timestamp: new Date(),
        type: parsedAnswer ? 'analysis' : 'text',
        data: parsedAnswer,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setChatHistory(prev => prev.map(chat =>
        chat.id === (currentChatId || (chatHistory.length > 0 ? chatHistory[0].id : null))
          ? { ...chat, contexto: [...chat.contexto, assistantMessage] }
          : chat
      ));

    } catch (error: any) {
      console.error('Error al enviar mensaje:', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error('Error de conexión con el servidor. Revisa la configuración de CORS.');
      } else {
        toast.error(error.message || 'Error al conectar con el asistente.');
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCreateNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'Nuevo Chat',
      contexto: []
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const handleDeleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const handleSelectChat = (id: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === id);
    if (selectedChat) {
      setCurrentChatId(id);
      setMessages(selectedChat.contexto);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullScreen(false);
    setIsHistoryOpen(false);
  };

  return (
    <>
      {!isFullScreen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-banorte-red text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center justify-center animate-pulse-strong"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          <span className="absolute inline-flex h-full w-full rounded-full bg-banorte-red opacity-75 animate-ping-slow"></span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${isFullScreen ? 'inset-0' : 'bottom-24 right-6 w-96 h-[500px]'} bg-white rounded-2xl shadow-2xl border border-banorte-gray-200 z-40 flex flex-col overflow-hidden`}
          >
            <div className={`flex h-full ${isFullScreen ? 'flex-row' : 'flex-col'}`}>
              {isFullScreen && isHistoryOpen && (
                <div className="w-80 border-r border-banorte-gray-200">
                  <ChatHistory
                    chats={chatHistory}
                    onSelectChat={handleSelectChat}
                    onCreateNew={handleCreateNewChat}
                    onDeleteChat={handleDeleteChat}
                    currentChatId={currentChatId}
                  />
                </div>
              )}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between p-4 border-b border-banorte-gray-200">
                  <div className="flex items-center space-x-3">
                    {isFullScreen && (
                      <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className="p-1 hover:bg-banorte-gray-100 rounded-lg transition-colors"
                        title="Historial de chats"
                      >
                        <MessageCircle size={18} />
                      </button>
                    )}
                    <div className="w-8 h-8 bg-banorte-red rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-banorte-gray-800">Asistente IA</h3>
                      <p className="text-xs text-banorte-gray-500">Banorte Financial</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="p-1 hover:bg-banorte-gray-100 rounded-lg transition-colors"
                    >
                      {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                    <button
                      onClick={closeChat}
                      className="p-1 hover:bg-banorte-gray-100 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isFullScreen ? 'max-h-[calc(100vh-200px)]' : 'max-h-[320px]'}`}>
                  {messages.length === 0 && !isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-banorte-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Bot size={32} className="text-banorte-gray-400" />
                        </div>
                        <p className="text-banorte-gray-500 text-sm mb-2">¡Hola! Soy tu asistente financiero</p>
                        <p className="text-banorte-gray-400 text-xs">Pregúntame sobre tus finanzas</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      {isLoading && (
                        <div className="flex items-center space-x-2 text-banorte-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-banorte-red"></div>
                          <span className="text-sm">Pensando...</span>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className={`border-t border-banorte-gray-200 ${isFullScreen ? 'p-6' : 'p-4'}`}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className={`flex-1 px-3 py-2 border border-banorte-gray-300 rounded-lg focus:ring-2 focus:ring-banorte-red focus:border-transparent ${isFullScreen ? 'text-base' : 'text-sm'}`}
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className={`bg-banorte-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isFullScreen ? 'px-6 py-3' : 'px-4 py-2'}`}
                    >
                      <Send size={isFullScreen ? 20 : 16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AssistantWindow;