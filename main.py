from fastapi import FastAPI
import random

app = FastAPI()

@app.get('/')
async def root():
    return { 'example' : 'This is an example', 'data' : 1090 }

@app.get('/random')
async def get_no():
    rn: int = random.randint(1,100)
    return {'number':rn,'limit':100}

@app.get('/random/{limit}')
async def set_limit(limit:int):
    rn: int = random.randint(0,limit)
    return {'number':rn,'limit':limit}

from openai import OpenAI
from dotenv import load_dotenv 
import os

@app.get('/api')
async def get_api(query: str):

   load_dotenv()
   client = OpenAI(api_key = os.getenv("OPENAI_API_KEY") ) 
   # type: ignore

   completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": query}
  ],
     temperature=0.7
)

   message = completion.choices[0].message.content
   print(message)
   return {"response": message}
