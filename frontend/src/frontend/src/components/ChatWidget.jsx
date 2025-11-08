// src/components/ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';

export default function ChatWidget({ socket, roomId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join room when component mounts
    socket.emit('join-room', roomId);

    // Listen for messages
    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('receive-message', handleMessage);

    // Cleanup on unmount
    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (input.trim() && socket.connected) {
      socket.emit('send-message', {
        roomId,
        senderId: currentUser.id,
        text: input
      });
      // Optimistically add to UI
      setMessages(prev => [
        ...prev,
        { senderId: currentUser.id, text: input, timestamp: new Date() }
      ]);
      setInput('');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-indigo-600 text-white p-4 font-bold flex justify-between items-center">
        <span>💬 {roomId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
        <span className="text-sm opacity-90">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
      </div>

      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet. Be the first to say hello! 👋
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 max-w-[80%] ${
                msg.senderId === currentUser.id ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-3 rounded-2xl ${
                  msg.senderId === currentUser.id
                    ? 'bg-indigo-500 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {msg.senderId === currentUser.id ? 'You' : 'Peer'}
                </div>
                <div>{msg.text}</div>
              </div>
              <div
                className={`text-xs mt-1 ${
                  msg.senderId === currentUser.id ? 'text-indigo-200 text-right' : 'text-gray-500'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-indigo-600 text-white px-5 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}