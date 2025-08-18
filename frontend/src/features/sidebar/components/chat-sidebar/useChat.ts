import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your heat-illness information assistant. I can help you learn about heat-related conditions, prevention strategies, symptoms to watch for, and when to seek medical care. What would you like to know?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseContent = data.answer || "Sorry, I couldn't get a clear answer.";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Oops! Something went wrong. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, handleSendMessage, messagesEndRef };
}
