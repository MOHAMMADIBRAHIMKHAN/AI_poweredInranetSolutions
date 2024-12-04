import React from "react";


function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender === "bot" ? "bot" : "user"}`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;