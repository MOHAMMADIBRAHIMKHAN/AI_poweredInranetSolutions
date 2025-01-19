import React from "react";

function ChatWindow({ messages = [], isBotTyping }) {  // Default messages to an empty array if undefined
  const formatMessage = (text) => {
    if (!text) return null;

    // Replace newlines with <br> and return as HTML
    const formattedText = text.replace(/\n/g, "<br />");

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: formattedText,
        }}
      />
    );
  };

  return (
    <div className="chat-window">
      {/* Ensure that messages is an array before calling .map */}
      {messages.length >= -1 ? (
        messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === "bot" ? formatMessage(msg.text) : msg.text}
          </div>
        ))
      ) : (
        console.log("NO messages")  // Show a fallback message when there are no messages
      )}
      
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
