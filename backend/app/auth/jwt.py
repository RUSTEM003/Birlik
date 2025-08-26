"""JWT/OIDC authentication with JWKS caching."""
from __future__ import annotations
import time
import httpx
import jwt
from typing import Any, Dict
from cachetools import TTLCache
from ..core.config import settings

_jwks_cache = TTLCache(maxsize=4, ttl=3600)

async def _fetch_jwks() -> Dict[str, Any]:
    """Fetch JWKS from OIDC provider with caching."""
    if not settings.OIDC_ISSUER:
        raise ValueError("OIDC_ISSUER not configured")
    
    url = settings.OIDC_JWKS_URL or (settings.OIDC_ISSUER.rstrip('/') + '/.well-known/jwks.json')
    
    if url in _jwks_cache:
        return _jwks_cache[url]
    
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()
        _jwks_cache[url] = data
        return data

async def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify JWT token using OIDC JWKS."""
    try:
        jwks = await _fetch_jwks()
        
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        
        if not kid:
            raise ValueError("Token missing key ID")
        
        key = next((k for k in jwks["keys"] if k.get("kid") == kid), None)
        if not key:
            raise ValueError("Key ID not found in JWKS")
        
        from jwt.algorithms import RSAAlgorithm
        public_key = RSAAlgorithm.from_jwk(key)
        
        options = {"verify_aud": settings.OIDC_AUDIENCE is not None}
        payload = jwt.decode(
            token,
            key=public_key,
            algorithms=["RS256"],
            audience=settings.OIDC_AUDIENCE,
            issuer=settings.OIDC_ISSUER,
            options=options
        )
        
        return payload
        
    except jwt.InvalidTokenError as e:
        raise ValueError(f"Invalid token: {e}")
    except Exception as e:
        raise ValueError(f"Token verification failed: {e}")

def extract_user_info(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Extract user information from JWT payload."""
    return {
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
        "username": payload.get("preferred_username") or payload.get("cognito:username"),
        "roles": payload.get("cognito:groups", []),
        "permissions": payload.get("permissions", []),
        "exp": payload.get("exp"),
        "iat": payload.get("iat")
    }
