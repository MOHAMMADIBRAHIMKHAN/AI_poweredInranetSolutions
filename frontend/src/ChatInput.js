import React, { useState } from "react";


function ChatInput({ onSendMessage, onFileUpload }) {
  const [inputValue, setInputValue] = useState("");
  const [isInputSent, setisInputSent] = useState(false)

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
      setisInputSent(true); // to move the input bar down
      setTimeout(() => setisInputSent(true),setInputValue("")) // reset after the animation 
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className={`chat-input-container ${isInputSent ? "bottom" : "center"}`}>
    <div className="chat-input">
      <label className="file-upload">
        📎
        <input type="file" onChange={handleFileUpload} style={{ display: "none" }} />
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <button onClick={handleSendClick}>Send</button>
    </div>
  </div>
);
}

export default ChatInput;
