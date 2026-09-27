import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

model_id = "openai/gpt-oss-20b"
print(f"Testing model: {model_id}")
completion = client.chat.completions.create(
    model=model_id,
    messages=[{"role": "user", "content": "Hello!"}],
    max_tokens=10,
)
print("Response:", completion.choices[0].message.content)

model_id = "qwen/qwen3.8-27b"
print(f"Testing model: {model_id}")
completion = client.chat.completions.create(
    model=model_id,
    messages=[{"role": "user", "content": "Hello!"}],
    max_tokens=10,
)
print("Response:", completion.choices[0].message.content)
