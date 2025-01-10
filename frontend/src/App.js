import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import "./App.css";
import "./sideBarMenu"
import { sendMessageToAPI, uploadFileToApi } from "./apiHelper";
import { SideMenuBtn } from "./sideBarMenu";

function App() {
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle
  const [hasInteracted, setHasInteracted] = useState(false); // Tracks if user has sent the first query

  // Load chat history on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedHistory);
    if (savedHistory.length > 0) {
      setMessages(savedHistory[savedHistory.length - 1].messages);
    }
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const updatedHistory = [
        ...chatHistory.slice(0, -1),
        { title: `Chat ${chatHistory.length + 1}`, messages },
      ];
      setChatHistory(updatedHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    }
  }, [messages]);

  const handleFileUpload = async (file) => {
    try {
      const responseMessage = await uploadFileToApi(file);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: responseMessage },
      ]);
    } catch (error) {
      console.error("Error handling file upload:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "There was an error uploading the file." },
      ]);
    }
  };

  const handleSendMessage = async (message) => {
    if (!hasInteracted) setHasInteracted(true); // Mark as interacted on first query

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
    ]);

    setIsBotTyping(true);

    try {
      const botResponse = await sendMessageToAPI(message);
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
    } finally {
      setIsBotTyping(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasInteracted(false);
  };

  const handleSelectChat = (index) => {
    setMessages(chatHistory[index].messages);
    setHasInteracted(true)
    
  };

  return (
    <div className="app">
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
         <button className="close-btn" onClick={toggleSidebar}>
          Close
        </button> 
        <h2>Chat History</h2>
        <button onClick={handleNewChat} className="new-chat-btn">
          New Chat
        </button>
        <ul>
          {chatHistory.map((chat, index) => (
            <li key={index} onClick={() => handleSelectChat(index)}>
              {chat.title || `Chat ${index + 1}`}
            </li>
          ))}
        </ul>
      </div>
    
      <div
        className={`chat-window-wrapper ${
          isSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <ChatWindow messages={messages} isBotTyping={isBotTyping} />
      </div>
      <div
        className={`chat-input-container ${
          hasInteracted ? "bottom" : "center"
        }`}
      >
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}

export default App;
