"""Abstraction layer for blockchain operations."""
import logging
from enum import Enum
from typing import Dict, Any, Union
from app.services.blockchain import send_transaction as eth_send_transaction
from app.services.blockchain import verify_transaction as eth_verify_transaction
from app.services.blockchain import generate_nft_token as eth_generate_nft_token
from app.services.xrp_ledger import xrpl_client
from app.services.quantum_blockchain import QuantumBlockchain
from app.core.config import settings

logger = logging.getLogger(__name__)

class BlockchainType(Enum):
    ETHEREUM = "ethereum"
    XRP_LEDGER = "xrp_ledger"
    QUANTUM = "quantum"

class BlockchainService:
    """Service for blockchain operations with support for multiple blockchain types."""
    
    def __init__(self, blockchain_type: Union[BlockchainType, str] = None):
        """Initialize the blockchain service."""
        if isinstance(blockchain_type, str):
            blockchain_type = BlockchainType(blockchain_type)
        self.blockchain_type = blockchain_type or BlockchainType(settings.DEFAULT_BLOCKCHAIN)
        logger.info(f"Initializing blockchain service with type: {self.blockchain_type}")
        
        if self.blockchain_type == BlockchainType.QUANTUM:
            self.quantum_blockchain = QuantumBlockchain()
    
    async def send_transaction(self, from_address: str, to_address: str, 
                            amount: float, private_key: str) -> Dict[str, Any]:
        """Send a transaction on the selected blockchain."""
        if self.blockchain_type == BlockchainType.ETHEREUM:
            return await eth_send_transaction(from_address, to_address, amount, private_key)
        elif self.blockchain_type == BlockchainType.XRP_LEDGER:
            return await xrpl_client.send_transaction(from_address, to_address, amount, private_key)
        elif self.blockchain_type == BlockchainType.QUANTUM:
            tx_hash = self.quantum_blockchain.perform_transaction(from_address, to_address, amount)
            return {"success": True, "tx_hash": tx_hash}
    
    async def verify_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """Verify a transaction on the selected blockchain."""
        if self.blockchain_type == BlockchainType.ETHEREUM:
            return await eth_verify_transaction(tx_hash)
        elif self.blockchain_type == BlockchainType.XRP_LEDGER:
            return await xrpl_client.verify_transaction(tx_hash)
        elif self.blockchain_type == BlockchainType.QUANTUM:
            result = self.quantum_blockchain.verify_transaction(tx_hash)
            return {"success": True, "status": 1, "details": result}
    
    async def generate_nft_token(self, owner_address: str, 
                              metadata: Dict[str, Any],
                              private_key: str = None) -> Dict[str, Any]:
        """Generate an NFT token on the selected blockchain."""
        if self.blockchain_type == BlockchainType.ETHEREUM:
            return await eth_generate_nft_token(owner_address, metadata)
        elif self.blockchain_type == BlockchainType.XRP_LEDGER:
            if not private_key:
                raise ValueError("Private key is required for XRP Ledger NFT creation")
            return await xrpl_client.generate_nft_token(owner_address, metadata, private_key)
    
    async def cross_currency_payment(self, from_address: str, to_address: str,
                                  source_amount: float, source_currency: str,
                                  destination_amount: float, destination_currency: str,
                                  private_key: str) -> Dict[str, Any]:
        """Send a cross-currency payment."""
        if self.blockchain_type == BlockchainType.XRP_LEDGER:
            return await xrpl_client.cross_currency_payment(
                from_address, to_address, 
                source_amount, source_currency,
                destination_amount, destination_currency,
                private_key
            )
        else:
            raise NotImplementedError(
                f"Cross-currency payment not supported for {self.blockchain_type}"
            )

blockchain_service = BlockchainService()
