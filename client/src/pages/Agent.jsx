
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, DollarSign } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../styles/Agent.css';

const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000';


const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your personal finance assistant. I can help you manage your budgets and transactions. What would you like to do today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AGENT_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to send message. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
    

      <main className="chat-main">
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${msg.sender === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="avatar">
                {msg.sender === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
              </div>
              <div className="message-bubble">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row assistant">
              <div className="avatar"><Bot size={16} color="#fff" /></div>
              <div className="message-bubble loading">
                <Loader2 className="spin" size={16} />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="error-box">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask about your budget, transactions, or goals..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={!inputValue.trim() || isLoading}>
          {isLoading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
        </button>
      </footer>
    </div>
  );
};

export default ChatInterface;
