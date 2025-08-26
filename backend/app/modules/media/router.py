"""Media streaming authentication and management."""
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Dict, Any
import jwt
import time
from ...core.config import settings
from ...modules.auth.deps import get_current_user
from ...modules.identity.models import User

router = APIRouter(prefix="/media", tags=["media"])

def generate_media_token(user_id: int, path: str, action: str, duration: int = 3600) -> str:
    """Generate JWT token for media access."""
    payload = {
        "user_id": user_id,
        "path": path,
        "action": action,  # 'publish' or 'read'
        "exp": int(time.time()) + duration,
        "iat": int(time.time()),
        "iss": "agi-portal-media"
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def verify_media_token(token: str, path: str, action: str) -> bool:
    """Verify JWT token for media access."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        
        if payload.get("path") != path or payload.get("action") != action:
            return False
            
        if payload.get("exp", 0) < time.time():
            return False
            
        return True
    except jwt.InvalidTokenError:
        return False

@router.post("/auth")
async def media_auth(request: Request):
    """MediaMTX authentication endpoint."""
    form_data = await request.form()
    
    user = form_data.get("user", "")
    password = form_data.get("password", "")
    path = form_data.get("path", "")
    protocol = form_data.get("protocol", "")
    action = form_data.get("action", "")  # 'publish' or 'read'
    
    if not password:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if not verify_media_token(password, path, action):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return JSONResponse(content={"status": "ok"})

@router.post("/auth/publish")
async def media_auth_publish(request: Request):
    """MediaMTX publish authentication endpoint."""
    form_data = await request.form()
    
    user = form_data.get("user", "")
    password = form_data.get("password", "")
    path = form_data.get("path", "")
    
    if not verify_media_token(password, path, "publish"):
        raise HTTPException(status_code=401, detail="Publish not authorized")
    
    return JSONResponse(content={"status": "ok"})

@router.post("/auth/read")
async def media_auth_read(request: Request):
    """MediaMTX read authentication endpoint."""
    form_data = await request.form()
    
    user = form_data.get("user", "")
    password = form_data.get("password", "")
    path = form_data.get("path", "")
    
    if not verify_media_token(password, path, "read"):
        raise HTTPException(status_code=401, detail="Read not authorized")
    
    return JSONResponse(content={"status": "ok"})

@router.post("/token")
async def generate_media_access_token(
    path: str,
    action: str,
    duration: int = 3600,
    current_user: User = Depends(get_current_user)
):
    """Generate media access token for authenticated user."""
    if action not in ["publish", "read"]:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    if not has_media_permission(current_user, path, action):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    token = generate_media_token(current_user.id, path, action, duration)
    
    return {
        "token": token,
        "expires_in": duration,
        "path": path,
        "action": action
    }

@router.get("/signed-url/{path:path}")
async def get_signed_media_url(
    path: str,
    action: str = "read",
    duration: int = 3600,
    current_user: User = Depends(get_current_user)
):
    """Generate signed URL for media access."""
    if not has_media_permission(current_user, path, action):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    token = generate_media_token(current_user.id, path, action, duration)
    
    if action == "read":
        base_url = f"{settings.MEDIA_BASE_URL}/hls/{path}/index.m3u8"
    else:
        base_url = f"{settings.MEDIA_BASE_URL}/rtmp/{path}"
    
    signed_url = f"{base_url}?token={token}"
    
    return {
        "url": signed_url,
        "expires_in": duration,
        "action": action
    }

@router.post("/hooks/publish")
async def media_publish_hook(request: Request):
    """MediaMTX publish hook."""
    data = await request.json()
    path = data.get("path", "")
    
    print(f"Media publish started: {path}")
    
    
    return {"status": "ok"}

@router.post("/hooks/unpublish")
async def media_unpublish_hook(request: Request):
    """MediaMTX unpublish hook."""
    data = await request.json()
    path = data.get("path", "")
    
    print(f"Media publish stopped: {path}")
    
    return {"status": "ok"}

@router.post("/hooks/read")
async def media_read_hook(request: Request):
    """MediaMTX read hook."""
    data = await request.json()
    path = data.get("path", "")
    
    print(f"Media read started: {path}")
    
    return {"status": "ok"}

@router.post("/hooks/unread")
async def media_unread_hook(request: Request):
    """MediaMTX unread hook."""
    data = await request.json()
    path = data.get("path", "")
    
    print(f"Media read stopped: {path}")
    
    return {"status": "ok"}

def has_media_permission(user: User, path: str, action: str) -> bool:
    """Check if user has permission for media path and action."""
    
    if path.startswith("agi-demo"):
        return True  # Public demo streams
    elif path.startswith("evidence-vault"):
        return user.role in ["admin", "investigator"]  # Restricted access
    elif path.startswith("demo-arena"):
        return user.role in ["admin", "presenter"]  # Presenter access
    
    return False
