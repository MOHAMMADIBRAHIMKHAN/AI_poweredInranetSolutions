import React, { useState } from "react";


function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [ file , setFile] = useState(null);

  const handleFileUpload = () => {
   if (file) {
   // onFileUpload(file);
    setFile(null);
   }else{
    alert('Pleasse Select File To Upload')
   }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="send-button" type="submit">
        Send
        </button>
        {/* <div className="file-input-container">
          <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0])
          }}
          />
          <button className='button-upload' 
          onClick={handleFileUpload}
          type='submit'>
            Upload  
          </button>
        </div> */}
    </form>
  );
}

export default ChatInput;
