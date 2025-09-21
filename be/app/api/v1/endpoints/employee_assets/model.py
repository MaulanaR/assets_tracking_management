from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from app.database import Base
from app.api.v1.endpoints.users.model import UserModel
from datetime import datetime

class EmployeeAssetModel(Base):
    __tablename__ = "employee_assets"

    id = Column(Integer, primary_key=True, index=True)
    assign_date = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    date = Column(Date, default=datetime.now, onupdate=datetime.now)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"))
    condition_id = Column(Integer, ForeignKey("conditions.id"))
    attachment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship(UserModel, foreign_keys=[created_by])
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    updated_by = Column(Integer, ForeignKey("users.id"))
    updated_by_user = relationship(UserModel, foreign_keys=[updated_by])
