from pydantic import BaseModel
from datetime import datetime
from typing import Union

# Skema dasar untuk fields yang digunakan bersama
class EmployeeAsset(BaseModel):
    asset_id : Union[int]
    employee_id : Union[int]
    assign_date : Union[datetime]
    condition_id : Union[int]
    updated_at : Union[datetime, None] = None
    attachment: Union[str, None] = None
    
    class Config:
        from_attributes = True  # penting untuk konversi dari SQLAlchemy model (pengganti orm_mode di Pydantic v2)


# Skema untuk membuat
class ParamCreate(EmployeeAsset):
    pass

# Skema untuk put
class ParamPUT(EmployeeAsset):
    pass

# Skema untuk patch
class ParamPatch(EmployeeAsset):
    asset_id : Union[int, None] = None
    employee_id : Union[int, None] = None
    assign_date : Union[datetime, None] = None
    condition_id : Union[int, None] = None

    pass

# Skema untuk response dengan id
class ResponseSchema(EmployeeAsset):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
