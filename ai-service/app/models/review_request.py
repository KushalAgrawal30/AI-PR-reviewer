from pydantic import BaseModel
from typing import List, Optional


class ChangedFile(BaseModel):
    path: str
    patch: str

class ReviewRequest(BaseModel):
    reviewJobId: str
    repository: str
    prNumber: int
    title: str
    description: Optional[str] = None
    changedFiles: List[ChangedFile]



