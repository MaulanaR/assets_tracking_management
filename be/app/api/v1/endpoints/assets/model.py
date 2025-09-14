from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from app.api.v1.endpoints.users.model import UserModel
from app.api.v1.endpoints.departments.model import DepartmentModel
from app.api.v1.endpoints.branches.model import BranchModel
from app.api.v1.endpoints.categories.model import CategoryModel  # pastikan file model kategori ada
from app.api.v1.endpoints.conditions.model import ConditionModel  # pastikan file model kondisi ada
import enum
from datetime import datetime

class AssetStatusEnum(enum.Enum):
    available = "available"
    unavailable = "unavailable"

class AssetModel(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=True)
    attachment = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    status = Column(Enum(AssetStatusEnum), default=AssetStatusEnum.available, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship(UserModel, foreign_keys=[created_by])
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    updated_by = Column(Integer, ForeignKey("users.id"))
    updated_by_user = relationship(UserModel, foreign_keys=[updated_by])
    deleted_at = Column(DateTime, nullable=True, index=True)

    category = relationship(CategoryModel, foreign_keys=[category_id])
