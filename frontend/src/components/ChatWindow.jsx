import './ChatWindow.module.css';

export default function ChatWindow({ messages, loading }) {
   return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.sender}`}>
          <span>{msg.text}</span>
        </div>
      ))}
      {loading && (
        <div className="message ai">
          <span>Typing...</span>
        </div>
      )}
    </div>
  );
}
