from pydantic import BaseModel, Field
from datetime import datetime
from typing import Union
from enum import Enum

class AssetStatusEnum(str, Enum):
    available = "available"
    unavailable = "unavailable"

# Skema dasar untuk fields yang digunakan bersama
class Asset(BaseModel):
    code : Union[str, None] = None
    name : Union[str]
    price: Union[float, None] = None
    attachment: Union[str, None] = None
    category_id: Union[int, None] = Field(default=None, foreign_key="categories.id")
    status: AssetStatusEnum = AssetStatusEnum.available
    created_by: Union[int, None] = None
    updated_by: Union[int, None] = None
    deleted_at: Union[datetime, None] = None

    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)


# Skema untuk membuat
class ParamCreate(Asset):
    pass

# Skema untuk put
class ParamPUT(Asset):
    pass

# Skema untuk patch
class ParamPatch(BaseModel):
    code : Union[str, None] = None
    name : Union[str, None] = None
    price: Union[float, None] = None
    attachment: Union[str, None] = None
    category_id: Union[int, None] = None
    status: Union[AssetStatusEnum, None] = None
    created_by: Union[int, None] = None
    updated_by: Union[int, None] = None
    deleted_at: Union[datetime, None] = None

# Skema untuk response dengan id
class ResponseSchema(Asset):
    id: int
    created_at: datetime
    updated_at: datetime
    created_by_user: Union[str, None] = None
    updated_by_user: Union[str, None] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
