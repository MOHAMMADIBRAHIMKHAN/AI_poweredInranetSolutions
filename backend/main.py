from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
import logging
from Search import search  # Import the `search` function

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()  # Load environment variables at app startup


@app.get("/api")
async def get_api(query: str):
    """
    API endpoint to handle user queries, perform search using vector database, 
    and generate responses with GPT model.
    """
    logging.info(f"Received query: {query}")
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not found.")

        client = OpenAI(api_key=api_key)

        # Retrieve relevant context from the vector database
        search_results = search(query, top_k=3)

        if not search_results:
            raise ValueError("No relevant results found in the vector database.")

        # Format retrieved documents
        retrieved_texts = [result["text"] for result in search_results]
        logging.info(f"Retrieved documents: {retrieved_texts}")

        # Build context for the model
        context = "\n".join(retrieved_texts)
        full_prompt = (
            "You are a professional AI assistant for a bank. Use the following context to answer the query:\n\n"
            f"{context}\n\n"
            f"Query: {query}"
        )

        # Create a completion
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional AI assistant for a bank."},
                {"role": "user", "content": full_prompt},
            ],
            temperature=0.7,
        )

        message = completion.choices[0].message.content
        logging.info(f"Generated response: {message}")
        return {"response": message}

    except ValueError as ve:
        logging.warning(f"No results: {str(ve)}")
        return {"response": "No relevant results found in the database for your query."}

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
