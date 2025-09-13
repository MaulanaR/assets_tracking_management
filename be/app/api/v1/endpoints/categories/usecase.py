
from sqlalchemy.orm import Session
from app.crud import base
from .model import *
from .struct import *
from fastapi import Request
from app.utils.responses_utils import (
	success_response,
	error_response,
	HTTP_200_OK,
	HTTP_201_CREATED,
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
)

# Ini var operasi ke DB, semua operasi DB panggil ini
dbOps = base.CRUDBase(CategoryModel)
moduleName = "Category"

def Create(param: ParamCreate, db: Session):
	existing_data = dbOps.get_by_field(db, "name", param.name)
	if existing_data:
		return error_response(
			message=f"{moduleName} already exists",
			errors={"name": f"Duplicate {moduleName} name"},
			status_code=HTTP_400_BAD_REQUEST
		)
	
	# validate code
	existing_data = dbOps.get_by_field(db, "code", param.code)
	if existing_data:
		return error_response(
			message=f"{moduleName} already exists",
			errors={"name": f"Duplicate {moduleName} code"},
			status_code=HTTP_400_BAD_REQUEST
		)
	
	newData = dbOps.create(db, obj_in=param)
	return success_response(
		data=ResponseSchema.model_validate(newData).model_dump(
			exclude_none=True,
			mode="json"
		),
		message=f"{moduleName} created successfully",
		status_code=HTTP_201_CREATED
	)

def GetAll(db: Session, page: int = 1, limit: int = 10, request: Request = None):
	# Calculate skip from page number
	skip = (page - 1) * limit
	
	# Get data with pagination
	datas = dbOps.get_multi(db, skip=skip, limit=limit, request=request)
	
	# Get total count for pagination
	total_count = dbOps.count(db)
	total_pages = (total_count + limit - 1) // limit if total_count > 0 else 0
	
	# Format the response items
	respData = [
		ResponseSchema.model_validate(r).model_dump(
			exclude_none=True,
			mode="json"
		)
		for r in datas
	]
	
	# Create response with structured data object containing list and pagination
	formatted_data = {
		"list": respData,
		"pagination": {
			"page": page,
			"limit": limit,
			"total": total_count,
			"total_pages": total_pages,
			"has_next": page < total_pages,
			"has_prev": page > 1
		}
	}
	
	return success_response(
		data=formatted_data,
		message=f"{moduleName}s retrieved successfully",
		status_code=HTTP_200_OK
	)

def GetById(id: int, db: Session):
	oldData = dbOps.get(db, id=id)
	if not oldData:
		return error_response(
			message=f"{moduleName} not found",
			errors={"id": f"{moduleName} not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	return success_response(
		data=ResponseSchema.model_validate(oldData).model_dump(
			exclude_none=True,
			mode="json"
		),
		message=f"{moduleName} retrieved successfully",
		status_code=HTTP_200_OK
	)

def UpdateById(id: int, param: ParamPUT, db: Session):
	oldData = dbOps.get(db, id=id)
	if not oldData:
		return error_response(
			message=f"{moduleName} not found",
			errors={"id": f"{moduleName} not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	
	# validate code
	notUnique = dbOps.get_by_field(db, "code", param.code)
	if notUnique:
		return error_response(
			message=f"{moduleName} already exists",
			errors={"name": f"Duplicate {moduleName} code"},
			status_code=HTTP_400_BAD_REQUEST
		)
	
	newData = dbOps.update(db, db_obj=oldData, obj_in=param)
	return success_response(
		data=ResponseSchema.model_validate(newData).model_dump(
			exclude_none=True,
			mode="json"
		),
		message=f"{moduleName} updated successfully",
		status_code=HTTP_200_OK
	)

def PatchById(id: int, param: ParamPatch, db: Session):
	oldData = dbOps.get(db, id=id)
	if not oldData:
		return error_response(
			message=f"{moduleName} not found",
			errors={"id": f"{moduleName} not found"},
			status_code=HTTP_404_NOT_FOUND
		)

	# validate code
	if param.code != oldData.code:
		notUnique = dbOps.get_by_field(db, "code", param.code)
		if notUnique:
			return error_response(
				message=f"{moduleName} already exists",
				errors={"name": f"Duplicate {moduleName} code"},
				status_code=HTTP_400_BAD_REQUEST
			)
	
	update_data = param.model_dump(exclude_unset=True)
	newData = dbOps.update(db, db_obj=oldData, obj_in=update_data)
	return success_response(
		data=ResponseSchema.model_validate(newData).model_dump(
			exclude_none=True,
			mode="json"
		),
		message=f"{moduleName} partially updated successfully",
		status_code=HTTP_200_OK
	)

def DeleteById(id: int, db: Session):
	oldData = dbOps.get(db, id=id)
	if not oldData:
		return error_response(
			message=f"{moduleName} not found",
			errors={"id": f"{moduleName} not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	data = ResponseSchema.model_validate(oldData).model_dump(
		exclude_none=True,
		mode="json"
	)
	dbOps.remove(db, id=id)
	return success_response(
		data=data,
		message=f"{moduleName} deleted successfully",
		status_code=HTTP_200_OK
	)
