from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.crud.role import role
from app.schemas.roles_schema import RoleCreate, RoleUpdate, RoleSchema, RoleResponse
from app.utils.responses_utils import (
    success_response,
    error_response,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)

router = APIRouter()

# CREATE
@router.post("/", response_model=RoleSchema)
def create_role(role_in: RoleCreate, db: Session = Depends(get_db)):
    existing_role = role.get_by_name(db, name=role_in.name)
    if existing_role:
        return error_response(
            message="Role already exists",
            errors={"name": "Duplicate role"},
            status_code=HTTP_400_BAD_REQUEST
        )

    new_role = role.create(db, obj_in=role_in)
    return success_response(
        data=RoleSchema.model_validate(new_role).model_dump(
            exclude_none=True,
            mode="json"  # Mode JSON akan otomatis menangani serialisasi datetime
        ),
        message="Role created successfully",
        status_code=HTTP_201_CREATED
    )

# READ ALL
@router.get("/", response_model=list[RoleResponse])
def get_roles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    roles = role.get_multi(db, skip=skip, limit=limit)
    # Menggunakan exclude_none=True dan mengkonversi datetime secara eksplisit
    roles_data = [
        RoleResponse.model_validate(r).model_dump(
            exclude_none=True,  # Tidak menyertakan nilai None
            mode="json"  # Mode JSON akan otomatis menangani serialisasi datetime
        ) 
        for r in roles
    ]
    return success_response(
        data=roles_data,
        message="Roles retrieved successfully",
        status_code=HTTP_200_OK
    )

# READ ONE
@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db: Session = Depends(get_db)):
    db_role = role.get(db, id=role_id)
    if not db_role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )
    return success_response(
        data=RoleResponse.model_validate(db_role).model_dump(
            exclude_none=True,
            mode="json"  # Mode JSON akan otomatis menangani serialisasi datetime
        ),
        message="Role retrieved successfully",
        status_code=HTTP_200_OK
    )

# UPDATE
@router.put("/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: int, 
    role_in: RoleUpdate, 
    db: Session = Depends(get_db)
):
    db_role = role.get(db, id=role_id)
    if not db_role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    updated_role = role.update(db, db_obj=db_role, obj_in=role_in)
    return success_response(
        data=RoleResponse.model_validate(updated_role).model_dump(
            exclude_none=True,
            mode="json"  # Mode JSON akan otomatis menangani serialisasi datetime
        ),
        message="Role updated successfully",
        status_code=HTTP_200_OK
    )

# PATCH (Partial Update)
@router.patch("/{role_id}", response_model=RoleResponse)
def partial_update_role(
    role_id: int, 
    role_in: RoleUpdate, 
    db: Session = Depends(get_db)
):
    db_role = role.get(db, id=role_id)
    if not db_role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    # Hanya update fields yang disediakan
    update_data = role_in.model_dump(exclude_unset=True)
    updated_role = role.update(db, db_obj=db_role, obj_in=update_data)
    
    return success_response(
        data=RoleResponse.model_validate(updated_role).model_dump(
            exclude_none=True,
            mode="json"  # Mode JSON akan otomatis menangani serialisasi datetime
        ),
        message="Role partially updated successfully",
        status_code=HTTP_200_OK
    )

# DELETE
@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    db_role = role.get(db, id=role_id)
    if not db_role:
        return error_response(
            message="Role not found",
            errors={"role_id": "Role not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    # Simpan data role sebelum dihapus untuk digunakan dalam respons
    role_data = RoleResponse.model_validate(db_role).model_dump(
        exclude_none=True,
        mode="json"  # Mode JSON akan otomatis menangani serialisasi datetime
    )
    
    # Hapus role
    role.remove(db, id=role_id)
    
    return success_response(
        data=role_data,
        message="Role deleted successfully",
        status_code=HTTP_200_OK
    )
