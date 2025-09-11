from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# File SQLite akan bernama rixco_db.db
SQLALCHEMY_DATABASE_URL = "sqlite:///rixco_db.db"

engine = create_engine(
  SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
