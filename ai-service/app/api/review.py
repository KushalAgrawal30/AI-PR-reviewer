from fastapi import APIRouter
from app.models.review_request import ReviewRequest
from app.models.review_response import ReviewResponse, Finding
from app.services.review_service import generate_mock_review

router = APIRouter()

@router.get("/review/test")
def test():
    return "Test router"


@router.post("/review", response_model=ReviewResponse)
def review_pull_request(request: ReviewRequest):
    return generate_mock_review(request)