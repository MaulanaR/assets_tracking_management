from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, Dict, Any, Union

class UserBase(BaseModel):
    email: EmailStr
    
    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    password_confirm: str
    is_active: bool = True
    role_id: Optional[int] = None
    apu: Optional[Dict[str, Any]] = None
    
    @validator('password_confirm')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    role_id: Optional[int] = None
    apu: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class UserSchema(UserBase):
    id: int
    is_active: bool
    role_id: Optional[int] = None
    apu: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UserResponse(UserSchema):
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UserInDB(UserSchema):
    password: str
