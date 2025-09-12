
from sqlalchemy.orm import Session
from app.crud.role import role
from app.crud import base
from .model import *
from .struct import *
from app.utils.responses_utils import (
	success_response,
	error_response,
	HTTP_200_OK,
	HTTP_201_CREATED,
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
)

# Ini var operasi ke DB, semua operasi DB terkait department panggil ini
dbOps = base.CRUDBase(DepartmentModel)

def Create(param: ParamCreate, db: Session):
	existing_role = dbOps.get_by_field(db, "name", param.name)
	if existing_role:
		return error_response(
			message="Role already exists",
			errors={"name": "Duplicate role"},
			status_code=HTTP_400_BAD_REQUEST
		)
	new_role = dbOps.create(db, obj_in=param)
	return success_response(
		data=ResponseSchema.model_validate(new_role).model_dump(
			exclude_none=True,
			mode="json"
		),
		message="Role created successfully",
		status_code=HTTP_201_CREATED
	)

def GetAll(db: Session, skip: int = 0, limit: int = 100):
	roles = dbOps.get_multi(db, skip=skip, limit=limit)
	roles_data = [
		ResponseSchema.model_validate(r).model_dump(
			exclude_none=True,
			mode="json"
		)
		for r in roles
	]
	return success_response(
		data=roles_data,
		message="Roles retrieved successfully",
		status_code=HTTP_200_OK
	)

def GetById(id: int, db: Session):
	db_role = dbOps.get(db, id=id)
	if not db_role:
		return error_response(
			message="Role not found",
			errors={"id": "Role not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	return success_response(
		data=ResponseSchema.model_validate(db_role).model_dump(
			exclude_none=True,
			mode="json"
		),
		message="Role retrieved successfully",
		status_code=HTTP_200_OK
	)

def UpdateById(id: int, param: ParamPUT, db: Session):
	db_role = dbOps.get(db, id=id)
	if not db_role:
		return error_response(
			message="Role not found",
			errors={"id": "Role not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	updated_role = dbOps.update(db, db_obj=db_role, obj_in=param)
	return success_response(
		data=ResponseSchema.model_validate(updated_role).model_dump(
			exclude_none=True,
			mode="json"
		),
		message="Role updated successfully",
		status_code=HTTP_200_OK
	)

def PatchById(id: int, param: ParamPatch, db: Session):
	db_role = dbOps.get(db, id=id)
	if not db_role:
		return error_response(
			message="Role not found",
			errors={"id": "Role not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	update_data = param.model_dump(exclude_unset=True)
	updated_role = dbOps.update(db, db_obj=db_role, obj_in=update_data)
	return success_response(
		data=ResponseSchema.model_validate(updated_role).model_dump(
			exclude_none=True,
			mode="json"
		),
		message="Role partially updated successfully",
		status_code=HTTP_200_OK
	)

def DeleteById(id: int, db: Session):
	db_role = dbOps.get(db, id=id)
	if not db_role:
		return error_response(
			message="Role not found",
			errors={"id": "Role not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	role_data = ResponseSchema.model_validate(db_role).model_dump(
		exclude_none=True,
		mode="json"
	)
	dbOps.remove(db, id=id)
	return success_response(
		data=role_data,
		message="Role deleted successfully",
		status_code=HTTP_200_OK
	)
