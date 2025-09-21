from fastapi import APIRouter
from app.api.v1.endpoints import migration
from app.api.v1.endpoints.roles import handler as roles_handler
from app.api.v1.endpoints.departments import handler as department_handler
from app.api.v1.endpoints.conditions import handler as condition_handler
from app.api.v1.endpoints.categories import handler as category_handler
from app.api.v1.endpoints.branches import handler as branch_handler
from app.api.v1.endpoints.employees import handler as employee_handler
from app.api.v1.endpoints.assets import handler as asset_handler
from app.api.v1.endpoints.employee_assets import handler as employee_asset_handler

api_router = APIRouter()

# Router migration
api_router.include_router(migration.router, prefix="", tags=["Migration"])

# Role
api_router.include_router(roles_handler.router, prefix="/roles", tags=["Roles"])

# Department
api_router.include_router(department_handler.router, prefix="/departments", tags=["Departments"])

# Condition
api_router.include_router(condition_handler.router, prefix="/conditions", tags=["Conditions"])

# Categories
api_router.include_router(category_handler.router, prefix="/categories", tags=["Categories"])

# Branch
api_router.include_router(branch_handler.router, prefix="/branches", tags=["Branches"])

# Employee
api_router.include_router(employee_handler.router, prefix="/employees", tags=["Employees"])

# Assets
api_router.include_router(asset_handler.router, prefix="/assets", tags=["Assets"])

# Employees Assets
api_router.include_router(employee_asset_handler.router, prefix="/employee_assets", tags=["Employee Assets"])

# Tambahkan router lainnya di sini ketika menambah fitur baru
