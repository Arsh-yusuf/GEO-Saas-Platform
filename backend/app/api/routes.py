from fastapi import APIRouter, HTTPException
from app.models.schemas import AuditRequest, AuditResponse
from app.utils.helpers import fetch_html
from app.services.scraper import extract_page_data
from app.services.schema_generator import generate_schema

router = APIRouter()

@router.post("/audit", response_model=AuditResponse)
def audit_page(request: AuditRequest):
    try:
        # Convert Pydantic HttpUrl object to string for libraries that expect strings
        url_str = str(request.url)
        html = fetch_html(url_str)
        page_data = extract_page_data(html, url_str)
        schema = generate_schema(page_data)

        return AuditResponse(
            title=page_data["title"],
            meta_description=page_data["meta_description"],
            headings=page_data["headings"],
            image=page_data["image"],
            json_ld=schema
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        print(f"CRITICAL ERROR in /audit: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")