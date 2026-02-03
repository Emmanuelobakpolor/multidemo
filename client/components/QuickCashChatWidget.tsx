import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { ChatMessage, SendMessageRequest } from "@shared/api";

interface QuickCashChatWidgetProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const QuickCashChatWidget: React.FC<QuickCashChatWidgetProps> = ({ user, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/quickcash/chat/history/${user.email}`);
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
      await fetch(`/api/quickcash/chat/mark-read/${user.email}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const request: SendMessageRequest = {
        sender_email: user.email,
        receiver_email: "admin@quickcash.com", // Admin email
        message: newMessage.trim()
      };

      const response = await fetch("/api/quickcash/chat/send", {
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

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => onClose()} // This is a dummy function since widget is closed
          className="bg-[#00D4AA] text-black p-4 rounded-full shadow-lg hover:bg-[#00C49A] transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-xs sm:w-80 h-[500px] sm:h-96 bg-[#1A1A1A] rounded-lg shadow-lg flex flex-col border border-[#333333]">
      {/* Chat Header */}
      <div className="bg-[#0D0D0D] text-[#FFFFFF] p-4 rounded-t-lg flex justify-between items-center border-b border-[#333333]">
        <h3 className="font-semibold">QuickCash Support</h3>
        <button
          onClick={onClose}
          className="text-[#888888] hover:text-[#FFFFFF]"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-[#888888] mt-8">
            <p>No messages yet. Send a message to start chatting with support.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_email === user.email ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender_email === user.email
                    ? "bg-[#00D4AA] text-black"
                    : "bg-[#333333] text-[#FFFFFF]"
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
      <div className="p-4 border-t border-[#333333]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA]"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="bg-[#00D4AA] text-black px-4 py-2 rounded-lg hover:bg-[#00C49A] disabled:opacity-50 transition-colors"
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
  );
};

export default QuickCashChatWidget;
