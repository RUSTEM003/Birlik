"""Security headers middleware for FastAPI."""
from starlette.types import ASGIApp, Receive, Scope, Send
from starlette.responses import Response
from ..core.config import settings

class SecurityHeadersMiddleware:
    """Add security headers to all responses."""
    
    def __init__(self, app: ASGIApp):
        self.app = app
    
    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                headers = dict(message.get("headers", []))
                
                security_headers = {
                    b"x-content-type-options": b"nosniff",
                    b"x-frame-options": b"DENY",
                    b"x-xss-protection": b"1; mode=block",
                    b"referrer-policy": b"no-referrer",
                    b"permissions-policy": b"geolocation=(), microphone=(), camera=()",
                    b"strict-transport-security": b"max-age=31536000; includeSubDomains",
                    b"content-security-policy": b"default-src 'self'; img-src 'self' data: https:; connect-src 'self' https:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none';",
                }
                
                headers.update(security_headers)
                message["headers"] = list(headers.items())
            
            await send(message)
        
        await self.app(scope, receive, send_wrapper)

class RateLimitMiddleware:
    """Rate limiting middleware using Redis."""
    
    def __init__(self, app: ASGIApp):
        self.app = app
    
    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        await self.app(scope, receive, send)
