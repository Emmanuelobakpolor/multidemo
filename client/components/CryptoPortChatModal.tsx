import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { ChatMessage, SendMessageRequest } from "@shared/api";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onMarkAsRead?: () => void;
}

const CryptoPortChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, user, onMarkAsRead }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchChatHistory();
      // Call mark as read when chat is opened
      if (onMarkAsRead) {
        onMarkAsRead();
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/cryptoport/chat/history/${user.email}/`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
        markMessagesRead();
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const markMessagesRead = async () => {
    try {
      await fetch(`/api/cryptoport/chat/mark-read/${user.email}/`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const request: SendMessageRequest = {
        sender_email: "admin@cryptoport.com", // Admin email
        receiver_email: user.email,
        message: newMessage.trim()
      };

      const response = await fetch("/api/cryptoport/chat/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewMessage("");
        fetchChatHistory();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg h-[500px] sm:h-[600px] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gray-700 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Chat with {user.fullName}</h3>
            <p className="text-sm opacity-80">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No messages yet. Send a message to start chatting.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_email === "admin@cryptoport.com" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender_email === "admin@cryptoport.com"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-900 text-white"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPortChatModal;
