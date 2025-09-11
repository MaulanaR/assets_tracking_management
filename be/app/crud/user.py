from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.users_model import UsersModel
from app.schemas.users_schema import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[UsersModel, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[UsersModel]:
        """
        Get user by email
        """
        return db.query(UsersModel).filter(UsersModel.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> UsersModel:
        """
        Create new user with hashed password
        """
        # Remove password_confirm as it's only used for validation
        create_data = obj_in.model_dump(exclude={"password_confirm"})
        
        # Hash the password
        hashed_password = get_password_hash(obj_in.password)
        
        # Replace password with hashed one
        create_data["password"] = hashed_password
        
        db_obj = UsersModel(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: UsersModel,
        obj_in: UserUpdate or Dict[str, Any]
    ) -> UsersModel:
        """
        Update user, handling password hashing if needed
        """
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        
        # If password is being updated, hash it
        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])
            
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[UsersModel]:
        """
        Verify email/password and return user if valid
        """
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user


user = CRUDUser(UsersModel)
