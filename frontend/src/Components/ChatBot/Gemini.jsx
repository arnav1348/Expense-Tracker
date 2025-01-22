import React, { useState } from 'react';
import styled from 'styled-components';

const BASE_URL = 'http://localhost:5000/api/v1';

const ChatIcon = styled.div`
  position: fixed;
  bottom: 2%;
  right: 2%;
  width: 4rem;
  height: 4rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ChatboxContainer = styled.div`
  position: fixed;
  bottom: 20%;
  right: 5%;
  width: 20rem;
  height: 24rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const MessageBubble = styled.p`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => (props.role === 'user' ? '#3b82f6' : '#e5e7eb')};
  color: ${(props) => (props.role === 'user' ? 'white' : 'black')};
  margin-bottom: 0.5rem;
  text-align: ${(props) => (props.role === 'user' ? 'right' : 'left')};
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #d1d5db;
  display: flex;
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Toggle for chatbox visibility

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch(`${BASE_URL}/financial-chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.response || 'Error fetching advice.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'bot', content: 'An error occurred.' }]);
    }

    setInput('');
  };

  return (
    <>
      {/* Chat Icon */}
      <ChatIcon onClick={() => setIsOpen(!isOpen)}>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: '2rem', height: '2rem' }}
        >
          <path d="M12 2a10 10 0 100 20h4.89a2 2 0 001.4-.58l2.32-2.33A2 2 0 0022 17.1V12a10 10 0 00-10-10zM6.3 9.7a1 1 0 111.4-1.4 1 1 0 01-1.4 1.4zm5.7 0a1 1 0 111.4-1.4 1 1 0 01-1.4 1.4zm5.7 0a1 1 0 111.4-1.4 1 1 0 01-1.4 1.4z" />
        </svg>
      </ChatIcon>

      {/* Chatbox */}
      {isOpen && (
        <ChatboxContainer>
          <ChatHeader>
            <h3>Chatbot</h3>
            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
          </ChatHeader>
          <ChatMessages>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <MessageBubble role={msg.role}>{msg.content}</MessageBubble>
              </div>
            ))}
          </ChatMessages>
          <ChatInputContainer>
            <ChatInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <SendButton onClick={sendMessage}>Send</SendButton>
          </ChatInputContainer>
        </ChatboxContainer>
      )}
    </>
  );
};

export default Chatbot;
