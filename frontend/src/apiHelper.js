export async function sendMessageToAPI(query) {
  try {
    const response = await fetch("http://localhost:8000/api?query=" + encodeURIComponent(query));
    const data = await response.json();
    console.log("API response:", data); // Log the response for debugging
    return data.response;
  } catch (error) {
    console.error("Error fetching API:", error);
    return "Sorry, I couldn't process your request.";
  }
}

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