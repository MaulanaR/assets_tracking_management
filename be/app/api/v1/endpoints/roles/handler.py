from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from .struct import *
from .usecase import *

router = APIRouter()

# CREATE
@router.post("/", response_model=ResponseSchema)
def CreateHandler(param: ParamCreate, db: Session = Depends(get_db)):
    return Create(param, db)

# READ ALL
@router.get("/")
def GetHandler(db: Session = Depends(get_db), page: int = 1, limit: int = 10):
    return GetAll(db, page=page, limit=limit)

# READ ONE
@router.get("/{id}", response_model=ResponseSchema)
def GetByIdHandler(id: int, db: Session = Depends(get_db)):
    return GetById(id, db)

# UPDATE
@router.put("/{id}", response_model=ResponseSchema)
def UpdateHandler(id: int, param: ParamPUT, db: Session = Depends(get_db)):
    return UpdateById(id, param, db)

# PATCH (Partial Update)
@router.patch("/{id}", response_model=ResponseSchema)
def PatchHandler(id: int, param: ParamPatch, db: Session = Depends(get_db)):
    return PatchById(id, param, db)

# DELETE
@router.delete("/{id}")
def DeleteHandler(id: int, db: Session = Depends(get_db)):
    return DeleteById(id, db)
