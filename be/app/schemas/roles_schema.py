from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Skema dasar untuk fields yang digunakan bersama
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)

# Skema untuk membuat role (tanpa id)
class RoleCreate(RoleBase):
    pass

# Skema untuk update role (fields opsional)
class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

# Skema untuk response dengan id
class RoleSchema(RoleBase):
    id: int
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class RoleResponse(RoleSchema):
    id: int
    name: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
