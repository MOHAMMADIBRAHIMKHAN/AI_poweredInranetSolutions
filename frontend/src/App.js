import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import "./App.css";
import { sendMessageToAPI } from "./apiHelper";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "How can I assist you today?",
    },
  ]);

  const handleSendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
    ]);

    try {
      const botResponse = await sendMessageToAPI(message);
      console.log("Bot Response:", botResponse); // Debug log
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error handling message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  return (
    <div className="app">
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
