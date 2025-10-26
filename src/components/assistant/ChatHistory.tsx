import { ScrollText, Plus, MessageCircle } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
}

interface ChatHistoryProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onCreateNew: () => void;
  currentChatId?: string | null;
}

const ChatHistory = ({ chats, onSelectChat, onCreateNew, currentChatId }: ChatHistoryProps) => {
  return (
    <div className="bg-banorte-gray-50 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-banorte-gray-800">
          Historial de Chats
        </h2>
        <button
          onClick={onCreateNew}
          className="p-2 bg-banorte-red text-white rounded-lg hover:bg-red-700 transition-colors"
          title="Nuevo Chat"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-banorte-red text-white'
                    : 'hover:bg-banorte-gray-100 text-banorte-gray-700'
                }`}
              >
                <MessageCircle size={16} className="mr-3 flex-shrink-0" />
                <span className="text-sm truncate">{chat.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-banorte-gray-400">
            <ScrollText size={32} className="mb-2" />
            <p className="text-sm mb-2">No hay chats anteriores.</p>
            <p className="text-xs mb-4">Tu historial aparecerá aquí.</p>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-banorte-red text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Crear Primer Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;