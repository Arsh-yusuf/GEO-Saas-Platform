# GEO (Generative Engine Optimization) Audit API Prototype

A full-stack prototype designed to evaluate the search visibility and AI "citation readiness" of public webpages. Built with a FastAPI backend and a modern React frontend (Cyberpunk Neon UI).

**Repository Link**: [INSERT_YOUR_GITHUB_OR_DRIVE_URL_HERE]

---

## 1. Setup Instructions & Architecture Overview

### Architecture Overview
The system consists of two decoupled components:
- **Backend (Python / FastAPI)**: Exposes a `/audit` endpoint that accepts a URL. It utilizes `cloudscraper` and `BeautifulSoup` to bypass basic anti-bot protection and parse the DOM. It then leverages Google's Gemini LLM (with a rule-based fallback) to generate semantically appropriate JSON-LD structured data.
- **Frontend (React / Vite / Framer Motion)**: A premium, modular dashboard that accepts user input, displays loading states, and cleanly visually separates the extracted elements (Headings, Meta, Image) from the generated Schema.org JSON string for easy copying.

### Setup Instructions

**Backend Setup**
1. Navigate to the `/backend` directory.
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root of the `/backend` folder and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the FastAPI server (runs on `localhost:8000` by default):
   ```bash
   uvicorn app.main:app --reload
   ```

**Frontend Setup**
1. Navigate to the `/frontend/geo-audit-ui` directory.
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server (runs on `localhost:5173` by default):
   ```bash
   npm run dev
   ```

---

## 2. Design Decision Log

### Stage 1: Breaking down the problem
The core objective was to extract standard SEO data and synthesize it into a JSON-LD recommendation for AI engines (GEO). The primary challenge was balancing extraction reliability against the complexity of the data generation process. 

### Stage 2: Choosing the Scraping Mechanism
*   **Options Considered**: 
    1. Standard `requests` + `BeautifulSoup`
    2. Headless Browsers (`Playwright` / `Selenium`)
    3. Python `cloudscraper`
*   **Decision**: I chose `cloudscraper` + `BeautifulSoup`.
*   **Reasoning**: While `requests` is standard, it gets blocked immediately by Cloudflare or advanced WAFs (e.g., Medium, Flipkart) because of its default TLS fingerprint. Playwright handles this easily but introduces massive overhead (downloading browser binaries, slow execution speed). `cloudscraper` provided the perfect middle ground—mimicking Chrome's TLS fingerprint to bypass 403 Forbidden/SSLEOF errors natively while keeping the audit extremely fast.

### Stage 3: Schema Generation (LLM vs Rule-Based Logic)
*   **Options Considered**:
    1. Pure deterministic logic (Regex/Keyword matching)
    2. Pure LLM generation
    3. Hybrid Model
*   **Decision**: Hybrid Approach — LLM as the primary engine with a Deterministic Fallback.
*   **Reasoning**: 
    *   *Where I used the LLM*: I used `gemini-1.5-flash` to process the scraped title, description, and headings to generate the JSON-LD. Rule-based logic is too brittle to capture the profound nuance of modern pages (e.g., understanding the difference between an *Article* about a product and a *Product* page itself). The LLM performs sophisticated semantic reasoning instantly to define the best `@type` and context.
    *   *Where I intentionally did not rely on the LLM*: I did *not* allow the LLM to govern the system if it fails. Because LLMs can hallucinate, experience rate limits, or suffer API outages, I wrote a deterministic fallback function. If the Gemini API fails, the code seamlessly drops into keyword-matching logic. This guarantees the API maintains 100% uptime and always returns a payload payload to the client.

---

## 3. Assumptions and Known Limitations

### Assumptions
*   **Target Scope**: The tool assumes the target URL is a standard static or Server-Side Rendered (SSR) public webpage where essential metadata and heading tags exist in the initial HTML payload.
*   **Public Access**: Assumes the URL doesn't require complex authentication or active user session cookies to view content.

### Known Limitations (And how I'd fix them)
1. **Single Page Applications (SPAs)**: Because the scraper reads the static HTML shell, it fails to evaluate heavily heavily client-side rendered elements (like YouTube or highly dynamic React apps) where headings and data are injected via JS post-load. *Fix: Upgrade to an asynchronous architecture using `Playwright` to allow full DOM rendering before extraction.*
2. **Aggressive Anti-Bot Firewalls**: Extremely protected sites like Medium.com utilizing the strictest Cloudflare algorithms intentionally block programmed scraping regardless of TLS impersonation. This prototype accepts this as a known limitation, opting for speed and simplicity rather than maintaining an arms race against CAPTCHAs.
3. **Schema Output Structure**: Currently, the LLM sets the JSON-LD format. While instructed strictly to output valid JSON, a deeper implementation would pass the JSON through rigorous Pydantic validation before sending it to the frontend to permanently eliminate any chance of mapping errors.
