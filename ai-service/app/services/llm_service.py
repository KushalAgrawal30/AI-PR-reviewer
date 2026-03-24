import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "Qwen/Qwen2.5-Coder-7B-Instruct")
HF_PROVIDER = os.getenv("HF_PROVIDER", "nscale")


print("token:",HF_TOKEN)


client = InferenceClient(
    api_key=HF_TOKEN,
    provider=HF_PROVIDER
)

def generate_review_with_qwen(prompt: str) -> str:
    response = client.chat.completions.create(
        model=HF_MODEL,
        messages=[
            {"role": "system", "content": "You are an expert code reviewer."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=800,
        temperature=0.2
    )

    return response.choices[0].message.content