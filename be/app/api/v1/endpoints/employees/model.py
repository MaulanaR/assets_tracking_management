from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
from app.api.v1.endpoints.users.model import UserModel
from app.api.v1.endpoints.departments.model import DepartmentModel
from app.api.v1.endpoints.branches.model import BranchModel
from datetime import datetime

class EmployeeModel(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    attachment = Column(String, nullable=True)
    email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship(UserModel, foreign_keys=[created_by])
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    updated_by = Column(Integer, ForeignKey("users.id"))
    updated_by_user = relationship(UserModel, foreign_keys=[updated_by])
    deleted_at = Column(DateTime, nullable=True, index=True)

    department = relationship(DepartmentModel, foreign_keys=[department_id])
    branch = relationship(BranchModel, foreign_keys=[branch_id])
