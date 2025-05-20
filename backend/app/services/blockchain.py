from web3 import Web3
from app.core.config import settings
import json

w3 = Web3(Web3.HTTPProvider(settings.WEB3_PROVIDER_URI))

async def send_transaction(from_address, to_address, amount, private_key):
    """Send a blockchain transaction"""
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
        return {"success": False, "error": str(e)}

async def verify_transaction(tx_hash):
    """Verify a blockchain transaction"""
    try:
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return {"success": True, "status": tx_receipt["status"], "receipt": tx_receipt}
    except Exception as e:
        return {"success": False, "error": str(e)}
