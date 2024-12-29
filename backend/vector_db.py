import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings  # type: ignore # Updated import
from langchain_community.vectorstores import Pinecone
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec, Index
from PyPDF2 import PdfReader  # Library for reading PDF files
import re

# Load environment variables from .env file
load_dotenv()

# Initialize Pinecone with API key
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Check if the index exists, create it if not
index_name = "knowledge-base"
if index_name not in pinecone.list_indexes().names():
    pinecone.create_index(
        name=index_name,
        dimension=1536,  # Set this to the embedding dimension
        metric="cosine",  # Choose your distance metric (e.g., cosine, euclidean)
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),  # Adjust to a supported region
    )

# Define the host from Pinecone dashboard
host = os.getenv("PINECONE_HOST")  # Ensure this is set in your .env file

# Initialize the Index with API key and host
index = Index(index_name=index_name, host=host, api_key=os.getenv("PINECONE_API_KEY"))

# Initialize LangChain components
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

# Function to process and store embeddings in Pinecone
# Function to sanitize vector IDs
def sanitize_id(text):
    # Replace non-ASCII characters and whitespace with underscores
    return re.sub(r"[^\x00-\x7F]+", "", text).replace(" ", "_")

# Function to process and store embeddings in Pinecone
def store_embeddings_in_pinecone(docs):
    for i, doc in enumerate(docs):
        chunks = text_splitter.split_text(doc)
        for chunk in chunks:
            embedding = embeddings.embed_query(chunk)
            vector_id = sanitize_id(f"doc-{i}-{chunk[:30]}")  # Generate sanitized ID
            index.upsert([{
                "id": vector_id,  # Use sanitized ID
                "values": embedding,
                "metadata": {"text": chunk}
            }])

# Function to read text file contents
def process_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return content

# Function to read PDF file contents
def process_pdf_file(file_path):
    content = ""
    reader = PdfReader(file_path)
    for page in reader.pages:
        content += page.extract_text()  # Extract text from each page
    return content

# Determine file type and process accordingly
def process_file(file_path):
    if file_path.endswith('.txt'):
        return process_text_file(file_path)
    elif file_path.endswith('.pdf'):
        return process_pdf_file(file_path)
    else:
        raise ValueError("Unsupported file type. Please provide a .txt or .pdf file.")

# Example usage to process a file
# file_path = "documents/bank policy document sample.pdf"  # Replace with your file path
# if os.path.exists(file_path):
#     try:
#         file_content = process_file(file_path)
#         store_embeddings_in_pinecone([file_content])
#         print(f"File '{file_path}' processed and data stored in Pinecone!")
#     except ValueError as e:
#         print(e)
# else:
#     print(f"File '{file_path}' does not exist!")
