from fastapi import APIRouter
from fastapi.responses import JSONResponse
import alembic.config
import os

router = APIRouter()

@router.post("/migration", tags=["Migration"])
def run_migration():
    try:
        alembic_cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../alembic.ini')
        alembic.config.main(argv=["upgrade", "head", "-c", alembic_cfg_path])
        return JSONResponse(content={"message": "Migration successful"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
