"""AI Gateway guardrails engine for content filtering and safety."""
import re
import asyncio
from typing import List, Dict, Any, Tuple
from ...core.config import settings

class GuardrailsEngine:
    """Content filtering and safety guardrails."""
    
    def __init__(self):
        self.pii_patterns = [
            (r'\b\d{3}-\d{2}-\d{4}\b', 'SSN'),  # Social Security Number
            (r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b', 'CREDIT_CARD'),  # Credit Card
            (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 'EMAIL'),  # Email
            (r'\b\d{3}[- ]?\d{3}[- ]?\d{4}\b', 'PHONE'),  # Phone Number
        ]
        
        self.jailbreak_patterns = [
            r'ignore.{0,20}previous.{0,20}instructions',
            r'forget.{0,20}everything.{0,20}above',
            r'you.{0,20}are.{0,20}now.{0,20}(.*?)assistant',
            r'pretend.{0,20}to.{0,20}be',
            r'act.{0,20}as.{0,20}if',
            r'roleplay.{0,20}as',
            r'simulate.{0,20}being',
        ]
        
        self.toxic_patterns = [
            r'\b(hate|kill|murder|bomb|terrorist|suicide)\b',
            r'\b(nazi|hitler|genocide)\b',
            r'\b(rape|molest|abuse)\b',
        ]
    
    async def filter_input(self, messages: List[Dict[str, Any]], user_id: int) -> List[Dict[str, Any]]:
        """Filter input messages for safety and PII."""
        filtered_messages = []
        
        for message in messages:
            content = message.get("content", "")
            
            if self._detect_jailbreak(content):
                raise ValueError("Potential jailbreak attempt detected")
            
            if self._detect_toxic_content(content):
                raise ValueError("Toxic content detected")
            
            filtered_content = self._filter_pii(content)
            
            if len(filtered_content) > 8000:
                raise ValueError("Content too long")
            
            filtered_messages.append({
                **message,
                "content": filtered_content
            })
        
        return filtered_messages
    
    async def filter_output(self, content: str, user_id: int) -> str:
        """Filter output content for safety and PII."""
        filtered_content = self._filter_pii(content)
        
        if self._detect_toxic_content(filtered_content):
            return "[Content filtered due to safety concerns]"
        
        return filtered_content
    
    def _detect_jailbreak(self, content: str) -> bool:
        """Detect potential jailbreak attempts."""
        content_lower = content.lower()
        
        for pattern in self.jailbreak_patterns:
            if re.search(pattern, content_lower, re.IGNORECASE):
                return True
        
        return False
    
    def _detect_toxic_content(self, content: str) -> bool:
        """Detect toxic or harmful content."""
        content_lower = content.lower()
        
        for pattern in self.toxic_patterns:
            if re.search(pattern, content_lower, re.IGNORECASE):
                return True
        
        return False
    
    def _filter_pii(self, content: str) -> str:
        """Filter personally identifiable information."""
        filtered_content = content
        
        for pattern, pii_type in self.pii_patterns:
            filtered_content = re.sub(
                pattern,
                f"[{pii_type}_REDACTED]",
                filtered_content,
                flags=re.IGNORECASE
            )
        
        return filtered_content
    
    def calculate_risk_score(self, content: str) -> float:
        """Calculate risk score for content."""
        risk_score = 0.0
        
        if self._detect_jailbreak(content):
            risk_score += 0.8
        
        if self._detect_toxic_content(content):
            risk_score += 0.6
        
        for pattern, _ in self.pii_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                risk_score += 0.3
        
        return min(risk_score, 1.0)
