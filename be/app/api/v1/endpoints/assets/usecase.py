from sqlalchemy.orm import Session
from app.crud import base
from .model import *
from .struct import *
from fastapi import Request, UploadFile
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
from app.api.v1.endpoints.categories.model import CategoryModel
import app.api.v1.endpoints.categories.usecase as categories

import os
import uuid               # <<< for unique filenames
import tempfile           # <<< writable on serverless (/tmp)
import pathlib            # <<< mkdir safely
from typing import Optional

# Ini var operasi ke DB, semua operasi DB panggil ini
dbOps = base.CRUDBase(AssetModel)
moduleName = "Asset"

# ---------- WRITE DIR (Serverless-safe) ----------
# Gunakan ENV WRITE_DIR kalau ada (contoh: mount volume /data di Docker/K8s),
# default ke /tmp (writeable di AWS Lambda/Vercel, tapi tidak persisten).
WRITE_BASE_DIR = os.environ.get("WRITE_DIR") or tempfile.gettempdir()  # <<<
ASSETS_DIR = os.path.join(WRITE_BASE_DIR, "item_assets")               # <<<

def ensure_dirs() -> None:                                             # <<<
    pathlib.Path(ASSETS_DIR).mkdir(parents=True, exist_ok=True)

def _safe_ext(name: str) -> str:                                       # <<<
    # batasi ekstensi maksimal 10 char untuk safety
    _, ext = os.path.splitext(name or "")
    return ext[:10] if ext else ""

async def save_attachment(attachment: Optional[UploadFile]) -> Optional[str]:
    if not attachment:
        return None

    ensure_dirs()                                                      # <<<

    # Hindari path traversal & duplikasi nama. Simpan UUID + ext asli.
    original = os.path.basename(attachment.filename or "upload.bin")   # <<<
    ext = _safe_ext(original)
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(ASSETS_DIR, filename)

    # NB: UploadFile.read() itu async; menulis sinkron OK untuk file kecil–menengah.
    # Bila mau pure-async, bisa pakai aiofiles.
    data = await attachment.read()
    with open(dest, "wb") as f:
        f.write(data)

    return dest

async def Create(param: ParamCreate, db: Session, attachment: UploadFile = None):
    # validate code
    existing_data = dbOps.get_by_field(db, "code", param.code)
    if existing_data:
        return error_response(
            message=f"{moduleName} already exists",
            errors={"code": f"Duplicate {moduleName} code"},  # <<< field name
            status_code=HTTP_400_BAD_REQUEST
        )

    # validate category
    if param.category_id:
        category = categories.GetById(param.category_id, db)
        if category.status_code != HTTP_200_OK:
            return category

    # handle attachment
    if attachment:
        file_path = await save_attachment(attachment)
        param.attachment = file_path

    newData = dbOps.create(db, obj_in=param)
    return success_response(
        data=endrict_response(db, newData),
        message=f"{moduleName} created successfully",
        status_code=HTTP_201_CREATED
    )

def GetAll(db: Session, page: int = 1, limit: int = 10, request: Request = None):
    skip = (page - 1) * limit
    datas = dbOps.get_multi(db, skip=skip, limit=limit, request=request)
    total_count = dbOps.count(db)
    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 0

    respData = [endrict_response(db, r) for r in datas]

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
        message=f"{moduleName} retrieved successfully",
        status_code=HTTP_200_OK
    )

async def UpdateById(id: int, param: ParamPUT, db: Session, attachment: UploadFile = None):
    oldData = dbOps.get(db, id=id)
    if not oldData:
        return error_response(
            message=f"{moduleName} not found",
            errors={"id": f"{moduleName} not found"},
            status_code=HTTP_404_NOT_FOUND
        )

    # validate code (abaikan record yang sama)                          # <<<
    if param.code and param.code != getattr(oldData, "code", None):     # <<<
        notUnique = dbOps.get_by_field(db, "code", param.code)
        if notUnique and getattr(notUnique, "id", None) != id:          # <<<
            return error_response(
                message=f"{moduleName} already exists",
                errors={"code": f"Duplicate {moduleName} code"},
                status_code=HTTP_400_BAD_REQUEST
            )

    # validate category
    if param.category_id:
        category = categories.GetById(param.category_id, db)
        if category.status_code != HTTP_200_OK:
            return category

    # handle attachment
    if attachment:
        file_path = await save_attachment(attachment)
        param.attachment = file_path

    newData = dbOps.update(db, db_obj=oldData, obj_in=param)
    return success_response(
        data=endrict_response(db, newData),
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

    # validate code (abaikan record yang sama)                          # <<<
    if param.code and param.code != getattr(oldData, "code", None):     # <<<
        notUnique = dbOps.get_by_field(db, "code", param.code)
        if notUnique and getattr(notUnique, "id", None) != id:          # <<<
            return error_response(
                message=f"{moduleName} already exists",
                errors={"code": f"Duplicate {moduleName} code"},
                status_code=HTTP_400_BAD_REQUEST
            )

    # validate category
    if param.category_id and param.category_id != getattr(oldData, "category_id", None):
        category = categories.GetById(param.category_id, db)
        if category.status_code != HTTP_200_OK:
            return category

    update_data = param.model_dump(exclude_unset=True)
    newData = dbOps.update(db, db_obj=oldData, obj_in=update_data)
    return success_response(
        data=endrict_response(db, newData),
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
    data = endrict_response(db, oldData)
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

    # Perbaiki: panggil helper yang benar untuk masing-masing field     # <<<
    department_dict = get_department_detail(db, getattr(obj, "department_id", None))
    branch_dict     = get_branch_detail(db, getattr(obj, "branch_id", None))
    category_dict   = get_category_detail(db, getattr(obj, "category_id", None))   # <<<
    condition_dict  = get_condition_detail(db, getattr(obj, "condition_id", None)) # <<<

    data["department"] = department_dict
    data["branch"] = branch_dict
    data["category"] = category_dict
    data["condition"] = condition_dict

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
        "name": getattr(branch, "name", None),
        "address": getattr(branch, "address", None),
    }

def get_category_detail(db: Session, category_id: int):
    if not category_id:
        return None
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category:
        return None
    return {
        "id": category.id,
        "code": getattr(category, "code", None),
        "name": getattr(category, "name", None)
    }

def get_condition_detail(db: Session, condition_id: int):
    if not condition_id:
        return None
    condition = db.query(ConditionModel).filter(ConditionModel.id == condition_id).first()
    if not condition:
        return None
    return {
        "id": condition.id,
        "code": getattr(condition, "code", None),
        "name": getattr(condition, "name", None)
    }
