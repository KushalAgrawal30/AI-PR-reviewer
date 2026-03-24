from pydantic import BaseModel
from typing import List, Optional


class Finding(BaseModel):
    filePath: str
    line: int
    severity: str
    category: str
    title: str
    description: str
    suggestion: str
    confidence: float


class ReviewResponse(BaseModel):
    reviewJobId: str
    summary: str
    findings: List[Finding]


