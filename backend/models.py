from sqlalchemy import Column, Integer, String, Text
from dataBase import Base

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    messages = Column(Text)  # JSON serialized messages
