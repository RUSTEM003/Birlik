"""AI Gateway 2.0 with routing, guardrails, and streaming."""
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Dict, Any, AsyncGenerator
import httpx
import json
import asyncio
import re
from ..auth.deps import get_current_user
from ...modules.identity.models import User
from .schemas import ChatRequest, ChatResponse, ProviderConfig
from .guardrails import GuardrailsEngine
from .providers import ProviderRouter
from ...core.config import settings

router = APIRouter(prefix="/ai", tags=["ai-gateway"])
limiter = Limiter(key_func=get_remote_address)

guardrails = GuardrailsEngine()
provider_router = ProviderRouter()

@router.post("/chat")
@limiter.limit("60/minute")
async def chat_completion(
    request: Request,
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Enhanced chat completion with guardrails and routing."""
    try:
        messages_dict = [msg.dict() for msg in chat_request.messages]
        
        filtered_messages = await guardrails.filter_input(
            messages_dict,
            user_id=current_user.id
        )
        
        provider = await provider_router.select_provider(
            chat_request.provider,
            chat_request.model,
            user_id=current_user.id
        )
        
        await provider_router.check_quotas(current_user.id, provider)
        
        provider_request = {
            "model": chat_request.model or provider.default_model,
            "messages": filtered_messages,
            "temperature": chat_request.temperature,
            "max_tokens": min(chat_request.max_tokens, provider.max_tokens),
            "stream": chat_request.stream
        }
        
        if chat_request.stream:
            return StreamingResponse(
                _stream_chat_completion(provider, provider_request, current_user.id),
                media_type="text/event-stream"
            )
        else:
            response = await _complete_chat(provider, provider_request, current_user.id)
            return ChatResponse(**response)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def _stream_chat_completion(
    provider: ProviderConfig,
    request: Dict[str, Any],
    user_id: int
) -> AsyncGenerator[str, None]:
    """Stream chat completion with output filtering."""
    try:
        async with httpx.AsyncClient(timeout=None) as client:
            headers = provider.get_headers()
            
            async with client.stream(
                "POST",
                provider.endpoint,
                headers=headers,
                json=request
            ) as response:
                response.raise_for_status()
                
                accumulated_content = ""
                async for chunk in response.aiter_text():
                    if chunk.strip():
                        if chunk.startswith("data: "):
                            data = chunk[6:].strip()
                            if data == "[DONE]":
                                break
                            
                            try:
                                chunk_data = json.loads(data)
                                content = chunk_data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                                
                                if content:
                                    accumulated_content += content
                                    
                                    filtered_content = await guardrails.filter_output(
                                        accumulated_content,
                                        user_id=user_id
                                    )
                                    
                                    yield f"data: {json.dumps(chunk_data)}\n\n"
                                    
                            except json.JSONDecodeError:
                                continue
                        
                        yield chunk
                        
    except httpx.HTTPError as e:
        error_chunk = {
            "error": {
                "message": f"Provider error: {str(e)}",
                "type": "provider_error"
            }
        }
        yield f"data: {json.dumps(error_chunk)}\n\n"

async def _complete_chat(
    provider: ProviderConfig,
    request: Dict[str, Any],
    user_id: int
) -> Dict[str, Any]:
    """Complete chat request with output filtering."""
    async with httpx.AsyncClient(timeout=30) as client:
        headers = provider.get_headers()
        
        response = await client.post(
            provider.endpoint,
            headers=headers,
            json=request
        )
        response.raise_for_status()
        
        result = response.json()
        
        if "choices" in result:
            for choice in result["choices"]:
                if "message" in choice and "content" in choice["message"]:
                    filtered_content = await guardrails.filter_output(
                        choice["message"]["content"],
                        user_id=user_id
                    )
                    choice["message"]["content"] = filtered_content
        
        return result

@router.get("/providers")
async def list_providers(current_user: User = Depends(get_current_user)):
    """List available AI providers and models."""
    return await provider_router.list_providers(current_user.id)

@router.get("/usage")
async def get_usage_stats(current_user: User = Depends(get_current_user)):
    """Get usage statistics for current user."""
    return await provider_router.get_usage_stats(current_user.id)
