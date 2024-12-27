// apiHelper.js
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

export async function uploadFileToApi(file){
  const formData = new FormData();
  formData.append('file',file);

  try {
  const response = await fetch("http://localhost:8000/api/upload_document/", {
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