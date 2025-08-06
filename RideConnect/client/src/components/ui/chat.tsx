import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";

interface ChatProps {
  tourId: string;
}

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export function Chat({ tourId }: ChatProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: messages } = useQuery({
    queryKey: ['/api/tours', tourId, 'messages'],
  });

  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (socket && user && tourId) {
      // Join tour chat room
      socket.send(JSON.stringify({
        type: 'join_tour_chat',
        tourId,
        userId: user.id,
      }));

      // Listen for new messages
      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          queryClient.setQueryData(['/api/tours', tourId, 'messages'], (oldMessages: ChatMessage[] = []) => [
            ...oldMessages,
            data.message,
          ]);
        }
      };

      socket.addEventListener('message', handleMessage);
      return () => socket.removeEventListener('message', handleMessage);
    }
  }, [socket, user, tourId, queryClient]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'send_message',
      message: message.trim(),
    }));

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">Tour Group Chat</h3>
        <p className="text-sm text-gray-600">
          {isConnected ? 'Connected' : 'Connecting...'}
        </p>
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages?.map((msg: ChatMessage) => (
            <div key={msg.id} className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-800" data-testid={`text-message-author-${msg.id}`}>
                    {msg.user.firstName}
                  </span>
                  <span className="text-xs text-gray-400" data-testid={`text-message-timestamp-${msg.id}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700" data-testid={`text-message-content-${msg.id}`}>
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected}
            data-testid="input-chat-message"
          />
          <Button 
            onClick={sendMessage}
            disabled={!message.trim() || !isConnected}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
