import React from "react";

function ChatWindow({ messages, isBotTyping }) {
  const formatMessage = (text) => {
    if (!text) return null;

    // Replace newlines with <br> and return as HTML
    const formattedText = text.replace(/\n/g, "<br />");

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: formattedText, // Render HTML with <strong> and <br>
        }}
      />
    );
  };

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.sender === "bot" ? (
            formatMessage(msg.text) // Format bot response with HTML
          ) : (
            msg.text // Plain text for user messages
          )}
        </div>
      ))}
      {isBotTyping && (
        <div className="message bot">
          <span className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
