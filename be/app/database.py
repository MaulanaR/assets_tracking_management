from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Set DB Connection from ENV
DB_URL = os.getenv("DB_URL")
engine = create_engine(
  DB_URL, echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()