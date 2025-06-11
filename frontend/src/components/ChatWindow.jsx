import styles from './ChatWindow.module.css';
import ReactMarkdown from 'react-markdown';

export default function ChatWindow({ messages, loading }) {
  return (
    <div className={styles['chat-window']}>
      {messages.map((msg, idx) => {
        let displayText = "";

        // Safely extract text
        if (typeof msg.text === "string") {
          displayText = msg.text;
        } else if (msg.text && Array.isArray(msg.text.parts)) {
          displayText = msg.text.parts.join("");
        } else {
          displayText = JSON.stringify(msg.text);
        }

        return (
          <div key={idx} className={`${styles.message} ${styles[msg.sender]}`}>
            <ReactMarkdown>{displayText}</ReactMarkdown>
          </div>
        );
      })}
      
      {loading && (
        <div className={`${styles.message} ${styles.ai}`}>
          <span>Typing...</span>
        </div>
      )}
    </div>
  );
}
