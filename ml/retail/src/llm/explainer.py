import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI


# Load .env from project root
PROJECT_ROOT = Path(__file__).resolve().parents[4]
load_dotenv(PROJECT_ROOT / ".env")


NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_MODEL = os.getenv(
    "NVIDIA_MODEL",
    "meta/llama-3.1-8b-instruct",
)


def get_client():
    if not NVIDIA_API_KEY:
        raise ValueError(
            "NVIDIA_API_KEY is missing. "
            "Add it to the .env file."
        )

    return OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=NVIDIA_API_KEY,
    )


def explain_decision(decision_data: dict) -> str:

    client = get_client()

    system_prompt = """
You are MarketMind AI's retail decision explanation assistant.

Your job is to explain an already-computed business decision.

IMPORTANT RULES:
1. Do NOT change the decision.
2. Do NOT calculate a different recommendation.
3. Do NOT invent missing data.
4. Do NOT invent numerical values.
5. Use only the information provided in the structured data.
6. Clearly distinguish real model outputs from demo signals when applicable.
7. Be concise and professional.
8. Explain WHY the decision was produced.
9. If a signal is marked as "demo", explicitly say that it is a demonstration input.
"""

    user_prompt = f"""
Explain the following MarketMind AI decision to a retail manager.

STRUCTURED DECISION DATA:

{decision_data}

Return:
- Recommendation
- Key reasons
- Important data points
- Data limitations

Keep the explanation concise.
"""

    response = client.chat.completions.create(
        model=NVIDIA_MODEL,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0.2,
        max_tokens=500,
    )

    return response.choices[0].message.content
