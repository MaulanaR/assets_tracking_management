from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.roles_model import RolesModel
from app.schemas.roles_schema import RoleCreate, RoleUpdate, RoleSchema
from app.utils.responses_utils import (
    success_response,
    error_response,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)

router = APIRouter(prefix="/roles", tags=["Roles"])

# Dependency DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE
@router.post("/", response_model=RoleSchema)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    existing_role = db.query(RolesModel).filter(RolesModel.name == role.name).first()
    if existing_role:
        return error_response(
            message="Role already exists",
            errors={"name": "Duplicate role"},
            status_code=HTTP_400_BAD_REQUEST
        )

    new_role = RolesModel(name=role.name, description=role.description)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return success_response(
        data=RoleSchema.model_validate(new_role).model_dump(),
        message="Role created successfully",
        status_code=HTTP_201_CREATED
    )

# READ ALL
@router.get("/", response_model=list[RoleSchema])
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(RolesModel).all()
    roles_data = [RoleSchema.model_validate(role).model_dump() for role in roles]
    return success_response(
        data=roles_data,
        message="Roles retrieved successfully",
        status_code=HTTP_200_OK
    )

# READ ONE
@router.get("/{role_id}", response_model=RoleSchema)
def get_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(RolesModel).filter(RolesModel.id == role_id).first()
    if not role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )
    return success_response(
        data=RoleSchema.model_validate(role).model_dump(),
        message="Role retrieved successfully",
        status_code=HTTP_200_OK
    )

# UPDATE
@router.put("/{role_id}", response_model=RoleSchema)
def update_role(role_id: int, role_data: RoleUpdate, db: Session = Depends(get_db)):
    role = db.query(RolesModel).filter(RolesModel.id == role_id).first()
    if not role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    if role_data.name is not None:
        role.name = role_data.name
    if role_data.description is not None:
        role.description = role_data.description

    db.commit()
    db.refresh(role)
    return success_response(
        data=RoleSchema.model_validate(role).model_dump(),
        message="Role updated successfully",
        status_code=HTTP_200_OK
    )

# DELETE
@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(RolesModel).filter(RolesModel.id == role_id).first()
    if not role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    # Simpan data role sebelum dihapus untuk digunakan dalam respons
    role_data = RoleSchema.model_validate(role).model_dump()
    
    # Hapus role
    db.delete(role)
    db.commit()
    
    return success_response(
        data=role_data,
        message="Role deleted successfully",
        status_code=HTTP_200_OK
    )
