import pytest
from app.services.quantum_blockchain import QuantumBlockchain

def test_quantum_blockchain_initialization():
    """Test quantum blockchain initialization."""
    quantum_blockchain = QuantumBlockchain()
    assert quantum_blockchain.connected == True

def test_perform_transaction():
    """Test performing a quantum transaction."""
    quantum_blockchain = QuantumBlockchain()
    tx_hash = quantum_blockchain.perform_transaction(1, 2, 100.0)
    assert tx_hash.startswith("quantum-tx-")
    assert len(tx_hash) > 10

def test_verify_transaction():
    """Test verifying a quantum transaction."""
    quantum_blockchain = QuantumBlockchain()
    result = quantum_blockchain.verify_transaction("quantum-tx-123456")
    assert result["verified"] == True
    assert "sender_id" in result
    assert "receiver_id" in result
    assert "amount" in result
    assert "timestamp" in result
