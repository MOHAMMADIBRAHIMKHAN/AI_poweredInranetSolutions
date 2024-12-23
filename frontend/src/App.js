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

const handleFileUpload = async (file) => {
  try{
const responseMessage = await uploadFileToApi(file)
  alert(responseMessage);
  }catch(error){
    console.error("Error handling file upload:", error);
    alert("There was an error uploading the file.");
  }
}


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
      <ChatInput onSendMessage={handleSendMessage}  onFileUpload={handleFileUpload} />
    </div>
  );
}

export default App;
