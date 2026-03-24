from fastapi import FastAPI

app = FastAPI(title="AI Review Service")

@app.get("/health")
def health():
    return {"message": "AI service is running"}