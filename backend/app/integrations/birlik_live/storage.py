"""
Birlik Live Storage Integration

This module provides integration with Web3.Storage for decentralized document storage.
"""
import logging
import os
import json
import httpx
import base64
from typing import Dict, Any, Optional, List, BinaryIO, Union
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger(__name__)

class BirlikLiveStorage:
    """Integration with Web3.Storage for decentralized document storage."""
    
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        """
        Initialize the Web3.Storage integration.
        
        Args:
            api_key: API key for Web3.Storage.
                    Defaults to the value in settings.
            base_url: Base URL for the Web3.Storage API.
                     Defaults to the value in settings.
        """
        self.api_key = api_key or settings.WEB3_STORAGE_API_KEY
        self.base_url = base_url or "https://api.web3.storage"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }
    
    async def upload_file(self, file_path: Union[str, Path], name: Optional[str] = None) -> Dict[str, Any]:
        """
        Upload a file to Web3.Storage.
        
        Args:
            file_path: Path to the file.
            name: Name of the file in storage.
                 Defaults to the file name.
                 
        Returns:
            Upload result with CID.
            
        Raises:
            FileNotFoundError: If the file does not exist.
            httpx.HTTPStatusError: If the upload fails.
        """
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        name = name or file_path.name
        
        try:
            async with httpx.AsyncClient() as client:
                with open(file_path, "rb") as f:
                    files = {"file": (name, f)}
                    response = await client.post(
                        f"{self.base_url}/upload",
                        headers=self.headers,
                        files=files
                    )
                    response.raise_for_status()
                    return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            raise
    
    async def upload_directory(self, dir_path: Union[str, Path]) -> Dict[str, Any]:
        """
        Upload a directory to Web3.Storage.
        
        Args:
            dir_path: Path to the directory.
            
        Returns:
            Upload result with CID.
            
        Raises:
            FileNotFoundError: If the directory does not exist.
            httpx.HTTPStatusError: If the upload fails.
        """
        dir_path = Path(dir_path)
        if not dir_path.exists() or not dir_path.is_dir():
            raise FileNotFoundError(f"Directory not found: {dir_path}")
        
        try:
            files = []
            for file_path in dir_path.glob("**/*"):
                if file_path.is_file():
                    relative_path = file_path.relative_to(dir_path)
                    files.append(("file", (str(relative_path), open(file_path, "rb"))))
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/upload",
                    headers=self.headers,
                    files=files
                )
                response.raise_for_status()
                
                for _, (_, file_handle) in files:
                    file_handle.close()
                
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            raise
    
    async def upload_json(self, data: Dict[str, Any], name: str) -> Dict[str, Any]:
        """
        Upload JSON data to Web3.Storage.
        
        Args:
            data: JSON data.
            name: Name of the file in storage.
            
        Returns:
            Upload result with CID.
            
        Raises:
            httpx.HTTPStatusError: If the upload fails.
        """
        try:
            json_data = json.dumps(data).encode("utf-8")
            
            async with httpx.AsyncClient() as client:
                files = {"file": (name, json_data, "application/json")}
                response = await client.post(
                    f"{self.base_url}/upload",
                    headers=self.headers,
                    files=files
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            raise
    
    async def get_status(self, cid: str) -> Dict[str, Any]:
        """
        Get the status of a file in Web3.Storage.
        
        Args:
            cid: Content identifier.
            
        Returns:
            Status information.
            
        Raises:
            httpx.HTTPStatusError: If the request fails.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/status/{cid}",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            raise
    
    async def list_uploads(self, limit: int = 100) -> List[Dict[str, Any]]:
        """
        List uploads in Web3.Storage.
        
        Args:
            limit: Maximum number of uploads to return.
            
        Returns:
            List of uploads.
            
        Raises:
            httpx.HTTPStatusError: If the request fails.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/user/uploads?limit={limit}",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            raise
    
    def get_ipfs_url(self, cid: str, path: Optional[str] = None) -> str:
        """
        Get the IPFS URL for a file.
        
        Args:
            cid: Content identifier.
            path: Path to the file within the CID.
            
        Returns:
            IPFS URL.
        """
        if path:
            return f"ipfs://{cid}/{path}"
        return f"ipfs://{cid}"
    
    def get_gateway_url(self, cid: str, path: Optional[str] = None, gateway: Optional[str] = None) -> str:
        """
        Get the HTTP gateway URL for a file.
        
        Args:
            cid: Content identifier.
            path: Path to the file within the CID.
            gateway: IPFS gateway URL.
                    Defaults to the value in settings or ipfs.io.
            
        Returns:
            HTTP gateway URL.
        """
        gateway = gateway or settings.IPFS_GATEWAY or "https://ipfs.io/ipfs"
        gateway = gateway.rstrip("/")
        
        if path:
            return f"{gateway}/{cid}/{path}"
        return f"{gateway}/{cid}"
