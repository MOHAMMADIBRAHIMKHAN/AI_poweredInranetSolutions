from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from openai import OpenAI
from dotenv import load_dotenv
import os
import logging
from Search import search  # Import the `search` function
from vector_db import process_file, store_embeddings_in_pinecone 
import re

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()  # Load environment variables at app startup

# Memory for conversation context
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

PromptTemplate = (
    "You are a professional AI assistant for a bank. Use the following context "
    "and chat history to answer the query:\n\n"
    "Context:\n{context}\n\n"
    "Chat History:\n{chat_history}\n\n"
    "Query: {query}\n"
    "Please provide your response with line breaks (\\n) preserved where applicable."
)

def format_response_with_bold(response:str) -> str:
     """
    Replaces *keyword* in the response with <strong>keyword</strong> for bold formatting.
    """
     return re.sub(r"\*(.*?)\*", r"<bold>\1</bold>", response)

def run_chain(query: str, context: str, client, memory):
    """
    Run the chain to generate a response based on context and memory.
    """
    try:
        # Format chat history from memory
        chat_history = "\n".join(
            [f"{type(msg).__name__}: {msg.content}" for msg in memory.chat_memory.messages]
        )

        # Generate the prompt
        prompt = PromptTemplate.format(
            context=context,
            chat_history=chat_history,
            query=query,
        )

        # Create a completion
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional AI assistant for a bank."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )

        # Extract and return the response
        response = completion.choices[0].message.content
        formatted_response = format_response_with_bold(response)

        # Update memory with user query and model response
        memory.chat_memory.add_user_message(query)
        memory.chat_memory.add_ai_message(formatted_response)

        return formatted_response

    except Exception as e:
        logging.error(f"Error in chain execution: {str(e)}")
        raise

@app.get("/api")
async def get_api(query: str):
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

        # Combine retrieved context
        context = "\n".join([result["text"] for result in search_results])

        # Run the chain
        response = run_chain(query=query, context=context, client=client, memory=memory)

        logging.info(f"Generated response: {response}")
        return {"response": response}

    except ValueError as ve:
        logging.warning(f"No results: {str(ve)}")
        return {"response": "No relevant results found in the database for your query."}

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload_document/")
async def upload_document(file: UploadFile = File(...)):
    """
    Endpoint to upload a document and store its contents in Pinecone.
    """
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)

        # Process the file and store embeddings in Pinecone
        logging.info(f"Processing file: {temp_file_path}")
        file_content = process_file(temp_file_path)
        store_embeddings_in_pinecone([file_content])

        # Remove the temporary file after processing
        os.remove(temp_file_path)

        return {"message": f"File '{file.filename}' uploaded and processed successfully!"}
    except ValueError as e:
        logging.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the file.")
                
