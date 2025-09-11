from fastapi import APIRouter
from app.api.v1.endpoints import roles, users

api_router = APIRouter()

# Include router dari semua endpoint
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Tambahkan router lainnya di sini ketika menambah fitur baru
