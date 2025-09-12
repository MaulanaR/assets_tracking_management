from fastapi import APIRouter
from app.api.v1.endpoints import roles, users, migration
from app.api.v1.endpoints.departments import handler as department_handler

api_router = APIRouter()

# Include router dari semua endpoint
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Router migration
api_router.include_router(migration.router, prefix="", tags=["Migration"])

# Department
api_router.include_router(department_handler.router, prefix="/departments", tags=["Departments"])

# Tambahkan router lainnya di sini ketika menambah fitur baru
