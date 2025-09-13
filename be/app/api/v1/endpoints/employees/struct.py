from pydantic import BaseModel
from datetime import datetime
from typing import Union, Dict, Any

# Skema dasar untuk fields yang digunakan bersama
class Employee(BaseModel):
    code : Union[str, None] = None
    name : Union[str]
    department_id: Union[int, None] = None
    branch_id: Union[int, None] = None
    address: Union[str, None] = None
    phone: Union[str, int, None] = None
    attachment: Union[str, None] = None
    email: Union[str, None] = None
    created_by: Union[int, None] = None
    updated_by: Union[int, None] = None
    deleted_at: Union[datetime, None] = None

    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)


# Skema untuk membuat
class ParamCreate(Employee):
    pass

# Skema untuk put
class ParamPUT(Employee):
    pass

# Skema untuk patch
class ParamPatch(Employee):
    code : Union[str, None] = None
    name : Union[str, None] = None
    description : Union[str, None] = None
    department_id: Union[int, None] = None
    branch_id: Union[int, None] = None
    address: Union[str, None] = None
    phone: Union[str, int,  None] = None
    attachment: Union[str, None] = None
    email: Union[str, None] = None
    created_by: Union[int, None] = None
    updated_by: Union[int, None] = None
    deleted_at: Union[datetime, None] = None
    pass

# Skema untuk response dengan id
class ResponseSchema(Employee):
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
