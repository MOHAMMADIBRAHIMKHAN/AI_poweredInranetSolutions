# AI_poweredIntranetSolutions - AI-Powered Intranet Chat System  

![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)  ![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-teal?logo=fastapi)  ![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react) ![LangChain](https://img.shields.io/badge/LangChain-Enabled-green)  ![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-purple)  ![SQLite](https://img.shields.io/badge/SQLite-Database-blue?logo=sqlite)  ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)  

An AI-powered intranet chat platform with a ChatGPT-like interface. It allows users to upload documents, query them using natural language, and retrieve contextual answers. The system integrates **LangChain**, **Pinecone Vector DB**, and **SQLite** for document intelligence and conversation history management.  

---

🚀 Tech Stack  
- **React.js** – Frontend UI framework  
- **Python 3.9+ (FastAPI)** – Backend web framework  
- **LangChain** – Conversational AI framework with memory buffer  
- **Pinecone Vector DB** – Semantic search and embeddings storage  
- **SQLite** – Persistent chat history storage  
- **Tailwind CSS** – Modern UI styling  
- **Axios** – API communication between frontend & backend  

---

📋 Prerequisites  
- Python 3.9 or higher  
- pip (Python package installer)  
- Node.js + npm (for React frontend)  
- Git  
- Pinecone API key & environment variables  
- OpenAI (or similar LLM provider) API key  

---

🛠️ Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/yourusername/AI_poweredIntranetSolutions.git
cd AI_poweredIntranetSolutions
2. Backend Setup
bash
Copy code
cd backend
python -m venv .venv
source .venv/bin/activate     # Linux/Mac
.venv\Scripts\activate        # Windows

pip install -r ../requirements.txt
3. Environment Configuration
Create a .env file in the root directory and add your configuration variables:

env
Copy code
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENV=your_pinecone_environment
DATABASE_URL=sqlite:///chat_history.db
⚠️ Note: The .env file is ignored by Git for security purposes.

🏃‍♂️ How to Run

Step 1: Start the Backend (FastAPI)

bash
Copy code
cd backend
uvicorn main:app --reload
Step 2: Start the Frontend (React)

bash
Copy code
cd frontend
npm install
npm start
Step 3: Use the Application

Open browser at http://localhost:3000

Upload a document (PDF/TXT)

Start asking questions in the chat window

Review previous conversations in the sidebar (stored in SQLite)

📁 File Structure

bash
Copy code
AI_poweredIntranetSolutions/
├── backend/                 
│   ├── main.py              # FastAPI entry point
│   ├── Search.py            # Document search logic
│   ├── agentAi.py           # AI agent & LangChain logic
│   ├── dataBase.py          # SQLite handler
│   ├── models.py            # Data models
│   ├── vector_db.py         # Pinecone integration
│   ├── chat_history.db      # SQLite database
│   └── documents/           # Uploaded documents
│
├── frontend/                
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── ChatWindow.js    # Chat UI
│   │   ├── ChatInput.js     # Input field
│   │   ├── sideBarMenu.js   # Sidebar for history
│   │   ├── apiHelper.js     # API calls
│   │   └── index.js         # Entry point
│   ├── public/
│   └── package.json         # Frontend dependencies
│
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables (not tracked)
├── .gitignore
└── README.md                 # Documentation
🔧 Usage

Upload documents → PDFs or TXT files are parsed and embedded into Pinecone

Ask questions → LangChain retrieves context-aware answers

Sidebar history → Past conversations are stored in SQLite and displayed in UI

Memory buffer → Maintains conversational flow for more natural responses

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add some amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 Notes

Ensure both backend and frontend are running before using the app

Verify .env contains all required API keys and config values

For production deployment, consider Docker or process managers like PM2/systemd

🐛 Troubleshooting

Import Errors → Run pip install -r requirements.txt

Server Not Found → Ensure backend (FastAPI) and frontend (React) are running

Pinecone Issues → Verify API key and environment in .env

DB Errors → Ensure chat_history.db exists and is accessible

📧 Contact
For questions or support, please open an issue on this repository.

Built with ❤️ using React, FastAPI, LangChain, and Pinecone
