from typing import Generator
from app.database import SessionLocal

def get_db() -> Generator:
    """
    Dependency untuk mendapatkan database session.
    Digunakan dengan Depends di FastAPI endpoints.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
