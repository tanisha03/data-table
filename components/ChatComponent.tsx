import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Copy } from "lucide-react";

interface ChatComponentProps {
  conversationDetails: ConversationPublic;
  setConversationDetails: (a: ConversationPublic) => void
  selectedRows: DataRow[]
  setSelectedRows: (a: DataRow[]) => void
}

const ChatComponent: React.FC<ChatComponentProps> = ({ conversationDetails, setConversationDetails, selectedRows, setSelectedRows }) => {
  const [chatMessages, setChatMessages] = useState(conversationDetails.messages);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        content: message,
        role: 'user',
        created_at: new Date(Date.now()).toLocaleDateString(),
        updated_at: new Date(Date.now()).toLocaleDateString(),
        conversation_id: conversationDetails.id,
        message_context:  {tabular_data : selectedRows},
        id: Math.random(),
      }
      setChatMessages(prev => [...prev, userMessage])
      setConversationDetails((prev: ConversationPublic) => ({
        ...prev,
        messages: chatMessages
      }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedRows, message }),
      });
      const res = await response.json();
      console.log(res);
      const aiMessage = {
        content: res.message,
        role: 'ao',
        created_at: new Date(Date.now()).toLocaleDateString(),
        updated_at: new Date(Date.now()).toLocaleDateString(),
        conversation_id: conversationDetails.id,
        message_context:  {tabular_data : selectedRows},
        id: Math.random(),
      }
      setChatMessages(prev => [...prev, aiMessage])
      setConversationDetails((prev: ConversationPublic) => ({
        ...prev,
        messages: chatMessages
      }))
      setSelectedRows([]);
      setMessage(""); 
    }
  };

  const handleCopyMessage = (chatMessage: string) => {
    navigator.clipboard.writeText(chatMessage)
      .then(() => {
        alert('Message copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };

  return (
    <div className="border-l border-gray-800 p-4 flex flex-col h-90vh">
      <div className="overflow-y-auto h-[82vh]" ref={scrollRef}>
        {
          chatMessages.map((chat, index) => (
            chat.role === 'user' ? (
              <div key={index} className="flex items-start gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white">{conversationDetails.name[0]}</div>
                <div className="flex-1 p-4 rounded-lg bg-gray-800 text-md">{chat.content}</div>
              </div>
            ) : (
              <div key={index}>
                <div className="bg-gray-400 p-4 rounded-lg mb-4 text-md">
                    {chat.content}
                </div>
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => handleCopyMessage(chat.content)}>
                    <Copy className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )
          ))
        }
      </div>
      <div className="mt-auto">
        <div className="relative">
          <Input
            className="w-full bg-gray-900 border-0 rounded-lg pl-4 pr-12 py-6"
            placeholder="Ask A79..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded flex items-center justify-center" onClick={handleSendMessage}>
            ↑
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;