import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Maximize, Minimize } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatHistory from './ChatHistory';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'chart' | 'analysis';
  data?: any;
}

interface ChatHistoryItem {
  id: string;
  title: string;
}

interface ChatCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  isLoading: boolean;
}

const AssistantWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { } = useAuth();

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { token } = useAuth();

  // Cargar historial de chats al montar
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await apiClient.post('/api/v1/tools/chats/show');
      if (response.data.success) {
        setChatHistory(response.data.data.items.map((item: any) => ({
          id: item.chat_id,
          title: item.name
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const createNewChat = async (chatName: string) => {
    try {
      setIsCreatingChat(true);
      const response = await apiClient.post('/api/v1/tools/chats', {
        name: chatName
      });

      if (response.data.success) {
        const newChatId = response.data.data.chat_id;
        const newChat: ChatHistoryItem = {
          id: newChatId,
          title: chatName
        };

        setChatHistory(prev => [newChat, ...prev]);
        setCurrentChatId(newChatId);
        setMessages([]);
        setShowCreateModal(false);
        toast.success('Chat creado exitosamente');

        // Bind user token to MCP session
        try {
          await bindUserTokenToMCP(newChatId);
        } catch (bindError) {
          console.error('Error binding user token to MCP:', bindError);
          toast.error('Chat creado pero error al conectar con MCP');
        }

        return newChatId;
      }
    } catch (error: any) {
      console.error('Error creating chat:', error);
      toast.error(error.response?.data?.message || 'Error al crear el chat');
      throw error;
    } finally {
      setIsCreatingChat(false);
    }
  };

  const bindUserTokenToMCP = async (chatId: string) => {
    // This should be called from a server-side function/API route
    // For now, we'll make the call directly (in production, move to BFF)
    const response = await fetch('/api/mcp/bind-user-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        user_jwt: token, // From useAuth hook
        ttl_sec: 900
      })
    });

    if (!response.ok) {
      throw new Error('Failed to bind user token to MCP');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'MCP binding failed');
    }

    return data;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!currentChatId) {
      toast.error('Por favor, crea o selecciona un chat primero');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // 1. Primero guardar el mensaje del usuario
      await apiClient.post('/api/v1/tools/chats/append', {
        chat_id: currentChatId,
        user_content: messageToSend,
        assistant_content: "" 
      });

      // 2. Obtener el historial actualizado del chat
      const historyResponse = await apiClient.post('/api/v1/tools/chats/show');
      const currentChat = historyResponse.data.data.items.find((item: any) => item.chat_id === currentChatId);

      if (currentChat && currentChat.contexto) {
        const mcpResponse = await apiClient.post('/api/v1/tools/chat/send', {
          chat_id: currentChatId,
          context: currentChat.contexto,
          message: messageToSend
        });

        if (mcpResponse.data.success) {
          const assistantResponse = mcpResponse.data.data.response;

          await apiClient.post('/api/v1/tools/chats/append', {
            chat_id: currentChatId,
            user_content: messageToSend,
            assistant_content: assistantResponse
          });

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: assistantResponse,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'text'
          };

          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(mcpResponse.data.message || 'Error en la respuesta del servidor');
        }
      } else {
        throw new Error('No se pudo obtener el contexto del chat');
      }
    } catch (error: any) {
      console.error('Error al enviar mensaje:', error);
      toast.error(error.response?.data?.message || 'Error al conectar con el asistente. Inténtalo de nuevo.');

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

  const handleSelectChat = async (id: string) => {
    try {
      setCurrentChatId(id);
      setMessages([]);

      const chatResponse = await apiClient.post('/api/v1/tools/chats/show-by-filter', {
        chat_id: id
      });

      if (chatResponse.data.success && chatResponse.data.data) {
        const chatData = chatResponse.data.data;

        if (chatData.contexto && Array.isArray(chatData.contexto)) {
          // Convertir el contexto en mensajes para mostrar
          const chatMessages: Message[] = [];
          chatData.contexto.forEach((ctx: any, index: number) => {
            if (ctx.role === 'user' && ctx.content && ctx.content.trim()) {
              chatMessages.push({
                id: `user-${Date.now()}-${index}`,
                content: ctx.content.trim(),
                sender: 'user',
                timestamp: new Date(ctx.ts ? (typeof ctx.ts === 'object' ? ctx.ts.$date : ctx.ts) : Date.now()),
                type: 'text'
              });
            } else if (ctx.role === 'assistant' && ctx.content && ctx.content.trim()) {
              chatMessages.push({
                id: `assistant-${Date.now()}-${index}`,
                content: ctx.content.trim(),
                sender: 'assistant',
                timestamp: new Date(ctx.ts ? (typeof ctx.ts === 'object' ? ctx.ts.$date : ctx.ts) : Date.now()),
                type: 'text'
              });
            }
          });

          // Ordenar mensajes por timestamp
          chatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          setMessages(chatMessages);
          toast.success(`Chat cargado: ${chatHistory.find(c => c.id === id)?.title}`);
        } else {
          setMessages([]);
          toast.success(`Chat seleccionado: ${chatHistory.find(c => c.id === id)?.title}`);
        }
      } else {
        setMessages([]);
        toast.error('No se pudo cargar el chat seleccionado');
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      toast.error('Error al cargar los mensajes del chat');
      setMessages([]);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullScreen(false);
    setIsHistoryOpen(false);
  };

  const ChatCreationModal: React.FC<ChatCreationModalProps> = ({ isOpen, onClose, onCreate, isLoading }) => {
    const [chatName, setChatName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatName.trim()) return;

      try {
        await onCreate(chatName);
        setChatName('');
      } catch (error) {
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw]">
          <h3 className="text-lg font-semibold text-banorte-gray-800 mb-4">Crear Nuevo Chat</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Nombre del chat"
              className="w-full px-3 py-2 border border-banorte-gray-300 rounded-lg focus:ring-2 focus:ring-banorte-red focus:border-transparent mb-4"
              disabled={isLoading}
              required
            />
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-banorte-gray-300 text-banorte-gray-700 rounded-lg hover:bg-banorte-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-banorte-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={isLoading || !chatName.trim()}
              >
                {isLoading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <ChatCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createNewChat}
        isLoading={isCreatingChat}
      />

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
                    onCreateNew={() => setShowCreateModal(true)}
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