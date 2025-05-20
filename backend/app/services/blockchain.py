from web3 import Web3
from app.core.config import settings
import json
import logging
import random
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

try:
    w3 = Web3(Web3.HTTPProvider(settings.WEB3_PROVIDER_URI))
except Exception as e:
    logger.warning(f"Failed to initialize Web3: {str(e)}. Using mock mode.")
    w3 = None

async def send_transaction(from_address, to_address, amount, private_key):
    """Send a blockchain transaction"""
    if not w3 or not w3.is_connected():
        logger.warning("Web3 not connected. Using mock transaction.")
        tx_hash = f"mock-tx-{random.randint(10000, 99999)}"
        return {"success": True, "tx_hash": tx_hash, "mock": True}
    
    try:
        nonce = w3.eth.get_transaction_count(from_address)
        tx = {
            'nonce': nonce,
            'to': to_address,
            'value': w3.to_wei(amount, 'ether'),
            'gas': 21000,
            'gasPrice': w3.to_wei('50', 'gwei')
        }
        
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return {"success": True, "tx_hash": w3.to_hex(tx_hash)}
    except Exception as e:
        logger.error(f"Transaction error: {str(e)}")
        return {"success": False, "error": str(e)}

async def verify_transaction(tx_hash):
    """Verify a blockchain transaction"""
    if not w3 or not w3.is_connected():
        logger.warning("Web3 not connected. Using mock verification.")
        return {"success": True, "status": 1, "mock": True}
    
    try:
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return {"success": True, "status": tx_receipt["status"], "receipt": tx_receipt}
    except Exception as e:
        logger.error(f"Verification error: {str(e)}")
        return {"success": False, "error": str(e)}

async def generate_nft_token(owner_address: str, metadata: Dict[str, Any]) -> str:
    """
    Generate an NFT token ID for a passport.
    In a real implementation, this would interact with a blockchain.
    For now, we'll just generate a mock token ID.
    """
    logger.info(f"Generating NFT token for {owner_address}")
    token_id = f"nft-{random.randint(1000, 9999)}-{owner_address[:8] if owner_address else 'default'}"
    
    logger.info(f"Generated token ID: {token_id}")
    return token_id

async def verify_nft_token(token_id: str) -> bool:
    """
    Verify that an NFT token exists and is valid.
    In a real implementation, this would query the blockchain.
    """
    logger.info(f"Verifying NFT token: {token_id}")
    return True

async def transfer_funds(
    sender_address: str, 
    recipient_address: str, 
    amount: float, 
    currency: str
) -> Dict[str, Any]:
    """
    Transfer funds between blockchain wallets.
    In a real implementation, this would interact with a blockchain.
    """
    logger.info(f"Transferring {amount} {currency} from {sender_address} to {recipient_address}")
    
    tx_hash = f"tx-{random.randint(10000, 99999)}"
    
    return {
        "transaction_hash": tx_hash,
        "sender": sender_address,
        "recipient": recipient_address,
        "amount": amount,
        "currency": currency,
        "status": "completed"
    }
