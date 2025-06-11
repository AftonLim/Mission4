import { useState } from 'react';
import axios from 'axios';
import './App.css';
import ChatWindow from './components/ChatWindow.jsx';

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `I'm Tina. I help you choose the right insurance policy for you. May I ask a few personal questions 
      to make sure I recommend the best policy for you?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newUserMessage = {
      sender: "user",
      text: input
    };
    setMessages((prev) => [...prev, newUserMessage]); // ✅ typo fixed
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/chat", { message: input }); // ✅ fixed here
      const aiMessage = {
        sender: "ai",
        text: response.data.response
      };
      setMessages((prev) => [...prev, aiMessage]); // ✅ typo fixed
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        sender: "ai",
        text: "Sorry, something went wrong. Please try again later."
      };
      setMessages((prev) => [...prev, errorMessage]); // ✅ typo fixed
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="app-container">
      <ChatWindow messages={messages} loading={loading} />
      <div className='input-area'>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>        
  );
}

export default App;
