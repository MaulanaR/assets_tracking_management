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
from app.api.v1.endpoints.departments.model import DepartmentModel
from app.api.v1.endpoints.branches.model import BranchModel

# Ini var operasi ke DB, semua operasi DB panggil ini
dbOps = base.CRUDBase(EmployeeModel)
moduleName = "Employee"

def Create(param: ParamCreate, db: Session):
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
		data=enrich_employee_response(db, newData),
		message=f"{moduleName} created successfully",
		status_code=HTTP_201_CREATED
	)

def GetAll(db: Session, page: int = 1, limit: int = 10, request: Request = None):
    skip = (page - 1) * limit
    datas = dbOps.get_multi(db, skip=skip, limit=limit, request=request)
    total_count = dbOps.count(db)
    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 0

    respData = [
        enrich_employee_response(db, r)
        for r in datas
    ]

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
		data=enrich_employee_response(db, oldData),
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
		data=enrich_employee_response(db, newData),
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
		data=enrich_employee_response(db, newData),
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
	data = enrich_employee_response(db, oldData)
	dbOps.remove(db, id=id)
	return success_response(
		data=data,
		message=f"{moduleName} deleted successfully",
		status_code=HTTP_200_OK
	)

def enrich_employee_response(db: Session, employee_obj):
	data = ResponseSchema.model_validate(employee_obj).model_dump(
		exclude_none=True,
		mode="json"
	)

	# Pastikan department dan branch adalah dict
	department_dict = get_department_detail(db, getattr(employee_obj, "department_id", None))
	branch_dict = get_branch_detail(db, getattr(employee_obj, "branch_id", None))
	data["department"] = department_dict
	data["branch"] = branch_dict

	return data

def get_department_detail(db: Session, department_id: int):
    if not department_id:
        return None
    dept = db.query(DepartmentModel).filter(DepartmentModel.id == department_id).first()
    if not dept:
        return None
    return {
        "id": dept.id,
        "code": getattr(dept, "code", None),
        "name": getattr(dept, "name", None)
    }

def get_branch_detail(db: Session, branch_id: int):
    if not branch_id:
        return None
    branch = db.query(BranchModel).filter(BranchModel.id == branch_id).first()
    if not branch:
        return None
    return {
        "id": branch.id,
        "code": getattr(branch, "code", None),
        "name": getattr(branch, "name", None)
    }

