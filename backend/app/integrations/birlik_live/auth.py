"""
Birlik Live Authentication Module

This module provides authentication utilities for the Birlik Live platform.
"""
import logging
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class BirlikLiveAuth:
    """Authentication utilities for Birlik Live."""
    
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None):
        """
        Initialize the Birlik Live authentication utilities.
        
        Args:
            api_key: API key for authentication with Birlik Live.
                    Defaults to the value in settings.
            api_secret: API secret for authentication with Birlik Live.
                       Defaults to the value in settings.
        """
        self.api_key = api_key or settings.BIRLIK_LIVE_API_KEY
        self.api_secret = api_secret or settings.BIRLIK_LIVE_API_SECRET
    
    def generate_auth_token(self, user_id: str, expires_delta: Optional[timedelta] = None) -> str:
        """
        Generate an authentication token for Birlik Live.
        
        Args:
            user_id: ID of the user.
            expires_delta: Token expiration time.
                          Defaults to 1 hour.
                          
        Returns:
            Authentication token.
        """
        expires_delta = expires_delta or timedelta(hours=1)
        expires = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "exp": expires,
            "iat": datetime.utcnow(),
            "iss": "birlik-digital-bank",
            "aud": "birlik-live"
        }
        
        token = jwt.encode(payload, self.api_secret, algorithm="HS256")
        return token
    
    def verify_auth_token(self, token: str) -> Dict[str, Any]:
        """
        Verify an authentication token from Birlik Live.
        
        Args:
            token: Authentication token.
            
        Returns:
            Token payload.
            
        Raises:
            jwt.InvalidTokenError: If the token is invalid.
        """
        try:
            payload = jwt.decode(
                token, 
                self.api_secret, 
                algorithms=["HS256"],
                audience="birlik-digital-bank",
                issuer="birlik-live"
            )
            return payload
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {e}")
            raise
    
    def generate_webhook_signature(self, payload: Dict[str, Any]) -> str:
        """
        Generate a signature for webhook payloads.
        
        Args:
            payload: Webhook payload.
            
        Returns:
            Signature.
        """
        payload_str = str(payload)
        signature = jwt.encode({"data": payload_str}, self.api_secret, algorithm="HS256")
        return signature
    
    def verify_webhook_signature(self, payload: Dict[str, Any], signature: str) -> bool:
        """
        Verify a webhook signature from Birlik Live.
        
        Args:
            payload: Webhook payload.
            signature: Webhook signature.
            
        Returns:
            True if the signature is valid, False otherwise.
        """
        try:
            payload_str = str(payload)
            decoded = jwt.decode(signature, self.api_secret, algorithms=["HS256"])
            return decoded.get("data") == payload_str
        except jwt.InvalidTokenError:
            return False
