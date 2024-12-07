from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
import logging

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
    logging.info(f"Received query: {query}")
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not found.")
        
        client = OpenAI(api_key=api_key)

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": query},
            ],
            temperature=0.7
        )

        message = completion.choices[0].message.content
        logging.info(f"Generated response: {message}")
        return {"response": message}
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
