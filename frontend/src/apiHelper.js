// apiHelper.js
const BASE_URL = "http://localhost:8000/api/chats";
export const sendMessageToAPI = async (message) => {
  try {
    const response = await fetch(`http://localhost:8000/api?query=${encodeURIComponent(message)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.response; // Ensure this matches the backend response structure
  } catch (error) {
    console.error("Error fetching response from API:", error);
    throw error;
  }
};

export async function uploadFileToApi(file_path){
  const formData = new FormData();
  formData.append('file',file_path);

  try {
  const response = await fetch(`http://localhost:8000/api/upload_document/`, {
    method : 'POST',
    body : formData,
  });
  if (! response.ok){
    throw new Error (`HTTP erro! Status: ${response.status}`);
  }

  const data =  await response.json();
  console.log("File Upload response: ", data);
  return data.message;
  }catch(error){
  console.error("Error uploading File : ", error)
  return "Try again Later"
  }
}

// Save a chat to the database
export const saveChatToDatabase = async (title, messages) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, messages }),
    });
    if (!response.ok) {
      throw new Error("Error saving chat to database");
    }
    return await response.json();  // Return the response to get the chat id
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
};

// Fetch all chat metadata (titles and IDs)
export const fetchChatHistory = async (title , message) => {
  const response = await fetch("http://localhost:8000/api/chats/");
  if (!response.ok) {
    throw new Error("Error fetching chat history");
  }
  return response.json();
};

// Fetch a specific chat's messages by ID
export const fetchSelectedChat = async (chat_id) => {
  try {
    const response = await fetch(`http://localhost:8000/api/chats/${chat_id}`);
    if (!response.ok) {
      throw new Error("Error fetching selected chat");
    }
    return await response.json();  // Return the chat data including messages
  } catch (error) {
    console.error("Error fetching selected chat:", error);
    throw error;
  }
};

//Delete a chat 
export const deleteChatFromDatabase = async (chat_id) => {
  try {
    const response = await fetch(`http://localhost:8000/api/chats/${chat_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete chat with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};