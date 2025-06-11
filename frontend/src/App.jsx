import { useState } from 'react';
import axios from 'axios';
import './App.css';
import ChatWindow from './components/ChatWindow.jsx';

function App() {
  // State for chat messages, initialized with a greeting from "Tina"
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `I'm Tina. I help you choose the right insurance policy for you. May I ask a few personal questions 
      to make sure I recommend the best policy for you?`
    }
  ]);
  // State for the current input value
  const [input, setInput] = useState("");
  // State to indicate if a request is in progress
  const [loading, setLoading] = useState(false);
// Base URL for the API, can be set via environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handles sending a message when the user submits input
  const handleSubmit = async () => {
    if (!input.trim()) return; // Ignore empty input

    // Add the user's message to the chat
    const newUserMessage = {
      sender: "user",
      text: input
    };
    setMessages((prev) => [...prev, newUserMessage]); 
    setInput(""); // Clear input field
    setLoading(true); // Show loading indicator

    try {
      // Send the user's message to the backend API
      const response = await axios.post(`${API_BASE_URL}/chat`, { message: input });
      // Add the AI's response to the chat
      const aiMessage = {
        sender: "ai",
        text: response.data.response
      };
      setMessages((prev) => [...prev, aiMessage]); 
    } catch (error) {
      // Handle errors by showing a friendly message
      console.error("Error sending message:", error);
      const errorMessage = {
        sender: "ai",
        text: "Sorry, something went wrong. Please try again later."
      };
      setMessages((prev) => [...prev, errorMessage]); 
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handles pressing Enter to submit the message (without Shift for new line)
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="app-container">
      {/* Chat window displays the conversation */}
      <ChatWindow messages={messages} loading={loading} />
      <div className='input-area'>
        {/* Input field for user messages */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}
          onKeyPress={handleKeyPress}
        />
        {/* Send button */}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>        
  );
}

export default App;
