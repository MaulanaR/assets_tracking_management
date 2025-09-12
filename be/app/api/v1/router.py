from fastapi import APIRouter
from app.api.v1.endpoints import roles, users, migration
from app.api.v1.endpoints.departments import handler as department_handler
from app.api.v1.endpoints.conditions import handler as condition_handler
from app.api.v1.endpoints.categories import handler as category_handler
from app.api.v1.endpoints.branches import handler as branch_handler

api_router = APIRouter()

# Include router dari semua endpoint
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Router migration
api_router.include_router(migration.router, prefix="", tags=["Migration"])

# Department
api_router.include_router(department_handler.router, prefix="/departments", tags=["Departments"])

# Condition
api_router.include_router(condition_handler.router, prefix="/conditions", tags=["Conditions"])

# Categories
api_router.include_router(category_handler.router, prefix="/categories", tags=["Categories"])

# Branch
api_router.include_router(branch_handler.router, prefix="/branches", tags=["Branches"])

# Tambahkan router lainnya di sini ketika menambah fitur baru
