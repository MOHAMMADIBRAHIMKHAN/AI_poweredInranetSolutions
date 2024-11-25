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