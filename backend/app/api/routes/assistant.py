from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import client, api_key

router = APIRouter()

class AssistantRequest(BaseModel):
    message: str
    context: dict | None = None

class AssistantResponse(BaseModel):
    reply: str

@router.post("/", response_model=AssistantResponse)
def ask_assistant(request: AssistantRequest):
    if not client:
        return AssistantResponse(reply="Assistant is disabled. No GROQ_API_KEY provided.")
    
    system_prompt = "You are MarketMind AI, an expert business analyst. You help retail store owners understand their business data and make inventory purchasing decisions. Do not invent numbers. Only use the numbers provided in the context."
    
    if request.context:
        system_prompt += f"\nHere is the current business context to help answer the user's question:\n{request.context}"
        
    try:
        completion = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            max_tokens=300,
        )
        return AssistantResponse(reply=completion.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant error: {str(e)}")
