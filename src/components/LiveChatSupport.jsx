import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User, Clock } from 'lucide-react';

const LiveChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [agentName] = useState('Sarah');
  const [agentStatus, setAgentStatus] = useState('online');

  // Toggle chat window
  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  // Close chat window
  const closeChat = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setMessages([]);
  };

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "Hi there! How can I help you today?",
        "Thanks for your question. Let me check that for you.",
        "I'd be happy to assist with your inquiry about our products.",
        "We offer a 30-day return policy on all purchases.",
        "Is there anything else you'd like to know about our products?"
      ];
      
      const agentMessage = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, agentMessage]);
      
      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage = {
          id: Date.now(),
          text: `Hi there! I'm ${agentName}, how can I help you today?`,
          sender: 'agent',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, [isOpen, messages.length, agentName]);

  // Simulate agent status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const statuses = ['online', 'online', 'online', 'away'];
      setAgentStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 60000);
    
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 touch-manipulation"
        aria-label="Live Chat Support"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-20 right-4 bg-gray-900 rounded-lg shadow-xl z-50 transition-all duration-300 w-80 sm:w-96 ${
            isMinimized ? 'h-14' : 'h-96'
          } flex flex-col overflow-hidden border border-gray-700`}
        >
          {/* Chat Header */}
          <div 
            className="bg-gray-800 p-3 flex justify-between items-center cursor-pointer"
            onClick={toggleChat}
          >
            <div className="flex items-center">
              <div className="relative">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {agentName.charAt(0)}
                </div>
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 ${
                  agentStatus === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
              </div>
              <div className="ml-2">
                <div className="font-medium text-sm">{agentName}</div>
                <div className="text-xs text-gray-400 flex items-center">
                  {agentStatus === 'online' ? (
                    <>
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full inline-block mr-1"></span>
                      Online
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Away
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="text-gray-400 hover:text-white mr-2"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <ChevronDown className={`h-5 w-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={closeChat}
                className="text-gray-400 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="flex-grow p-3 overflow-y-auto space-y-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-800 text-white rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div className="text-xs opacity-70 text-right mt-1">{message.time}</div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-lg px-3 py-2 text-white rounded-bl-none max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-gray-800 flex">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-gray-800 text-white rounded-l-lg px-3 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-lg"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChatSupport;
