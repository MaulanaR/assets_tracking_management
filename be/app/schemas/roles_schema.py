from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RoleSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)

class RoleCreate(RoleSchema):
    pass

class RoleUpdate(RoleSchema):
    name: str | None = None
    description: str | None = None

class RoleResponse(RoleSchema):
    id: int
    name: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)
