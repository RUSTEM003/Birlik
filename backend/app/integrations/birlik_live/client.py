"""
Birlik Live API Client

This module provides a client for interacting with the Birlik Live platform API.
"""
import httpx
import logging
import json
from typing import Dict, Any, Optional, List, Union
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)

class BirlikLiveClient:
    """Client for interacting with the Birlik Live API."""
    
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        """
        Initialize the Birlik Live API client.
        
        Args:
            api_key: API key for authentication with Birlik Live.
                    Defaults to the value in settings.
            base_url: Base URL for the Birlik Live API.
                     Defaults to the value in settings.
        """
        self.api_key = api_key or settings.BIRLIK_LIVE_API_KEY
        self.base_url = base_url or settings.BIRLIK_LIVE_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    
    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make a request to the Birlik Live API.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE).
            endpoint: API endpoint.
            data: Request data.
            params: Query parameters.
            
        Returns:
            Response data.
            
        Raises:
            httpx.HTTPStatusError: If the request fails.
        """
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with httpx.AsyncClient() as client:
                if method == "GET":
                    response = await client.get(url, headers=self.headers, params=params)
                elif method == "POST":
                    response = await client.post(url, headers=self.headers, json=data, params=params)
                elif method == "PUT":
                    response = await client.put(url, headers=self.headers, json=data, params=params)
                elif method == "DELETE":
                    response = await client.delete(url, headers=self.headers, params=params)
                else:
                    raise ValueError(f"Unsupported HTTP method: {method}")
                
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            raise
    
    
    async def get_user(self, user_id: str) -> Dict[str, Any]:
        """
        Get user information from Birlik Live.
        
        Args:
            user_id: ID of the user.
            
        Returns:
            User information.
        """
        return await self._make_request("GET", f"users/{user_id}")
    
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new user in Birlik Live.
        
        Args:
            user_data: User data.
            
        Returns:
            Created user information.
        """
        return await self._make_request("POST", "users", data=user_data)
    
    async def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user information in Birlik Live.
        
        Args:
            user_id: ID of the user.
            user_data: Updated user data.
            
        Returns:
            Updated user information.
        """
        return await self._make_request("PUT", f"users/{user_id}", data=user_data)
    
    
    async def verify_identity(self, user_id: str, identity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify a user's identity with Birlik Live.
        
        Args:
            user_id: ID of the user.
            identity_data: Identity verification data.
            
        Returns:
            Verification result.
        """
        return await self._make_request("POST", f"identity/verify/{user_id}", data=identity_data)
    
    async def get_identity_status(self, user_id: str) -> Dict[str, Any]:
        """
        Get the status of a user's identity verification.
        
        Args:
            user_id: ID of the user.
            
        Returns:
            Identity verification status.
        """
        return await self._make_request("GET", f"identity/status/{user_id}")
    
    
    async def create_transaction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new transaction in Birlik Live.
        
        Args:
            transaction_data: Transaction data.
            
        Returns:
            Created transaction information.
        """
        return await self._make_request("POST", "transactions", data=transaction_data)
    
    async def get_transaction(self, transaction_id: str) -> Dict[str, Any]:
        """
        Get transaction information from Birlik Live.
        
        Args:
            transaction_id: ID of the transaction.
            
        Returns:
            Transaction information.
        """
        return await self._make_request("GET", f"transactions/{transaction_id}")
    
    async def get_user_transactions(
        self, 
        user_id: str, 
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Get a user's transactions from Birlik Live.
        
        Args:
            user_id: ID of the user.
            start_date: Start date for filtering transactions.
            end_date: End date for filtering transactions.
            limit: Maximum number of transactions to return.
            offset: Offset for pagination.
            
        Returns:
            List of transactions.
        """
        params = {
            "limit": limit,
            "offset": offset
        }
        
        if start_date:
            params["start_date"] = start_date.isoformat()
        
        if end_date:
            params["end_date"] = end_date.isoformat()
        
        return await self._make_request("GET", f"users/{user_id}/transactions", params=params)
    
    
    async def get_wallet_balance(self, user_id: str, currency: Optional[str] = None) -> Dict[str, Any]:
        """
        Get a user's wallet balance from Birlik Live.
        
        Args:
            user_id: ID of the user.
            currency: Currency code (optional).
            
        Returns:
            Wallet balance information.
        """
        params = {}
        if currency:
            params["currency"] = currency
        
        return await self._make_request("GET", f"wallets/{user_id}/balance", params=params)
    
    async def create_wallet(self, user_id: str, wallet_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new wallet for a user in Birlik Live.
        
        Args:
            user_id: ID of the user.
            wallet_data: Wallet data.
            
        Returns:
            Created wallet information.
        """
        return await self._make_request("POST", f"wallets/{user_id}", data=wallet_data)
    
    
    async def create_nft_passport(self, user_id: str, passport_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new NFT passport for a user in Birlik Live.
        
        Args:
            user_id: ID of the user.
            passport_data: Passport data.
            
        Returns:
            Created NFT passport information.
        """
        return await self._make_request("POST", f"nft-passports/{user_id}", data=passport_data)
    
    async def get_nft_passport(self, user_id: str) -> Dict[str, Any]:
        """
        Get a user's NFT passport from Birlik Live.
        
        Args:
            user_id: ID of the user.
            
        Returns:
            NFT passport information.
        """
        return await self._make_request("GET", f"nft-passports/{user_id}")
    
    async def verify_nft_passport(self, passport_id: str) -> Dict[str, Any]:
        """
        Verify an NFT passport with Birlik Live.
        
        Args:
            passport_id: ID of the NFT passport.
            
        Returns:
            Verification result.
        """
        return await self._make_request("POST", f"nft-passports/verify/{passport_id}")
