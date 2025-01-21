import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import "./App.css";
import {
  fetchChatHistory,
  saveChatToDatabase,
  deleteChatFromDatabase,
  uploadFileToApi,
  sendMessageToAPI,
} from "./apiHelper";
import sidebarIcon from './assets/sidebar-right-svgrepo-com.svg';

function App() {
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Load chat history from the database on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const data = await fetchChatHistory();
        console.log("chatHistory Loaded:" ,data)
        setChatHistory(data.chats);

        // if (data.chats.length > 0) {
        //   const latestChat = data.chats[data.chats.length - 1];
        //   setMessages(latestChat.messages);
        //   setCurrentChatId(latestChat.id);
        // }
      } catch (error) {
        console.error(error.message);
      }
    };
    loadChatHistory();
  }, []);

  const handleSendMessage = async (message) => {
    if (!hasInteracted) setHasInteracted(true);

    const newMessages = [...messages, { sender: "user", text: message }];
    setMessages(newMessages);

    setIsBotTyping(true);

    try {
      const botResponse = await sendMessageToAPI(message);
      const updatedMessages = [...newMessages, { sender: "bot", text: botResponse }];
      setMessages(updatedMessages);

      if (!currentChatId) {
        const title = `Chat ${chatHistory.length + 1}`;
        const updatedHistory = [...chatHistory, { id: null, title }];
        setChatHistory(updatedHistory);
        const savedChat = await saveChatToDatabase(title, updatedMessages);
        setCurrentChatId(savedChat.chat_id);
      } else {
        await saveChatToDatabase(chatHistory.find(chat => chat.id === currentChatId)?.title, updatedMessages);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleSelectChat = (index) => {
    const selectedChat = chatHistory[index];
  
    // Safety check: Ensure selectedChat exists
    if (!selectedChat || !selectedChat.messages) {
      console.error("Invalid chat selected or chat has no messages:", selectedChat);
      return;
    }
  
    console.log("Selected chat:", selectedChat); // Debugging console output
  
    // Update the state with selected chat messages
    setMessages(selectedChat.messages);
    setCurrentChatId(selectedChat.id);
    setHasInteracted(true);
  };
  

  const handleNewChat = () => {
    setMessages([]);
    setHasInteracted(false);
    setCurrentChatId(null);
  };

  const handleDeleteChat = async (chat_id) => {
    try {
      await deleteChatFromDatabase(chat_id);
  
      // Remove the deleted chat from the chatHistory state
      setChatHistory((prevHistory) => prevHistory.filter((chat) => chat.id !== chat_id));
  
      // Clear messages if the deleted chat was active
      if (currentChatId === chat_id) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
       <button className="close-btn" onClick={toggleSidebar}>
         <img
         src={sidebarIcon}
         alt="Close Sidebar"
        />
        </button>
        <h2>Chat History</h2>
        <button onClick={handleNewChat} className="new-chat-btn">
          New Chat
        </button>
        <ul>
          {chatHistory.map((chat,index) => (
            <li key={chat.id || `chat-${index}`} className="chat-history-item">
              <span onClick={() => handleSelectChat(index)}>
              {chat.title || `Chat ${index + 1}`}
              </span>
              <button
                className="delete-chat-btn"
                onClick={() => handleDeleteChat(chat.id)}
              >
                🗑️
              </button>
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
          onFileUpload={uploadFileToApi}
        />
      </div>
    </div>
  );
}

export default App;
