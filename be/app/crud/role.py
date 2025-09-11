from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.roles_model import RolesModel
from app.schemas.roles_schema import RoleCreate, RoleUpdate


class CRUDRole(CRUDBase[RolesModel, RoleCreate, RoleUpdate]):
    """
    CRUD operations for Role model
    """
    
    def get_by_name(self, db: Session, *, name: str) -> RolesModel:
        """
        Get role by name
        """
        return db.query(RolesModel).filter(RolesModel.name == name).first()


# Instantiate the CRUD object for roles
role = CRUDRole(RolesModel)
