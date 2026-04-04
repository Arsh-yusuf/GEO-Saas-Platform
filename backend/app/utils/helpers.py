import urllib3
import requests
import cloudscraper
from curl_cffi import requests as curl_requests

# Suppress InsecureRequestWarning if needed downstream
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

def fetch_html(url: str) -> str:
    errors = []

    # Strategy 1: curl_cffi with Chrome 120 
    try:
        r = curl_requests.get(url, impersonate="chrome120", timeout=15, headers=BROWSER_HEADERS)
        if r.status_code == 200: return r.text
        if r.status_code == 403: raise ValueError("403 Forbidden")
    except Exception as e:
        errors.append(f"Chrome120 strategy failed: {str(e)}")

    # Strategy 2: curl_cffi with Safari
    try:
        r = curl_requests.get(url, impersonate="safari15_5", timeout=15, headers=BROWSER_HEADERS)
        if r.status_code == 200: return r.text
        if r.status_code == 403: raise ValueError("403 Forbidden")
    except Exception as e:
        errors.append(f"Safari strategy failed: {str(e)}")

    # Strategy 3: Cloudscraper Fallback
    try:
        scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True})
        r = scraper.get(url, timeout=15, headers=BROWSER_HEADERS)
        if r.status_code == 200: return r.text
        if r.status_code == 403: raise ValueError("403 Forbidden")
    except Exception as e:
        errors.append(f"Cloudscraper strategy failed: {str(e)}")

    # Strategy 4: Basic Request
    try:
        r = requests.get(url, verify=False, timeout=10, headers=BROWSER_HEADERS)
        if r.status_code == 200: return r.text
    except Exception as e:
        pass

    raise ValueError(
        f"Access denied or scraping failed: '{url}' is blocking automated requests via advanced WAF. "
        "Error trace: " + " | ".join(errors)
    )

