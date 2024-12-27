import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import "./App.css";
import { sendMessageToAPI, uploadFileToApi } from "./apiHelper";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "How can I assist you today?",
    },
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false); // Track if bot is typing

  const handleFileUpload = async (file) => {
    try {
      const responseMessage = await uploadFileToApi(file);
      alert(responseMessage);
    } catch (error) {
      console.error("Error handling file upload:", error);
      alert("There was an error uploading the file.");
    }
  };

  const handleSendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
    ]);

    setIsBotTyping(true); // Show the typing indicator

    try {
      const botResponse = await sendMessageToAPI(message);
      setIsBotTyping(false); // Stop the typing indicator

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botResponse }, // Add backend response to messages
      ]);
    } catch (error) {
      console.error("Error handling message:", error);
      setIsBotTyping(false); // Stop the typing indicator
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  return (
    <div className="app">
      <ChatWindow messages={messages} isBotTyping={isBotTyping} />
      <ChatInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} />
    </div>
  );
}

export default App;
