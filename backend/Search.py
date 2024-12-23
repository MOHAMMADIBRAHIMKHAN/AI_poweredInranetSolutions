from ast import Index
import os 
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings 
from pinecone import index
import pinecone
from regex import match

#load the environment variables 
load_dotenv()

#intialize embeddings and pinecone index 

embeddings = OpenAIEmbeddings(openai_api_key = os.getenv("OPENAI_API_KEY"))
host = os.getenv("PINECONE_HOST")
index_name = 'knowledge-base'
index = pinecone.Index(
    index_name = index_name,
    host = host,
    api_key = os.getenv("PINCONE_API_KEY")
)

#Function to format the result in paragraph
def format_to_paragraph(text):
   """Convert the given text into a paragraph by removing extra line breaks and spaces between words."""
   return " ".join(text.split())

#function to Search For Indes
def search( query : str , top_k : int=5 ):
    #convert query into vector
    query_vector  = embeddings.embed_query(query)

    #Perform Search In The Index
    result = index.query(
          vector = query_vector,
          top_k = top_k,
          include_metadata=True,
     )
    #Extract and Display The Meta Data
    return [
        {"text": format_to_paragraph(match["metadata"]["text"]), "score": match["score"]}
        for match in result["matches"]
    ]

#Example Usage
if __name__ == "__main__":
    query_text = input("Enter the query : ")
    result = search(query_text,top_k = 2)
    for i , res in enumerate( result , start = 1):
      print(f"Result {i} : {res["text"]} (score: {res["score"]})")



