from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional

class AuditRequest(BaseModel):
    url: HttpUrl

class AuditResponse(BaseModel):
    title: Optional[str]
    meta_description: Optional[str]
    headings: List[str]
    image: Optional[str]
    json_ld: Dict