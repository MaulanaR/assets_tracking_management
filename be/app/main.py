from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.database import Base, engine
from app.api.v1.router import api_router
from app.utils import responses_utils
from fastapi.middleware.cors import CORSMiddleware

import traceback
import logging
import time

app = FastAPI(title="Rixco API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # bisa pakai ["*"] untuk izinkan semua
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE dll
    allow_headers=["*"],            # Authorization, Content-Type dll
)

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Rixco DB with users table ready 🚀"}

# register API v1 routes
app.include_router(api_router, prefix="/api/v1")

# ✅ Middleware Logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    try:
        response = await call_next(request)
    except Exception as exc:
        # Log error
        process_time = (time.time() - start_time) * 1000
        logging.basicConfig(
            filename="logs/app.log",
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s"
        )
        logging.error(f"❌ ERROR: {request.method} {request.url} | {exc} | {process_time:.2f}ms")
        traceback.print_exc()

        return JSONResponse(
            status_code=responses_utils.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "message": "Internal Server Error",
                "data": None,
                "errors": {"detail": str(exc)}
            }
        )

    process_time = (time.time() - start_time) * 1000
    logging.basicConfig(
        filename="logs/app.log",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logging.info(f"✅ {request.method} {request.url} → {response.status_code} | {process_time:.2f}ms")

    return response


# ✅ Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.basicConfig(
        filename="logs/app.log",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logging.error(f"❌ Unhandled ERROR: {exc}")
    traceback.print_exc()

    return JSONResponse(
        status_code=responses_utils.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "Internal Server Error",
            "data": None,
            "errors": {"detail": str(exc)}
        }
    )


# ✅ Handler khusus untuk 404
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    logging.basicConfig(
        filename="logs/app.log",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logging.error(f"❌ Unhandled ERROR: {exc}")
    return JSONResponse(
        status_code=responses_utils.HTTP_404_NOT_FOUND,
        content={
            "message": "Route not found",
            "data": None,
            "errors": None
        }
    )