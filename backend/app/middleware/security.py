from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import structlog
import time
from typing import Callable
from app.core.config import settings

logger = structlog.get_logger()

limiter = Limiter(key_func=get_remote_address)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        for header, value in settings.SECURITY_HEADERS.items():
            response.headers[header] = value
            
        return response

class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        client_ip = get_remote_address(request)
        user_agent = request.headers.get("user-agent", "")
        
        logger.info(
            "request_started",
            method=request.method,
            url=str(request.url),
            client_ip=client_ip,
            user_agent=user_agent,
            timestamp=start_time
        )
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        
        logger.info(
            "request_completed",
            method=request.method,
            url=str(request.url),
            status_code=response.status_code,
            process_time=process_time,
            client_ip=client_ip,
            timestamp=time.time()
        )
        
        return response

class GeoFencingMiddleware(BaseHTTPMiddleware):
    ALLOWED_COUNTRIES = ["KZ", "RU", "UZ", "KG", "TJ", "TM", "AM", "AZ", "GE", "BY"]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if not settings.ENABLE_GEO_FENCING:
            return await call_next(request)
            
        client_ip = get_remote_address(request)
        
        logger.info(
            "geo_check",
            client_ip=client_ip,
            allowed_countries=self.ALLOWED_COUNTRIES
        )
        
        return await call_next(request)

class ThreatDetectionMiddleware(BaseHTTPMiddleware):
    SUSPICIOUS_PATTERNS = [
        "union select", "drop table", "insert into", "delete from",
        "<script>", "javascript:", "eval(", "alert(",
        "../", "..\\", "/etc/passwd", "cmd.exe"
    ]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if not settings.ENABLE_THREAT_DETECTION:
            return await call_next(request)
            
        request_body = ""
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.body()
                request_body = body.decode("utf-8").lower()
            except:
                pass
        
        query_params = str(request.url.query).lower()
        path = str(request.url.path).lower()
        
        for pattern in self.SUSPICIOUS_PATTERNS:
            if pattern in request_body or pattern in query_params or pattern in path:
                logger.warning(
                    "threat_detected",
                    pattern=pattern,
                    client_ip=get_remote_address(request),
                    url=str(request.url),
                    method=request.method
                )
                break
        
        return await call_next(request)
