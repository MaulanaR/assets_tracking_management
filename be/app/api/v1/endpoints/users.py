from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.crud.user import user
from app.models.users_model import UsersModel
from app.schemas.users_schema import UserCreate, UserUpdate, UserSchema, UserResponse
from app.utils.responses_utils import (
    success_response,
    error_response,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)

router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Create new user / Sign up
    """
    # Check if user with this email already exists
    db_user = user.get_by_email(db, email=user_in.email)
    if db_user:
        return error_response(
            message="Email already registered",
            errors={"email": "This email is already registered"},
            status_code=HTTP_400_BAD_REQUEST
        )
    
    # Create new user
    new_user = user.create(db, obj_in=user_in)
    
    # Return response without password
    return success_response(
        data=UserSchema.model_validate(new_user).model_dump(
            exclude={"password"}, 
            exclude_none=True,
            mode="json"
        ),
        message="User registered successfully",
        status_code=HTTP_201_CREATED
    )

@router.get("/me", response_model=UserResponse)
def read_user_me():
    """
    Get current user
    """
    # This will be implemented later with JWT auth
    pass

@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID
    """
    db_user = user.get(db, id=user_id)
    if not db_user:
        return error_response(
            message="User not found",
            errors={"user_id": "User not found"},
            status_code=HTTP_404_NOT_FOUND
        )
        
    return success_response(
        data=UserResponse.model_validate(db_user).model_dump(
            exclude={"password"}, 
            exclude_none=True,
            mode="json"
        ),
        message="User retrieved successfully",
        status_code=HTTP_200_OK
    )

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int, 
    user_in: UserUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update user
    """
    db_user = user.get(db, id=user_id)
    if not db_user:
        return error_response(
            message="User not found",
            errors={"user_id": "User not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    # Check email unique if changing email
    if user_in.email and user_in.email != db_user.email:
        if user.get_by_email(db, email=user_in.email):
            return error_response(
                message="Email already registered",
                errors={"email": "This email is already registered by another user"},
                status_code=HTTP_400_BAD_REQUEST
            )
    
    updated_user = user.update(db, db_obj=db_user, obj_in=user_in)
    return success_response(
        data=UserResponse.model_validate(updated_user).model_dump(
            exclude={"password"},
            exclude_none=True,
            mode="json"
        ),
        message="User updated successfully",
        status_code=HTTP_200_OK
    )

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete user
    """
    db_user = user.get(db, id=user_id)
    if not db_user:
        return error_response(
            message="User not found",
            errors={"user_id": "User not found"},
            status_code=HTTP_404_NOT_FOUND
        )
    
    # Save user data before deletion for response
    user_data = UserSchema.model_validate(db_user).model_dump(
        exclude={"password"},
        exclude_none=True,
        mode="json"
    )
    
    # Delete user
    user.remove(db, id=user_id)
    
    return success_response(
        data=user_data,
        message="User deleted successfully",
        status_code=HTTP_200_OK
    )
