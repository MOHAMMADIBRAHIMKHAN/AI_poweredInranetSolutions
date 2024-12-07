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
