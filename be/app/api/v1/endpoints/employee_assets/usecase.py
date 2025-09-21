
import app.utils.responses_utils as utils
from time import time
from sqlalchemy.orm import Session
from fastapi import Request, UploadFile
from app.crud import base
from .model import *
from .struct import *
import app.api.v1.endpoints.assets.usecase as assets
import app.api.v1.endpoints.employees.usecase as employees
import app.api.v1.endpoints.conditions.usecase as conditions
from app.utils.responses_utils import (
	success_response,
	error_response,
	HTTP_200_OK,
	HTTP_201_CREATED,
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
)

# Ini var operasi ke DB, semua operasi DB panggil ini
dbOps = base.CRUDBase(EmployeeAssetModel)
moduleName = "Employee-Asset"

async def Create(param: ParamCreate, db: Session, attachment: UploadFile = None):
	#validate asset id
	if param.asset_id:
		asset = assets.GetById(param.asset_id, db)
		if asset.status_code != HTTP_200_OK:
			return asset
		
	#validate employee id
	if param.employee_id:
		emp = employees.GetById(param.employee_id, db)
		if emp.status_code != HTTP_200_OK:
			return emp
	
	#validate condition id
	if param.condition_id:
		cond = conditions.GetById(param.condition_id, db)
		if cond.status_code != HTTP_200_OK:
			return cond
		
	# handle attachment
	if attachment:
		file_path = await assets.SaveAttachment(attachment)
		param.attachment = file_path

	newData = dbOps.create(db, obj_in=param)

	return success_response(
        data=endrict_response(db, newData),
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
        data=endrict_response(db, oldData),
        message=f"{moduleName} created successfully",
        status_code=HTTP_201_CREATED
    )

async def UpdateById(id: int, param: ParamPUT, db: Session, attachment: UploadFile = None):
	oldData = dbOps.get(db, id=id)
	if not oldData:
		return error_response(
			message=f"{moduleName} not found",
			errors={"id": f"{moduleName} not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	
	param.assign_date = oldData.assign_date
	param.updated_at = datetime.now()

	#validate asset id
	if param.asset_id and param.asset_id != oldData.asset_id:
		asset = assets.GetById(param.asset_id, db)
		if asset.status_code != HTTP_200_OK:
			return asset
		
	#validate employee id
	if param.employee_id and param.employee_id != oldData.employee_id:
		emp = employees.GetById(param.employee_id, db)
		if emp.status_code != HTTP_200_OK:
			return emp
	
	#validate condition id
	if param.condition_id and param.condition_id != oldData.condition_id:
		cond = conditions.GetById(param.condition_id, db)
		if cond.status_code != HTTP_200_OK:
			return cond
		
	# handle attachment
	if attachment:
		file_path = await assets.SaveAttachment(attachment)
		param.attachment = file_path
	
	newData = dbOps.update(db, db_obj=oldData, obj_in=param)
	
	return success_response(
        data=endrict_response(db, newData),
        message=f"{moduleName} created successfully",
        status_code=HTTP_201_CREATED
    )

async def PatchById(id: int, param: ParamPatch, db: Session, attachment: UploadFile = None):
	oldData = dbOps.get(db, id=id)

	param.assign_date = oldData.assign_date
	param.updated_at = datetime.now()

	if not oldData:
		return error_response(
			message=f"{moduleName} not found",
			errors={"id": f"{moduleName} not found"},
			status_code=HTTP_404_NOT_FOUND
		)
	
		#validate asset id
	if param.asset_id and param.asset_id != oldData.asset_id:
		asset = assets.GetById(param.asset_id, db)
		if asset.status_code != HTTP_200_OK:
			return asset
		
	#validate employee id
	if param.employee_id and param.employee_id != oldData.employee_id:
		emp = employees.GetById(param.employee_id, db)
		if emp.status_code != HTTP_200_OK:
			return emp
	
	#validate condition id
	if param.condition_id and param.condition_id != oldData.condition_id:
		cond = conditions.GetById(param.condition_id, db)
		if cond.status_code != HTTP_200_OK:
			return cond
		
	# handle attachment
	if attachment:
		file_path = await assets.SaveAttachment(attachment)
		param.attachment = file_path

		
	update_data = param.model_dump(exclude_unset=True)
	newData = dbOps.update(db, db_obj=oldData, obj_in=update_data)
	
	return success_response(
        data=endrict_response(db, newData),
        message=f"{moduleName} created successfully",
        status_code=HTTP_201_CREATED
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

def endrict_response(db: Session, obj):
    data = ResponseSchema.model_validate(obj).model_dump(
        exclude_none=True,
        mode="json"
    )

    data["asset"] = utils.extract_results(assets.GetById(obj.asset_id, db))
    data["employee"] = utils.extract_results(employees.GetById(obj.employee_id, db))
    data["condition"] = utils.extract_results(conditions.GetById(obj.condition_id, db))
    return data