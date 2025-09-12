from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.api.v1.endpoints.users.model import UserModel
from datetime import datetime

class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, unique=False, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship(UserModel, foreign_keys=[created_by])
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    updated_by = Column(Integer, ForeignKey("users.id"))
    updated_by_user = relationship(UserModel, foreign_keys=[updated_by])
    deleted_at = Column(DateTime, nullable=True, index=True)
