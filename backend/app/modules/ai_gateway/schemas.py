"""AI Gateway schemas."""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role (system, user, assistant)")
    content: str = Field(..., description="Message content")

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="Chat messages")
    provider: Optional[str] = Field(None, description="AI provider (openai, anthropic, etc.)")
    model: Optional[str] = Field(None, description="Model name")
    temperature: float = Field(0.7, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: int = Field(1000, ge=1, le=8000, description="Maximum tokens to generate")
    stream: bool = Field(False, description="Enable streaming response")

class ChatResponse(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[Dict[str, Any]]
    usage: Dict[str, int]

class ProviderConfig(BaseModel):
    name: str
    endpoint: str
    api_key: str
    default_model: str
    max_tokens: int
    rate_limit: str
    cost_per_token: float
    
    def get_headers(self) -> Dict[str, str]:
        """Get headers for API requests."""
        if self.name == "openai":
            return {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
        elif self.name == "anthropic":
            return {
                "x-api-key": self.api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
        else:
            return {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

class GuardrailsResult(BaseModel):
    filtered_content: str
    violations: List[str]
    risk_score: float
    action_taken: str

class UsageStats(BaseModel):
    user_id: int
    total_requests: int
    total_tokens: int
    total_cost: float
    requests_today: int
    tokens_today: int
    cost_today: float
    quota_remaining: int
