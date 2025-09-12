from pydantic import BaseModel
from datetime import datetime
from typing import Union

# Skema dasar untuk fields yang digunakan bersama
class Department(BaseModel):
    code : Union[str]
    name : Union[str]
    description : Union[str, None] = None
    
    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)


# Skema untuk membuat
class ParamCreate(Department):
    pass

# Skema untuk put
class ParamPUT(Department):
    pass

# Skema untuk patch
class ParamPatch(Department):
    code : Union[str, None] = None
    name : Union[str, None] = None
    description : Union[str, None] = None

    pass

# Skema untuk response dengan id
class ResponseSchema(Department):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
