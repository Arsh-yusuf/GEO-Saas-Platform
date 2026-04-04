import json
import google.generativeai as genai
from app.core.config import GEMINI_API_KEY  # Use the shared config

# Configure Gemini with the key from our config
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_schema_llm(data: dict) -> dict:
    if not GEMINI_API_KEY:
        print("LLM skipped: No GEMINI_API_KEY provided.")
        return None

    try:
        # Using gemini-1.5-flash with deterministic settings
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.1,  # Low temperature for high consistency
                "response_mime_type": "application/json", # Ensures the output is valid JSON
            }
        )
        
        prompt = f"""
        Given the following webpage data, generate the SINGLE most appropriate 
        JSON-LD structured data object (Schema.org).

        Webpage Data:
        - Title: {data.get("title")}
        - Description: {data.get("meta_description")}
        - Headings: {data.get("headings")}

        Requirements:
        1. Identify the most specific Schema.org @type.
        2. Ensure valid JSON-LD structure using @context: https://schema.org.
        3. Return ONLY the raw JSON object.
        """

        response = model.generate_content(prompt)
        return json.loads(response.text.strip())

    except Exception as e:
        print(f"LLM failed: {e}")
        return None


def generate_schema_fallback(data: dict) -> dict:
    """
    Rule-based fallback schema
    """
    title = (data.get("title") or "").lower()
    description = (data.get("meta_description") or "").lower()
    headings = " ".join(data.get("headings", [])).lower()

    content = f"{title} {description} {headings}"

    if any(word in content for word in ["buy", "price", "product", "cart"]):
        schema_type = "Product"

    elif any(word in content for word in ["blog", "article", "read", "post"]):
        schema_type = "Article"

    elif any(word in content for word in ["news", "latest", "breaking"]):
        schema_type = "NewsMediaOrganization"

    elif any(word in content for word in ["about", "company", "services"]):
        schema_type = "Organization"

    else:
        schema_type = "WebPage"

    return {
        "@context": "https://schema.org",
        "@type": schema_type,
        "headline": data.get("title"),
        "description": data.get("meta_description")
    }


def generate_schema(data: dict) -> dict:
    """
    Main function:
    Try LLM → fallback if needed
    """
    schema = generate_schema_llm(data)

    if schema:
        return schema

    return generate_schema_fallback(data)