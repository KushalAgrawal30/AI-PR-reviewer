from fastapi import FastAPI
from app.api.review import router as review_router

app = FastAPI(title="AI Review Service")
app.include_router(review_router)

@app.get("/health")
def health():
    return {"message": "AI service is running"}