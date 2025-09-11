from typing import Any, Optional, Dict
from fastapi.responses import JSONResponse

# HTTP Status Codes Reference
HTTP_200_OK = 200
HTTP_201_CREATED = 201
HTTP_400_BAD_REQUEST = 400
HTTP_401_UNAUTHORIZED = 401
HTTP_403_FORBIDDEN = 403
HTTP_404_NOT_FOUND = 404
HTTP_500_INTERNAL_SERVER_ERROR = 500

def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = HTTP_200_OK
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "data": data,
            "errors": None
        }
    )

def error_response(
    message: str = "An error occurred",
    errors: Optional[Dict[str, Any]] = None,
    status_code: int = HTTP_400_BAD_REQUEST
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "data": None,
            "errors": errors
        }
    )
