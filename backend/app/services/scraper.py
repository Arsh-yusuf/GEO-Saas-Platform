from bs4 import BeautifulSoup
from urllib.parse import urljoin

def extract_page_data(html: str, url: str):
    soup = BeautifulSoup(html, "html.parser")

    title = soup.title.string.strip() if soup.title else "No Title"

    meta_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = meta_tag["content"].strip() if meta_tag and meta_tag.get("content") else "No Description"

    headings = []
    for tag in ["h1", "h2"]:
        for h in soup.find_all(tag):
            text = h.get_text(strip=True)
            if text and len(text) > 10:   # filter small UI text
                headings.append(text)

    # Limit to top 10 (clean output)
    headings = headings[:10]

    img_tag = soup.find("img")
    image = None
    if img_tag and img_tag.get("src"):
        image = urljoin(url, str(img_tag["src"]))

    return {
        "title": title,
        "meta_description": meta_description,
        "headings": headings,
        "image": image
    }