import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm EcoBot, your sustainable shopping assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "Is the product available?",
    "What's the condition like?",
    "Can you provide more details?",
    "Is shipping included?",
    "How do eco points work?",
    "Tell me about sustainability impact"
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('available')) {
      return "Great question! Most items on EcoFinds are available immediately. You can check the status on each product page. Green means available, yellow means reserved, and sold items show a completion badge.";
    }
    
    if (message.includes('condition')) {
      return "We categorize items into: Excellent (like new), Good (minor wear), Fair (visible wear but functional). Each seller provides detailed photos and descriptions. Our AI also helps suggest accurate conditions!";
    }
    
    if (message.includes('eco points') || message.includes('points')) {
      return "Eco points are our way of gamifying sustainability! You earn points for listing items (+50), buying second-hand (+25), and completing transactions (+10). Use them to unlock badges and climb the leaderboard! 🌱";
    }
    
    if (message.includes('impact') || message.includes('sustainability')) {
      return "Every purchase shows real environmental impact! For example, buying a pre-owned jacket saves ~30kg CO₂, 10,000L water, and 45kWh energy compared to buying new. You'll get a blockchain certificate to share your impact! 🌍";
    }
    
    if (message.includes('shipping')) {
      return "Shipping policies vary by seller. Many offer eco-friendly shipping options or local pickup to reduce carbon footprint. Check the product page for specific shipping details and costs.";
    }
    
    if (message.includes('help') || message.includes('hi') || message.includes('hello')) {
      return "I'm here to help with anything EcoFinds related! I can answer questions about products, eco points, sustainability impact, shipping, or how our marketplace works. What would you like to know?";
    }
    
    return "Thanks for your question! While I'm still learning, you can contact our support team or check our FAQ section. I'm constantly being updated to help you better with sustainable shopping! 🤖";
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputText('');
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col border border-gray-200 mb-4 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white bg-opacity-20 p-1 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">EcoBot</div>
                  <div className="text-xs opacity-90">Online • Sustainable Assistant</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-1">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full hover:bg-green-100 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, eco points, or sustainability..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-full hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;