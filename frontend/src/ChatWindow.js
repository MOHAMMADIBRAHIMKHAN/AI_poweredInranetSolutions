import React from "react";

function ChatWindow({ messages, isBotTyping }) {
  const formatMessage = (text) => {
    return text
      ? text.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))
      : null; // Handle cases where text is undefined
  };

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.sender === "bot" ? (
            formatMessage(msg.text) // Format bot response
          ) : (
            msg.text
          )}
        </div>
      ))}
      {isBotTyping && (
        <div className="message bot">
          <span className="typing-indicator">...</span>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
