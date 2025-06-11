import styles from './ChatWindow.module.css';

export default function ChatWindow({ messages, loading }) {
  return (
    <div className={styles['chat-window']}>
      {messages.map((msg, idx) => {
        // Extract text safely
        let displayText = "";
        if (typeof msg.text === "string") {
          displayText = msg.text;
        } else if (msg.text && Array.isArray(msg.text.parts)) {
          displayText = msg.text.parts.join("");
        } else {
          // fallback for unknown structure
          displayText = JSON.stringify(msg.text);
        }

        return (
          <div key={idx} className={`${styles.message} ${styles[msg.sender]}`}>
            <span>{displayText}</span>
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
