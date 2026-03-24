import json

from app.models.review_request import ReviewRequest
from app.models.review_response import ReviewResponse, Finding
from app.prompts.review_prompt import build_review_prompt
from app.services.llm_service import generate_review_with_qwen

def generate_mock_review(request: ReviewRequest) -> ReviewResponse:
    
    prompt = build_review_prompt(
        request.repository,
        request.title,
        request.description,
        request.changedFiles
    )

    raw_output = generate_review_with_qwen(prompt)

    print("RAW MODEL OUTPUT:\n", raw_output)

    cleaned_output = raw_output.strip()

    if cleaned_output.startswith("```json"):
        cleaned_output = cleaned_output.replace("```json", "", 1).strip()

    if cleaned_output.startswith("```"):
        cleaned_output = cleaned_output.replace("```", "", 1).strip()

    if cleaned_output.endswith("```"):
        cleaned_output = cleaned_output[:-3].strip()

    parsed = json.loads(cleaned_output)

    findings = []
    for item in parsed.get("findings", []):
        findings.append(
            Finding(
                filePath=item["filePath"],
                line=item["line"],
                severity=item["severity"],
                category=item["category"],
                title=item["title"],
                description=item["description"],
                suggestion=item["suggestion"],
                confidence=item["confidence"]
            )
        )

    return ReviewResponse(
        reviewJobId=request.reviewJobId,
        summary=parsed.get("summary", "No summary provided."),
        findings=findings
    )